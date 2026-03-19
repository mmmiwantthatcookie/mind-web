---
title: "Descripción de la Arquitectura"
description: "Comprende la arquitectura modular del pipeline MIND, incluyendo la ingestión de datos, modelado de temas y detección de discrepancias."
date: 2025-12-01
lang: es
order: 2
tags: ["arquitectura", "pipeline", "módulos"]
---

# Descripción de la Arquitectura

> **Este es un documento de ejemplo.** El contenido será escrito por los mantenedores del proyecto antes del lanzamiento.

## Etapas del Pipeline

El pipeline MIND consta de cuatro etapas principales:

1. **Ingestión de Datos** — Conectores modulares para PDFs, wikis, bases de datos y APIs
2. **Modelado de Temas** — Clustering de temas polilingual usando embeddings multilingüe
3. **Detección de Discrepancias** — Validación cruzada multi-LLM para identificar contradicciones
4. **Panel Interactivo** — Interfaz web para revisar y resolver hallazgos

## Extensibilidad

Cada módulo puede extenderse de forma independiente — añade nuevos conectores de datos, proveedores de LLM o algoritmos de análisis sin modificar el pipeline principal.
