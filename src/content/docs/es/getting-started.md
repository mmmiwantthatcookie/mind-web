---
title: "Primeros Pasos con MIND"
description: "Aprende cómo configurar y ejecutar el pipeline MIND para la detección de inconsistencias multilingüe."
date: 2025-12-01
lang: es
order: 1
tags: ["instalación", "configuración", "inicio-rápido"]
---


# Guía de inicio rápido

MIND es ejecutable como web o desde la línea de comandos. El camino más simple es a través de Docker, nuestro stack se compone de cuatro pods: Frontend, Backend, Auth y DB. `docker-compose.yml` orquesta su interacción.

## Pre-requisitos

- Docker y Compose (v2+) ()
- Un LLM. Gemini y OpenAI necesitan API Keys, genera las tuyas y despliega
- Existe la opción self-hosted: [Ollama](https://ollama.com) elige modelo, despliega en local, conecta el puerto, sin keys.
- ~8 GB en disco para las imágenes.
- Recomendamos unos 6-8 GB de RAM

## Instalación con Docker

Comienza clonando el submódulo, nuestro directorio `externals/` requiere de dependencias con un tracking por separado:


```bash
git clone --recurse-submodules https://github.com/ShockCitrus/mind-industry.git
cd mind
```
Cada servicio espera su propio fichero `.env`. Encontrarás ejemplos en cada subdirectorio:

```bash
cp app/auth/.env.example     app/auth/.env
cp app/backend/.env.example  app/backend/.env
cp app/frontend/.env.example app/frontend/.env
```

Rellena (`GEMINI_API_KEY` or `OPENAI_API_KEY`) con tu key de LLM. En caso de usar Ollama, la URL por defecto `http://localhost:11434` está ya configurada. Luego:

```bash
docker compose build
docker compose up -d
```

Frontend en `http://localhost:5050`. Backend API en `:5001`.

## Instalación del CLI

Para trabajar con la propia pipeline, usa directamente [uv](https://docs.astral.sh/uv/):

```bash
git clone --recurse-submodules https://github.com/ShockCitrus/mind-industry.git
cd mind

uv venv .venv && source .venv/bin/activate
uv pip install -e .

python -c "import mind; print('ok')"
```

El paquete es editable, los cambios en `src/mind/` no necesitan reinsatalar.

## Primera ejecución

Tras ejecutar `docker compose up -d`:

1. Crea una cuenta en `http://localhost:5050`
2. Navega a la página **Profile** y carga un CSV o un Parquet para analizarlo
3. **Preprocess** segmenta los documentos y, si la base de datos es bilingüe, los traduce
4. Entrena un **modelo de tópicos** aglomera pasajes por temática independientemente de su idioma
5. **Detecta:** encuentra contradicciones en el tópico que quieras; elige uno y ejecuta
6. Evalúa los resultados en la tabla de discrepancias

## ¿Qué leer ahora?

- [Arquitectura](/docs/architecture) Los componentes internos de la pipeline y sus elemementos configurables.
- [Quick-start guide](/guides/quick-start) Ejemplo con CLI, comandos reales y un dataset de prueba.
