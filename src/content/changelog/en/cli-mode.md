---
title: "MIND v0.2.0-alpha — CLI Experience Improved"
date: 2026-03-31
lang: en
type: research
version: "0.2.0-alpha"
---

## 0.2.0-alpha — Improved CLI mode

A complete command-line interface for MIND, enabling you to run the full detection pipeline without Docker or the web application. Once installed and configured, execute discrepancy detection directly from your terminal: **install, configure, detect, and MIND the inconsistencies!**


### What's in this release

#### Core Commands (Sorted by stage)

**Data Preprocessing**
- `mind data segment` — Segment raw documents into passages 
- `mind data translate` — Translate passages across language pairs with optional bilingual output
- `mind data prepare` — Prepare processed data for topic modeling 

**Topic Modeling**
- `mind tm train` — Train monolingual LDA or polylingual topic models.
- `mind tm label` — Generate human-readable topic labels using LLMs

**Discrepancy Detection**
- `mind detect run` — Execute the full inconsistency detection pipeline 
- `mind detect peek` — Visualize detection results with color-coded labels (Contradiction, Not Enough Info, No Discrepancy)

#### Key Features

- **Centralized Configuration** — All pipeline steps controlled via single `run_config.yaml` with optional system-wide config overrides
- **Rich CLI Output** — Progress bars, colored labels, structured panels, and better error messages
- **Low-resource Visualization** — Peek at results without external tools—table summaries, statistics, and sample data inline
- **Modular Processing** — Run preprocessing, modeling, and detection separately or as a complete pipeline

#### Improvements Over Previous Version

- Replaced ad-hoc Python scripts with a structured command-based interface
- Better error handling and logging
- Consistent configuration schema across all commands