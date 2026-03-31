---
title: "MIND CLI Complete Guide"
description: "End-to-end guide to using the MIND command-line interface for multilingual inconsistency detection workflows."
date: 2026-04-01
lang: en
order: 2
---

# MIND CLI Complete Guide

This guide covers the complete MIND workflow: raw documents to translation to topic modeling to detection. It assumes you have Python installed and some command-line experience.

## Overview

The MIND CLI has three command groups: `mind data` for preprocessing, `mind tm` for topic modeling, and `mind detect` for the detection pipeline. Everything is configured via YAML, which you can template with `mind detect init-config`.

## Setup

Install MIND with:

```bash
pip install -e .
```

You need two config files:

1. **`config/config.yaml`** — LLM backend, logging, cache paths. Set once, shared across all runs.
2. **`run_config.yaml`** — Job-specific: data paths, language pairs, topic IDs. Changes per experiment.

To create a template:

```bash
mind detect init-config --output run_config.yaml
```

Uncomment the sections you need (data, tm, detect) and fill in paths.

If your system config is in a non-standard location, pass it explicitly:

```bash
mind data segment --config run_config.yaml --system-config /path/to/config.yaml
```

Most commands accept `--system-config`. If you keep `config/config.yaml` in the repo root, you can omit this flag.

---

## Data Preprocessing

### `mind data segment`

Splits documents into passages. Reads Parquet/CSV, outputs one row per passage.

```bash
mind data segment --config run_config.yaml
```

Config:

```yaml
data:
  segment:
    input: data/raw/documents.parquet
    output: data/processed/segmented
    text_col: text
    id_col: doc_id
    min_length: 100
    separator: "\n"
```

- `separator` is the split delimiter. Use `\n` for newlines, `\n\n` for paragraphs.
- Splits shorter than `min_length` are dropped.
- Output is a single Parquet file with `chunk_id`, `text`, and metadata columns.

Run once on mixed-language data, or separately per language if you prefer.

### `mind data translate`

Translates passages between EN↔ES, EN↔DE, EN↔IT. Two modes:

**Monolingual (default):** Translates source language to target, appends to dataset.

```bash
mind data translate --config run_config.yaml
```

```yaml
data:
  translate:
    input: data/segmented
    output: data/translated
    src_lang: en
    tgt_lang: es
    text_col: text
    lang_col: lang
    bilingual: false
```

Takes `lang == "en"` rows, translates to Spanish, outputs one file.

**Bilingual:** For mixed-language data. Splits by language, translates both directions (EN→ES and ES→EN), outputs two files ready for `mind data prepare`.

```bash
mind data translate --config run_config.yaml --bilingual
```

```yaml
data:
  translate:
    input: data/segmented
    output: data/translated
    src_lang: en
    tgt_lang: es
    text_col: text
    lang_col: lang
    bilingual: true
```

Produces `data/translated_en2es` and `data/translated_es2en`—use these as anchor and comparison in the next step.

### `mind data prepare`

Pairs anchor (source) and comparison (target) corpora, matches passages by similarity, formats for topic modeling.

```bash
mind data prepare --config run_config.yaml
```

```yaml
data:
  prepare:
    anchor: data/translated_en2de
    comparison: data/translated_de2en
    output: data/prepared
    schema:
      chunk_id: chunk_id
      text: text
      lang: lang
      full_doc: full_doc
      doc_id: doc_id
    nlpipe_script: externals/NLPipe/src/nlpipe/cli.py
    nlpipe_config: externals/NLPipe/config.json
    stw_path: externals/NLPipe/src/nlpipe/stw_lists
    spacy_models:
      en: en_core_web_sm
      de: de_core_news_sm
```

The `schema` maps your column names to what MIND expects. If your data already has the right column names, keep it minimal. The preparer internally handles tokenization and NLP preprocessing.

---

## Topic Modeling

### `mind tm train`

Trains a topic model. Use Polylingual TM for two languages, LDA for one.

```bash
mind tm train --config run_config.yaml
```

**Bilingual (Polylingual TM):**

```yaml
tm:
  train:
    input: data/prepared
    lang1: en
    lang2: de
    model_folder: models/tm_ende
    num_topics: 30
    alpha: 1.0
    mallet_path: externals/Mallet-202108/bin/mallet
    stops_path: src/mind/topic_modeling/stops
```

Outputs: `doc_topics_en.npz`, `doc_topics_de.npz` (topic distributions), `topics.npz` (topic-word matrix), `vocabulary.pkl`.

**Monolingual (LDA):**

```yaml
tm:
  train:
    input: data/prepared
    lang1: en
    lang2: null
    model_folder: models/lda
    num_topics: 30
    alpha: 1.0
    mallet_path: externals/Mallet-202108/bin/mallet
```

For 1–10k documents, 20–50 topics is typical. Start with 30, then review top words per topic to filter noise before detection.

### `mind tm label`

Generates human-readable topic labels using an LLM.

```bash
mind tm label --config run_config.yaml
```

```yaml
tm:
  label:
    model_folder: models/tm_ende
    lang1: en
    lang2: de
```

The LLM is queried with the top N words in each topic and returns a label. Labels are saved in the model folder.

Override the LLM:

```bash
mind tm label --config run_config.yaml \
  --llm-model llama3.3:70b \
  --llm-server http://localhost:11434
```

---

## Detection

### `mind detect init-config`

Scaffolds a template `run_config.yaml`:

```bash
mind detect init-config --output run_config.yaml
```

Uncomment the sections you need (data, tm, detect) and fill in paths.

### `mind detect run`

The main detection command. Loads corpora, matches by topic, generates questions, detects inconsistencies.

```bash
mind detect run --config run_config.yaml
```

Minimal config:

```yaml
detect:
  monolingual: false
  topics: [1, 2, 3]
  sample_size: null
  path_save: results
  method: TB-ENN
  do_weighting: true
  do_check_entailment: false
  selected_categories: null
  source:
    corpus_path: data/corpus_en.parquet
    thetas_path: data/thetas_en.npz
    id_col: doc_id
    passage_col: text
    full_doc_col: full_doc
    lang_filter: EN
    filter_ids_path: null
  target:
    corpus_path: data/corpus_de.parquet
    thetas_path: data/thetas_de.npz
    id_col: doc_id
    passage_col: text
    full_doc_col: full_doc
    lang_filter: DE
    index_path: indexes
```

Key options:

- `topics`: 1-indexed IDs. MIND processes one topic at a time.
- `sample_size`: Limit passages per topic for testing. `null` = all.
- `method`: `TB-ENN` (embedding-based, default) or `BM25` (keyword-based).
- `monolingual`: Set true for same-language comparisons (e.g., dialects).
- `do_check_entailment`: Lightweight NLI check before LLM labeling (slower, catches some false positives).
- `filter_ids_path`: File with one ID per line—only these passages run.
- `lang_filter`: Narrows loaded passages. If no language column, use same value for both.

Command-line overrides:

```bash
mind detect run --config run_config.yaml \
  --topics 5,7 \
  --sample-size 50 \
  --llm-model llama3.3:70b \
  --llm-server http://localhost:11434 \
  --check-entailment
```

Flags override config, so no need for separate configs per experiment.

**Dry run (validate without writing output):**

```bash
mind detect run --config run_config.yaml --dry-run
```

**Log to file:**

```bash
mind detect run --config run_config.yaml --log-file run.log
```

### `mind detect peek`

Inspects and summarizes detection results:

```bash
mind detect peek results/
```

Shows: label counts/percentages, breakdown by topic, sample results.

Common options:

```bash
mind detect peek results/ --topic 3
mind detect peek results/ --label CONTRADICTION
mind detect peek results/ --limit 10
mind detect peek results/ --export summary.csv
```

Results are consolidated into `mind_results.parquet`, which `peek` reads.

---

## Configuration

### Managing Configs

Keep separate `run_config.yaml` files per experiment:

```
runs/
├── run_config_en_de.yaml
├── run_config_test.yaml
└── run_config_mono.yaml
```

```bash
mind detect run --config runs/run_config_en_de.yaml
```

### Reusing Trained Models

Train once, run detection multiple times:

```bash
mind tm train --config run_config.yaml

mind detect run --config run_config.yaml --topics 1,2,3
mind detect run --config run_config.yaml --topics 10,15,20
```

### Quick Iteration

Use flags to avoid rewriting config:

```bash
# Test with small sample, no output
mind detect run --config run_config.yaml --sample-size 10 --dry-run

# Run on 100 passages
mind detect run --config run_config.yaml --sample-size 100

# Full run
mind detect run --config run_config.yaml
```

---

## Examples

**From raw data to detection:**

```bash
mind data segment --config run_config.yaml
mind data translate --config run_config.yaml --bilingual
mind data prepare --config run_config.yaml
mind tm train --config run_config.yaml
mind tm label --config run_config.yaml
mind detect run --config run_config.yaml --topics 1,2,3
```

**Detect with pre-trained model:**

```bash
mind detect run --config run_config.yaml --topics 5,10
mind detect peek results/
```

**Quick test then full run:**

```bash
mind detect run --config run_config.yaml --sample-size 10 --dry-run
mind detect run --config run_config.yaml
```

---

## Troubleshooting

**"Run config must contain a 'detect' section"**

Check that `detect:` is uncommented and properly indented (YAML is whitespace-sensitive).

**"Unsupported language pair"**

Translator supports EN↔ES, EN↔DE, EN↔IT only. Use external tools for other pairs, then pass output to `mind data prepare`.

**"No topics matching filter"**

Topic IDs are 1-indexed. For 30 topics, valid IDs are 1–30. Check your config or use `mind detect peek results/`.

**LLM server unreachable**

Test with `curl http://localhost:11434/api/tags` (Ollama) or ensure `XXX_API_KEY` is set. Check `config/config.yaml`.

**Out of memory during topic modeling**

Polylingual TM loads the full corpus. For >100k documents:
1. Reduce `num_topics`.
2. Train on smaller batches separately.
3. Use more RAM.

**Detection is slow**

Likely causes:
1. **Retrieval**: Use `--sample-size` for testing.
2. **LLM**: Reduce `num_topics` or `selected_categories`.
3. **Disk I/O**: Use local storage, not network mounts.

---

## Python API

MIND's core is a Python library. For programmatic use:

```python
from mind.pipeline.pipeline import MIND

mind = MIND(
    source_corpus={
        "corpus_path": "data/corpus_en.parquet",
        "thetas_path": "data/thetas_en.npz",
        "id_col": "doc_id",
        "passage_col": "text",
        "lang_filter": "EN",
    },
    target_corpus={
        "corpus_path": "data/corpus_de.parquet",
        "thetas_path": "data/thetas_de.npz",
        "id_col": "doc_id",
        "passage_col": "text",
        "lang_filter": "DE",
    },
    retrieval_method="TB-ENN",
    config_path="config/config.yaml",
)

results = mind.run_pipeline(topics=[0, 1, 2], sample_size=None, path_save="results/")
```

See module docstrings for details.
