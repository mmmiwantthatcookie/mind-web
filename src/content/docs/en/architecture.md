---
title: "Architecture"
description: "How MIND's four-service stack and modular pipeline fit together."
date: 2025-12-01
lang: en
order: 2
tags: ["architecture", "pipeline", "docker", "services"]
---

# Architecture

Two layers: a **web application** (four Docker services) wrapping a **Python library** (`src/mind/`) that does the actual work.

## Service stack

```
┌─────────────────────────────────────────────────┐
│              Frontend  :5050                    │
│        Flask + Jinja2 · User Interface          │
└────────────┬────────────────────┬───────────────┘
             │                    │
     ┌───────▼────────┐  ┌───────▼────────┐
     │ Backend :5001   │  │  Auth  :5002   │
     │ Pipeline Engine │  │  Sessions &    │
     │ ML workloads    │  │  user accounts │
     └───────┬─────────┘  └───────┬────────┘
             │                    │
     ┌───────▼────────────────────▼────────┐
     │         PostgreSQL  :5432           │
     └─────────────────────────────────────┘
```

The services share an internal Docker network. Auth is deliberately separate — swap it out without touching the pipeline. PostgreSQL stores datasets, topic models, and detection results persistently.

## Pipeline internals

```
Raw data → Segmenter → Translator → Data Preparer → Topic Model
                                                         │
                                      ┌──────────────────┤
                                      │                  │
                                Question          Discrepancy
                                Generation        Detection
                                      │                  │
                                Hybrid Retrieval   NLI + LLM
                                (FAISS + Topics)   Verification
```

### Segmenter

Splits raw files into overlapping passages — typically 3–5 sentences each. Accepts CSV, Parquet, Markdown, YAML, XML, plain text, and archives. Outputs a Parquet file with one row per passage. For multilingual corpora, segment each language separately.

### Translator

Optional. Takes segmented passages and translates between two languages using a configured backend. If your data is already in parallel form, skip this entirely.

### Data Preparer

Pairs source and target passages and maps your column names to MIND's expected schema. The schema file is a small JSON in `config/` — one field per column. This step produces the training data for the topic model.

### Polylingual Topic Model

Clusters passages by theme across languages using multilingual embeddings (default: `BAAI/bge-m3`) and FAISS. You set the number of topics. Output is a topic distribution (`thetas`) for each passage — a vector of weights summing to 1. The model doesn't need aligned sentence pairs; it works at the corpus level.

### Detection

For each topic you select:

1. An LLM generates questions whose answers should be consistent across all passages in that topic
2. FAISS + topic weights retrieve the most relevant passages for each question (hybrid retrieval)
3. An NLI model gives a fast initial verdict; the LLM verifies and explains

The result is a table of flagged passage pairs, each with the original text, the triggering question, the verdict, and the NLI confidence score.

## LLM backends

One line in `config/config.yaml` sets the active backend. No code changes.

| Backend | Notes |
|---------|-------|
| **Gemini** | `gemini-2.5-flash`, `gemini-2.0-flash` — fastest in our tests |
| **OpenAI** | `gpt-4o`, `gpt-4`, `gpt-3.5-turbo` |
| **Ollama** | Local — `qwen2.5:32b`, `llama3.3:70b` work well |
| **vLLM** | Any HuggingFace model via OpenAI-compatible API |
| **llama.cpp** | GGUF models, local server |

Ollama is the practical default if you'd rather not send data to an external API.

## Configuration

`config/config.yaml` controls everything. The file is volume-mounted in Docker — edit it and restart the backend container, no rebuild needed.

| Section | Controls |
|---------|---------|
| `logger` | Log directory, verbosity, rotation |
| `optimization` | `balanced`, `memory_optimized`, `speed_optimized` |
| `mind` | Top-k retrieval, batch size, embedding/NLI models, prompt paths |
| `llm` | Active backend, model name, temperature, per-backend lists |
