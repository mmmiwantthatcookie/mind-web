---
title: "Primeros Pasos con MIND"
description: "Aprende cómo configurar y ejecutar el pipeline MIND para la detección de inconsistencias multilingüe."
date: 2025-12-01
lang: es
order: 1
tags: ["instalación", "configuración", "inicio-rápido"]
---

# Primeros Pasos con MIND

> **Este es un documento de ejemplo.** El contenido será escrito por los mantenedores del proyecto antes del lanzamiento.

## ¿Qué es MIND?

MIND (Multilingual Inconsistency Detection) es un pipeline impulsado por IA que detecta automáticamente discrepancias en bases de conocimiento empresariales a través de múltiples idiomas.

## Requisitos previos

- Docker y Docker Compose
- Python 3.10+
- Claves API para los proveedores de LLM compatibles

## Instalación

```bash
git clone https://github.com/lcalvobartolome/mind.git
cd mind
docker compose up -d
```

## Próximos pasos

- Lee la [Descripción de la Arquitectura](/es/docs/architecture) para entender el pipeline
- Sigue la [Guía de Inicio Rápido](/es/guides/quick-start) para un recorrido práctico
- Consulta el [Registro de Cambios](/es/changelog) para las últimas actualizaciones
