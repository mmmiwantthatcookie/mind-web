---
title: "Guía de Inicio Rápido"
description: "Pon MIND en marcha en menos de 10 minutos con esta guía paso a paso."
date: 2025-12-01
lang: es
order: 1
---

# Guía de inicio rápido

Tutorial de la herramienta CLI desde el documento hasta la tabla de discrepancias. Asume que has instalado el paquete y rellenado el archivo de configuración `config/config.yaml` y el `.env` con una selección de LLM.

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

Utiliza de argumentos los ficheros del corpus, las distribuciones de tópicos, y una lista de tópicos para analizar.

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

## Revisar los resultados

El ooutput se guarda en `results/` como un fichero Parquet. Cada fila tiene:

- pasajes fuente y objetivo
- la pregunta que expuso la discrepancia
- explicaciones de NLI y razonamiento del LLM
- la clasisficación de discrepancias

## Pruébalo con ROSIE-MIND

Si no deseas probarlo con tus datos, el dataset de benchmark está en HuggingFace:

```python
from datasets import load_dataset

ds = load_dataset("lcalvobartolome/rosie_mind", split="train")
ds.to_parquet("data/rosie_mind.parquet")
```

651 muestras,en Español e Inglés, especializado en el salud. El Split-V2 usóv los embeddings `BAAI/bge-m3` y `llama3.3:70b` como LLM.
