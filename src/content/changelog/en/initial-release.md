---
title: "MIND 0.1.0-alpha — Initial Public Release"
date: 2025-12-01
lang: en
type: research
version: "0.1.0-alpha"
---

## 0.1.0-alpha — Initial public release

Published alongside the EMNLP 2025 paper (pages 22024–22065). This is the first version that's meant for external use — the code was cleaned up, the Docker stack was made reproducible, and the web application was brought to a state where you don't need to read the source to use it.

### What's in this release

The web app handles the full workflow: upload a dataset, preprocess it, train a topic model, run detection, review results. No code required. Configure your LLM license and start detecting.

The CLI is also available for batch jobs, scripted experiments, and cases where you want to run detection on a schedule or pipe output into something else.

**Supported LLM backends:** Gemini (2.0-flash, 2.5-flash, etc), OpenAI (GPT-4o, GPT-4, GPT-3.5-turbo), Ollama, vLLM, and llama.cpp. One line in `config.yaml` switches between them. We strongly believe in a BYOL (Bring Your Own License) approach, more AI providers coming in the future.

**Ingestion formats:** CSV, Parquet, Markdown, YAML, XML, plain text, ZIP, TAR, 7z.

**ROSIE-MIND v2:** 651 annotated samples from health-domain Wikipedia (EN/ES), available on [HuggingFace](https://huggingface.co/collections/lcalvobartolome/mind-data-68e2a690025b4dc28c5e8458). Built with `BAAI/bge-m3` embeddings and `llama3.3:70b` as the LLM verifier.

### Known limitations

Neo4j and MongoDB connectors are not yet implemented — the codebase has hooks for them but they're not wired up. A CLI version of the web app features (not just the pipeline) is on the roadmap.

### Citation

```bibtex
@inproceedings{calvo2025discrepancy,
  title={Discrepancy Detection at the Data Level: Toward Consistent Multilingual Question Answering},
  author={Calvo-Bartolom{\'e}, Lorena and Aldana, Val{\'e}rie and Cantarero, Karla
          and de Mesa, Alonso Madro{\~n}al and Arenas-Garc{\'\i}a, Jer{\'o}nimo
          and Boyd-Graber, Jordan Lee},
  booktitle={Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing},
  pages={22024--22065},
  year={2025}
}
```
