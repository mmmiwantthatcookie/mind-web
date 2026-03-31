---
title: "MIND 0.1.0-alpha — Lanzamiento Público Inicial"
date: 2025-12-01
lang: es
type: research
version: "0.1.0-alpha"
---

## 0.1.0-alpha — Release inicial

Publicado en conjunto con el paper en EMNLP 2025 (páginas 22024-22065). Esta es la primera versión apta para uso externo. El código ha sido limpiado, el stack de Docker optimizado y hecho reproducible, y la app web mejorada para poder ser utilizada intuitivamente.

### ¿Qué hay en esta release?

Nuestra web soporta la ejecución del flujo completo: Carga un dataset, lo preprocesa, entrena el modelo de tópicos, ejecuta la detección y visualiza los resultados. Sin código, simplemente configura la licencia del LLM y comienza a detectar.

La CLI está también disponible para hacer trabajos en batches, experimentos con nuestros scripts y otros casos de uso (Cronjobs, pipelines customizadas, etc).

**LLMs compatibles con MIND:** Gemini (2.0-flash, 2.5-flash, etc), OpenAI (GPT-4o, GPT-4, GPT-3.5-turbo), Ollama, vLLM, y llama.cpp. Elige en el archivo `config.yaml` que proveedor deseas utilizar, somos firmes creyentes de que cada usuario pueda traer su propia licencia. Más proveedores de IA serán incluidos en versiones futuras

**Formatos de ingesta:** CSV, Parquet, Markdown, YAML, XML, texto plano, ZIP, TAR, 7z.

**ROSIE-MIND v2:** 651 muestras de la Wikipedia en inglés y español (relacionadas con la temática de la salud), disponibles en [HuggingFace](https://huggingface.co/collections/lcalvobartolome/mind-data-68e2a690025b4dc28c5e8458). Construido usando los embeddings: `BAAI/bge-m3` y `llama3.3:70b` como el Juez LLM.

### Limitaciones conocidas

Las conexiones con Neo4j y MongoDB no están aún implementadas, por el momento hay hooks pero no están conectados correctamente. Estamos mejorando la CLI para mejorar la experiencia de uso y sus capacidades en general. 

### Citar

```bibtex
@inproceedings{calvo2025discrepancy,
  title={Discrepancy Detection at the Data Level: Toward Consistent Multilingual Question Answering},
  author={Calvo-Bartolom{\'e}, Lorena and Aldana, Val{\'e}rie and Cantarero, Karla
          and de Mesa, Alonso Madro{\~n}al and Arenas-Garc{\'\i}a, Jer{\'o}nimo
          and Boyd-Graber, Jordan Lee},
  booktitle={Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing},
  pages={22024--22065},
  year={2025}
}