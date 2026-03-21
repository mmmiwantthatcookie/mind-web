---
title: "Descripción de la Arquitectura"
description: "Comprende la arquitectura modular del pipeline MIND, incluyendo la ingestión de datos, modelado de temas y detección de discrepancias."
date: 2025-12-01
lang: es
order: 2
tags: ["arquitectura", "pipeline", "docker", "servicios"]
---


# Arquitectura

Basada en dos capas: una **app web** (con cuatro microservicios Docker) que utilizan la **librería de Python** (`src/mind/`), encargada del procesamiento.

## Stack de servicios

```
┌─────────────────────────────────────────────────┐
│              Frontend  :5050                    │
│        Flask + Jinja2 · User Interface          │
└────────────┬────────────────────┬───────────────┘
             │                    │
     ┌───────▼─────────┐  ┌───────▼────────┐
     │ Backend :5001   │  │  Auth  :5002   │
     │ Motor de la app │  │  Sesión &      │
     │ ML workloads    │  │  multi-cuentas │
     └───────┬─────────┘  └───────┬────────┘
             │                    │
     ┌───────▼────────────────────▼────────┐
     │         PostgreSQL  :5432           │
     └─────────────────────────────────────┘
```

Los servicios comparten una red de Docker interna. De manera deliberada hemos separado el módulo Auth, podemos cambiarlo por soluciones Cloud-Native sin modificar la pipeline principal. PostgreSQL almacena los datasets, modelos de tópicos, y resultados de detección entre sesiones.

## Arquitectura interna de la Pipeline

```
Raw data → Segmentador → Translator → Data Preparer → Topic Model
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

Divide los datos en crudo en pasajes individuales de unas 3-5 oraciones de extensión. Acepta CSV, Parquet, Markdown, YAML, XML, texto plano y otros. Su output es un fichero Parquet con una fila por pasaje. Para corpora multilingüe, segmenta cada idioma por separado.

### Translator

Solamente se usa en corpora multilingüe y en data no alineada, en monolingüe no llega a ser invocado. Traduce pasajes segmentados entre dos lenguajes con un modelo de traducción. 


### Data Preparer

Empareja pasajes `fuente` y `objetivo` y ajusta los nombres de columna al schema predeterminado de MIND. Este schema es un JSON en `config/` con un campo por columna. Al final de este paso tenemos los datos de entrenamiento listos para el modelado de tópicos.

### Modelado de Tópicos Polilingual

Agrupa los pasajes organizándolos por temática, para ello utliza embeddings multilingües (por defecto: ) y FAISS. El número de tópicos lo seleccionas tú. El output es una distribución de tópicos - documentos (`thetas`). El modelo no necesita pares de oraciones alineado; funciona a nivel de corpus.

### Detección

Para cada tópico seleccionado:

1. Un LLM genera preguntas cuyas respuestas deberían ser consistentes en todos los otros pasajes
2. Se lleva a cabo un retrieval híbrido con FAISS y los pesos de los tópicos para obtener los pasajes más relevantes
3. Un modelo de inferencia categoriza; el LLM verifica y explica

El output es una tabla con los pares de pasajes categorizados, un veredicto y la pregunta asociada a ellos.


## Backends y LLM 

Cambia de modelos con facilidad. Selección disponible en `config/config.yaml`, modelos disponibles:


| Backend | Notes |
|---------|-------|
| **Gemini** | `gemini-2.5-flash`, `gemini-2.0-flash` — fastest in our tests |
| **OpenAI** | `gpt-4o`, `gpt-4`, `gpt-3.5-turbo` |
| **Ollama** | Local — `qwen2.5:32b`, `llama3.3:70b` the self-hosted choice |
| **vLLM** | Any HuggingFace model via OpenAI-compatible API |
| **llama.cpp** | GGUF models, local server |


Si dudas sobre gobernanza y seguridad, Ollama es la mejor elección para no enviar datos por APIs 3P.

## Configuración

`config/config.yaml` controla todo. Edita el fichero y haz restart al pod de backend, sin rebuilds.

| Section | Controls |
|---------|---------|
| `logger` | Directorio de logs, verbosidad, rotation |
| `optimization` | `balanced`, `memory_optimized`, `speed_optimized` |
| `mind` | Top-k retrieval, batch size, embedding/NLI models, paths de prompts |
| `llm` | Active backend, modelo, temperature, listas per-backend |
