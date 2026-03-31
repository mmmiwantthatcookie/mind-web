---
title: "Guía Completa de MIND CLI"
description: "Guía de extremo a extremo para usar la interfaz de línea de comandos de MIND para flujos de trabajo de detección de inconsistencias multilingües."
date: 2026-03-31
lang: es
order: 2
---

# Guía Completa de MIND CLI

Esta guía cubre el flujo de trabajo completo de MIND: desde documentos sin procesar hasta traducción, modelado de temas y detección. Asume que tienes Python instalado y experiencia con línea de comandos.

## Descripción General

MIND CLI tiene tres grupos de comandos: `mind data` para preprocesamiento, `mind tm` para modelado de temas y `mind detect` para la canalización de detección. Todo se configura mediante YAML, que puedes plantillar con `mind detect init-config`.

## Configuración

Instala MIND con:

```bash
pip install -e .
```

Necesitas dos archivos de configuración:

1. **`config/config.yaml`** — Backend LLM, logging, rutas de caché. Se configura una vez, se comparte entre todas las ejecuciones.
2. **`run_config.yaml`** — Específico del trabajo: rutas de datos, pares de idiomas, IDs de temas. Cambia por experimento.

Para crear una plantilla:

```bash
mind detect init-config --output run_config.yaml
```

Descomenta las secciones que necesites (data, tm, detect) y completa las rutas.

Si tu configuración del sistema está en una ubicación no estándar, pásala explícitamente:

```bash
mind data segment --config run_config.yaml --system-config /path/to/config.yaml
```

La mayoría de comandos aceptan `--system-config`. Si mantienes `config/config.yaml` en la raíz del repositorio, puedes omitir esta bandera.

---

## Preprocesamiento de Datos

### `mind data segment`

Divide documentos en pasajes. Lee Parquet/CSV, genera una fila por pasaje.

```bash
mind data segment --config run_config.yaml
```

Configuración:

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

- `separator` es el delimitador de división. Usa `\n` para saltos de línea, `\n\n` para párrafos.
- Los fragmentos más cortos que `min_length` se descartan.
- La salida es un único archivo Parquet con columnas `chunk_id`, `text` y metadatos.

Ejecuta una vez en datos multilingües, o por separado para cada idioma si lo prefieres.

### `mind data translate`

Traduce pasajes entre EN↔ES, EN↔DE, EN↔IT. Dos modos:

**Monolingüe (predeterminado):** Traduce idioma fuente al destino, añade al conjunto de datos.

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

Toma filas con `lang == "en"`, traduce al español, genera un archivo.

**Bilingüe:** Para datos multilingües. Divide por idioma, traduce en ambas direcciones (EN→ES y ES→EN), genera dos archivos listos para `mind data prepare`.

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

Produce `data/translated_en2es` y `data/translated_es2en`—úsalos como ancla y comparación en el siguiente paso.

### `mind data prepare`

Empareja corpus ancla (fuente) y comparación (destino), equipara pasajes por similitud, formatea para modelado de temas.

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

El `schema` mapea tus nombres de columnas a lo que MIND espera. Si tus datos ya tienen los nombres correctos, mantenlo mínimo. El preparador maneja internamente tokenización y preprocesamiento de NLP.

---

## Modelado de Temas

### `mind tm train`

Entrena un modelo de temas. Usa TM Políglota para dos idiomas, LDA para uno.

```bash
mind tm train --config run_config.yaml
```

**Bilingüe (TM Políglota):**

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

Salidas: `doc_topics_en.npz`, `doc_topics_de.npz` (distribuciones de temas), `topics.npz` (matriz tema-palabra), `vocabulary.pkl`.

**Monolingüe (LDA):**

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

Para 1–10k documentos, 20–50 temas es típico. Comienza con 30, luego revisa las palabras principales por tema para filtrar ruido antes de la detección.

### `mind tm label`

Genera etiquetas de temas legibles usando un LLM.

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

El LLM se consulta con las N palabras principales de cada tema y retorna una etiqueta. Las etiquetas se guardan en la carpeta del modelo.

Sobrescribe el LLM:

```bash
mind tm label --config run_config.yaml \
  --llm-model llama3.3:70b \
  --llm-server http://localhost:11434
```

---

## Detección

### `mind detect init-config`

Genera una plantilla `run_config.yaml`:

```bash
mind detect init-config --output run_config.yaml
```

Descomenta las secciones que necesites (data, tm, detect) y completa las rutas.

### `mind detect run`

El comando de detección principal. Carga corpus, equipara por tema, genera preguntas, detecta inconsistencias.

```bash
mind detect run --config run_config.yaml
```

Configuración mínima:

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

Opciones clave:

- `topics`: IDs indexados desde 1. MIND procesa un tema a la vez.
- `sample_size`: Limita pasajes por tema para pruebas. `null` = todos.
- `method`: `TB-ENN` (basado en incrustaciones, predeterminado) o `BM25` (basado en palabras clave).
- `monolingual`: Establece true para comparaciones del mismo idioma (p. ej., dialectos).
- `do_check_entailment`: Verificación NLI ligera antes del etiquetado LLM (más lento, captura algunos falsos positivos).
- `filter_ids_path`: Archivo con un ID por línea—solo estos pasajes se ejecutan.
- `lang_filter`: Estrecha los pasajes cargados. Si no hay columna de idioma, usa el mismo valor para ambos.

Sobrescrituras de línea de comandos:

```bash
mind detect run --config run_config.yaml \
  --topics 5,7 \
  --sample-size 50 \
  --llm-model llama3.3:70b \
  --llm-server http://localhost:11434 \
  --check-entailment
```

Las banderas sobrescriben la configuración, así que no necesitas configuraciones separadas por experimento.

**Ejecución simulada (validar sin escribir salida):**

```bash
mind detect run --config run_config.yaml --dry-run
```

**Registrar en archivo:**

```bash
mind detect run --config run_config.yaml --log-file run.log
```

### `mind detect peek`

Inspecciona y resume resultados de detección:

```bash
mind detect peek results/
```

Muestra: conteos/porcentajes de etiquetas, desglose por tema, resultados de muestra.

Opciones comunes:

```bash
mind detect peek results/ --topic 3
mind detect peek results/ --label CONTRADICTION
mind detect peek results/ --limit 10
mind detect peek results/ --export summary.csv
```

Los resultados se consolidan en `mind_results.parquet`, que `peek` lee.

---

## Configuración

### Gestionar Configuraciones

Mantén archivos `run_config.yaml` separados por experimento:

```
runs/
├── run_config_en_de.yaml
├── run_config_test.yaml
└── run_config_mono.yaml
```

```bash
mind detect run --config runs/run_config_en_de.yaml
```

### Reutilizar Modelos Entrenados

Entrena una vez, ejecuta detección múltiples veces:

```bash
mind tm train --config run_config.yaml

mind detect run --config run_config.yaml --topics 1,2,3
mind detect run --config run_config.yaml --topics 10,15,20
```

### Iteración Rápida

Usa banderas para evitar reescribir la configuración:

```bash
# Prueba con muestra pequeña, sin salida
mind detect run --config run_config.yaml --sample-size 10 --dry-run

# Ejecuta en 100 pasajes
mind detect run --config run_config.yaml --sample-size 100

# Ejecución completa
mind detect run --config run_config.yaml
```

---

## Ejemplos

**Desde datos sin procesar hasta detección:**

```bash
mind data segment --config run_config.yaml
mind data translate --config run_config.yaml --bilingual
mind data prepare --config run_config.yaml
mind tm train --config run_config.yaml
mind tm label --config run_config.yaml
mind detect run --config run_config.yaml --topics 1,2,3
```

**Detectar con modelo preentrenado:**

```bash
mind detect run --config run_config.yaml --topics 5,10
mind detect peek results/
```

**Prueba rápida luego ejecución completa:**

```bash
mind detect run --config run_config.yaml --sample-size 10 --dry-run
mind detect run --config run_config.yaml
```

---

## Solución de Problemas

**"Run config must contain a 'detect' section"**

Verifica que `detect:` esté descomentado e indentado correctamente (YAML es sensible a espacios en blanco).

**"Unsupported language pair"**

El traductor soporta solo EN↔ES, EN↔DE, EN↔IT. Usa herramientas externas para otros pares, luego pasa la salida a `mind data prepare`.

**"No topics matching filter"**

Los IDs de temas están indexados desde 1. Para 30 temas, los IDs válidos son 1–30. Revisa tu configuración o usa `mind detect peek results/`.

**LLM server unreachable**

Prueba con `curl http://localhost:11434/api/tags` (Ollama) o asegúrate de que `OPENAI_API_KEY` está configurada. Revisa `config/config.yaml`.

**Out of memory during topic modeling**

TM Políglota carga el corpus completo en memoria. Para >100k documentos:
1. Reduce `num_topics`.
2. Entrena en lotes más pequeños por separado.
3. Usa más RAM.

**Detection is slow**

Causas probables:
1. **Retrieval**: Usa `--sample-size` para pruebas.
2. **LLM**: Reduce `num_topics` o `selected_categories`.
3. **Disk I/O**: Usa almacenamiento local, no montajes de red.

---

## Python API

El núcleo de MIND es una biblioteca Python. Para uso programático:

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

Consulta los docstrings del módulo para más detalles.
