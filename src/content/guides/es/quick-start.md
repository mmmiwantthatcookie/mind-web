---
title: "Guía de Inicio Rápido"
description: "Pon MIND en marcha en menos de 10 minutos con esta guía paso a paso."
date: 2025-12-01
lang: es
order: 1
---

# Guía de inicio rápido

CLI walkthrough from raw text to a list of flagged discrepancies. Assumes you've installed the package (`uv pip install -e .`) and filled in `config/config.yaml` with an LLM backend.

## Preparación: segmentar

La pipeline trabaja con pasajes, no con documentos. El segmentador se encarga de dividirlos en trozos más manejables.

```bash
python3 src/mind/corpus_building/segmenter.py \
  --input data/my_corpus.csv \
  --output data/passages.parquet \
  --text_col text \
  --id_col doc_id
```

Ejecuta este paso por separado para cada idioma si tienes data bilingüe. El output es un fichero Parquet, con una fila por pasaje.

## Preparación: traducción (saltar si no es necesario)

Si tienes contenido en dos idiomas, traduce uno de ellos para igualar la data:

```bash
python3 src/mind/corpus_building/translator.py \
  --input data/passages_es.parquet \
  --output data/passages_es_en.parquet \
  --src_lang es \
  --tgt_lang en \
  --text_col text \
  --lang_col lang
```


## Prepara: emparejar los datos

Este paso empareja tu corpus ancla y tu corpus objetivo creando una estructura simétrica. El output son esos mismos datos ahora listos para el modelado de tópicos

```bash
python3 src/mind/corpus_building/data_preparer.py \
  --anchor data/passages_en.parquet \
  --comparison data/passages_es.parquet \
  --output data/prepared.parquet \
  --schema config/schema.json
```

El schema de configuración es un fichero JSON que relaciona tus nombres de columnas con el input que MIND espera. Copia el ejemplo de `config/` y ajusta los nombres.

## Entrenar el modelo de tópicos

El Modelo de Tópicos Polilingüe (PLTM) agrupa pasajes por temática en ambos idiomas:

```bash
python3 src/mind/topic_modeling/polylingual_tm.py \
  --input data/prepared.parquet \
  --lang1 en \
  --lang2 es \
  --model_folder models/my_tm/ \
  --num_topics 30
```

Para miles de documentos, unos 25 tópicos es un punto de partida razonable. Los outputs de esta fase incluyen `thetas_en.parquet` y `thetas_es.parquet`, cada fila es una distribución de tópicos para un pasaje.

Al acabar el entrenamiento, puedes inspeccionar las palabras más relevantes en la carpeta `models/`.

## Detectar

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

Each topic ID runs independently, so you can parallelize across them if needed. Runtime scales with corpus size and the LLM backend — Gemini Flash is fast; local Ollama on CPU is slow.

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
