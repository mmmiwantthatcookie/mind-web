---
title: "Quick-Start Guide"
description: "Run MIND on a real dataset from scratch, using the CLI pipeline."
date: 2025-12-01
lang: en
order: 1
---

# Quick-Start Guide

CLI walkthrough from raw text to a list of flagged discrepancies. Assumes you've installed the package (`uv pip install -e .`) and filled in `config/config.yaml` with an LLM backend.

## Prepare: segment

The pipeline starts from passages, not documents. The segmenter handles the splitting:

```bash
python3 src/mind/corpus_building/segmenter.py \
  --input data/my_corpus.csv \
  --output data/passages.parquet \
  --text_col text \
  --id_col doc_id
```

Run this separately for each language if you have multilingual data. The output is a Parquet file — one row per passage.

## Prepare: translate (skip if not needed)

If you have content in two languages and want to cross-check them, translate one side:

```bash
python3 src/mind/corpus_building/translator.py \
  --input data/passages_es.parquet \
  --output data/passages_es_en.parquet \
  --src_lang es \
  --tgt_lang en \
  --text_col text \
  --lang_col lang
```

## Prepare: pair the data

The data preparer takes an anchor corpus (source language) and a comparison corpus (target), matches them by topic similarity, and outputs the training format for the topic model.

```bash
python3 src/mind/corpus_building/data_preparer.py \
  --anchor data/passages_en.parquet \
  --comparison data/passages_es.parquet \
  --output data/prepared.parquet \
  --schema config/schema.json
```

The schema is a small JSON file that maps your column names to what MIND expects. Copy the example from `config/` and adjust field names.

## Train a topic model

The Polylingual Topic Model (PLTM) clusters passages by theme across both languages:

```bash
python3 src/mind/topic_modeling/polylingual_tm.py \
  --input data/prepared.parquet \
  --lang1 en \
  --lang2 es \
  --model_folder models/my_tm/ \
  --num_topics 30
```

30 topics is a reasonable starting point for a corpus of a few thousand documents. Output includes `thetas_en.parquet` and `thetas_es.parquet` — each row is a topic distribution for one passage.

Once trained, you can inspect the top words per topic in the `models/` directory. Discard topics that look like noise before running detection.

## Run detection

Pass the corpus files, topic distributions, and a list of topic IDs to analyze:

```bash
python3 src/mind/pipeline/cli.py \
  --src_corpus_path data/passages_en.parquet \
  --src_thetas_path models/my_tm/thetas_en.parquet \
  --src_lang_filter en \
  --tgt_corpus_path data/passages_es.parquet \
  --tgt_thetas_path models/my_tm/thetas_es.parquet \
  --tgt_lang_filter es \
  --topics 0 1 4 7 \
  --path_save results/
```

## Review results

Results land in `results/` as a Parquet file. Load in a notebook or push into the web app. Each row has:

- the source and target passages
- the generated question that exposed the discrepancy
- the NLI score and the LLM's explanation
- a verdict label

## Try it with ROSIE-MIND

To test without your own data, the annotated benchmark dataset is on HuggingFace:

```python
from datasets import load_dataset

ds = load_dataset("lcalvobartolome/rosie_mind", split="train")
ds.to_parquet("data/rosie_mind.parquet")
```

651 samples, health-domain Wikipedia EN/ES, human-annotated. The v2 split used `BAAI/bge-m3` for embeddings and `llama3.3:70b` for LLM verification — a reasonable target configuration for comparison.
