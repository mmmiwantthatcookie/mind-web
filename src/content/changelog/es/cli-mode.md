---
title: "MIND v0.2.0-alpha — Mejoras Experiencia CLI"
date: 2026-03-31
lang: es
type: research
version: "0.2.0-alpha"
---

## 0.2.0-alpha — Modo CLI mejorado

Nueva interfaz de línea de comandos para MIND. Ejecuta la pipeline de detección al completo sin usar docker o la app web. Instala el repositorio, realiza los pasos de configuracióny detecta discrepancias directamente desde la terminal.

### Novedades del parche

#### Comandos principales, organizados por fases

**Preprocesado de datos**
- `mind data segment` — Segmenta los documentos en pasajes
- `mind data translate` — Traduce los pasajes en pares fuente - ancla.
- `mind data prepare` — Prepara los datos procesados para el modelado de tópicos.

**Modelado de tópicos**
- `mind tm train` — Entrena un LDA monolingüe o modelos de tópicos polilingües.
- `mind tm label` — Genera etiquetas fáciles de entender con un LLM

**Detección de discrepancias**
- `mind detect run` — Ejecuta la pipeline de detección de inconsistencias 
- `mind detect peek` — Visualiza los resultados de la pipeline y las métricas (Contradiction, Not Enough Info, No Discrepancy)

#### Prestaciones

- **Configuración centralizada** — Todos los pasos se configuran con un solo `run_config.yaml` que puede hacer override a la config del sistema
- **Output de CLI mejorado** — Barras de progreso, etiquetas más visuales, paneles estructurados y mensajes de error mejorados
- **Visualización con pocos recursos** — Echa un vistazo a los resultados sin herramientas externas, los resúmenes, estadísticas y muestras al alcance de tu CLI.
- **Procesado modular** — Ejecuta el preprocessing, el modelado y la deteción de manera separada o en conjunto.

#### Mejoras sobre versiones previas

- Comandos de Python ad-hoc reemplazados por una interfaz de línea de comando estructurada.
- Más resilente a errores, logs mejorados
- Configuración del schema consistente