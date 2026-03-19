---
title: "Getting Started"
description: "Install MIND and run your first inconsistency analysis in under 15 minutes."
date: 2025-12-01
lang: en
order: 1
tags: ["installation", "docker", "quickstart"]
---

# Getting Started

MIND runs as a web application or from the command line. Easiest path: Docker. The stack is four containers — frontend, backend, auth, and a Postgres instance. All wired together in `docker-compose.yml`.

## What you need

- Docker and Compose (v2+)
- An LLM. Gemini and OpenAI need API keys. [Ollama](https://ollama.com) is the self-hosted option — pull a model, point MIND at the local server, no key needed.
- ~4 GB disk for the base images.

## Docker install

Start with a submodule clone — the `externals/` directory pulls in a dependency that's tracked separately:

```bash
git clone --recurse-submodules https://github.com/lcalvobartolome/mind.git
cd mind
```

Each service expects its own `.env` file. There are examples in each app subdirectory:

```bash
cp app/auth/.env.example     app/auth/.env
cp app/backend/.env.example  app/backend/.env
cp app/frontend/.env.example app/frontend/.env
```

Fill in your LLM key (`GEMINI_API_KEY` or `OPENAI_API_KEY`). If you're using Ollama, the default URL `http://localhost:11434` already works. Then:

```bash
docker compose build
docker compose up -d
```

Frontend at `http://localhost:5050`. Backend API at `:5001`.

## Development install

For working on the pipeline itself, skip Docker and use [uv](https://docs.astral.sh/uv/):

```bash
git clone --recurse-submodules https://github.com/lcalvobartolome/mind.git
cd mind

uv venv .venv && source .venv/bin/activate
uv pip install -e .

python -c "import mind; print('ok')"
```

The package is editable, so changes to `src/mind/` take effect without reinstalling.

## Your first run

After `docker compose up -d`:

1. Create an account at `http://localhost:5050`
2. Upload a CSV or Parquet file from your **Profile** page
3. **Preprocess** — segments documents into passages; optionally translates them
4. Train a **topic model** — groups passages by theme across languages
5. **Run detection** on the topics you want; pick a topic, let it go
6. Review flagged pairs in the results table

The backend handles batching. On a mid-range GPU it takes a few minutes per topic; on CPU expect longer.

## Where to go next

- [Architecture](/docs/architecture) — the pipeline internals before you start tweaking config
- [Quick-start guide](/guides/quick-start) — CLI walkthrough with real commands and a sample dataset
