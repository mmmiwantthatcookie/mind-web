---
title: "Guía de Inicio Rápido"
description: "Pon MIND en marcha en menos de 10 minutos con esta guía paso a paso."
date: 2025-12-01
lang: es
order: 1
---

# Guía de Inicio Rápido

> **Este es un documento de ejemplo.** El contenido será escrito por los mantenedores del proyecto antes del lanzamiento.

## Resumen

Esta guía te acompaña en la configuración de MIND y la ejecución de tu primer análisis de inconsistencias en un dataset de ejemplo.

## Paso 1: Clonar el repositorio

```bash
git clone https://github.com/lcalvobartolome/mind.git
cd mind
```

## Paso 2: Configurar el entorno

```bash
cp .env.example .env
# Edita .env con tus claves API de LLM
```

## Paso 3: Iniciar los servicios

```bash
docker compose up -d
```

## Paso 4: Acceder al panel

Abre tu navegador y navega a `http://localhost:5000`.

## ¿Qué sigue?

- Explora la [Documentación](/es/docs/getting-started) para configuración en profundidad
- Consulta la [Descripción de la Arquitectura](/es/docs/architecture) para entender cómo funciona MIND
