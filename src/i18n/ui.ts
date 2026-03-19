// UI string translations for the marketing website
// Keys match component usage, values are the locale strings

export const ui = {
  en: {
    // Navbar
    'nav.docs': 'Docs',
    'nav.guides': 'Guides',
    'nav.changelog': 'Changelog',
    'nav.requestDemo': 'Request Demo',

    // Hero
    'hero.headline.pre': 'Detect',
    'hero.headline.gradient': 'Inconsistencies',
    'hero.headline.post': 'in Your Knowledge Base',
    'hero.subtitle': 'Enterprise knowledge bases accumulate contradictions as they grow. MIND automates discrepancy detection across languages and document types using state-of-the-art AI.',
    'hero.cta.demo': 'Request Demo',
    'hero.cta.github': 'View on GitHub',
    'hero.cta.docs': 'Read the Docs',

    // Value Proposition
    'valueProp.heading.pre': 'Why',
    'valueProp.heading.gradient': 'MIND',
    'valueProp.subtitle': 'Knowledge management at scale demands automated consistency verification.',
    'valueProp.problem.title': 'The Problem',
    'valueProp.solution.title': "MIND's Solution",

    // Features
    'features.heading.pre': 'Built for',
    'features.heading.gradient': 'Enterprise Scale',
    'features.subtitle': 'Every component designed for reliability, performance, and extensibility.',

    // Architecture
    'architecture.heading.pre': 'How',
    'architecture.heading.gradient': 'MIND',
    'architecture.heading.post': 'Works',
    'architecture.subtitle': 'A modular pipeline that ingests, analyzes, and surfaces knowledge base inconsistencies.',

    // Research
    'research.heading.pre': 'Backed by',
    'research.heading.gradient': 'Research',

    // CTA
    'cta.heading.pre': 'Ready to verify your',
    'cta.heading.gradient': 'knowledge base',
    'cta.subtitle': 'Detect inconsistencies automatically. Resolve them confidently. Ship reliable knowledge.',
    'cta.demo': 'Request a Demo',
    'cta.github': 'View on GitHub',

    // Footer
    'footer.navigation': 'Navigation',
    'footer.documentation': 'Documentation',
    'footer.guides': 'Guides',
    'footer.changelog': 'Changelog',
    'footer.project': 'Project',
    'footer.contact': 'Contact',
    'footer.about': 'About',
    'footer.description': 'MIND is an award-winning AI pipeline for multilingual inconsistency detection, presented at EMNLP 2025.',

    // Changelog
    'changelog.title': 'Changelog',
    'changelog.subtitle': 'Track the evolution of MIND — new features, fixes, datasets, and research milestones.',

    // Errors
    '404.title': 'Page not found',
    '404.message': "We couldn't find the page you're looking for. It may have been moved or doesn't exist yet.",
    '500.title': 'Something went wrong',
    '500.message': "We're experiencing an issue on our end. Please try again in a few moments.",
    'error.home': 'Back to Home',
    'error.docs': 'Documentation',
    'error.guides': 'Guides',
  },
  es: {
    // Navbar
    'nav.docs': 'Documentación',
    'nav.guides': 'Guías',
    'nav.changelog': 'Registro de cambios',
    'nav.requestDemo': 'Solicitar demo',

    // Hero
    'hero.headline.pre': 'Detecta',
    'hero.headline.gradient': 'Inconsistencias',
    'hero.headline.post': 'en tu Base de Conocimiento',
    'hero.subtitle': 'Las bases de conocimiento empresariales acumulan contradicciones a medida que crecen. MIND automatiza la detección de discrepancias entre idiomas y tipos de documentos utilizando IA de última generación.',
    'hero.cta.demo': 'Solicitar demo',
    'hero.cta.github': 'Ver en GitHub',
    'hero.cta.docs': 'Leer la documentación',

    // Value Proposition
    'valueProp.heading.pre': '¿Por qué',
    'valueProp.heading.gradient': 'MIND',
    'valueProp.subtitle': 'La gestión del conocimiento a escala exige verificación automática de consistencia.',
    'valueProp.problem.title': 'El Problema',
    'valueProp.solution.title': 'La Solución de MIND',

    // Features
    'features.heading.pre': 'Diseñado para',
    'features.heading.gradient': 'Escala Empresarial',
    'features.subtitle': 'Cada componente diseñado para fiabilidad, rendimiento y extensibilidad.',

    // Architecture
    'architecture.heading.pre': 'Cómo funciona',
    'architecture.heading.gradient': 'MIND',
    'architecture.heading.post': '',
    'architecture.subtitle': 'Un pipeline modular que ingesta, analiza y presenta inconsistencias en bases de conocimiento.',

    // Research
    'research.heading.pre': 'Respaldado por',
    'research.heading.gradient': 'Investigación',

    // CTA
    'cta.heading.pre': '¿Listo para verificar tu',
    'cta.heading.gradient': 'base de conocimiento',
    'cta.subtitle': 'Detecta inconsistencias automáticamente. Resuélvelas con confianza. Publica conocimiento fiable.',
    'cta.demo': 'Solicitar una demo',
    'cta.github': 'Ver en GitHub',

    // Footer
    'footer.navigation': 'Navegación',
    'footer.documentation': 'Documentación',
    'footer.guides': 'Guías',
    'footer.changelog': 'Registro de cambios',
    'footer.project': 'Proyecto',
    'footer.contact': 'Contacto',
    'footer.about': 'Acerca de',
    'footer.description': 'MIND es un pipeline de IA galardonado para la detección de inconsistencias multilingüe, presentado en EMNLP 2025.',

    // Changelog
    'changelog.title': 'Registro de cambios',
    'changelog.subtitle': 'Sigue la evolución de MIND — nuevas funcionalidades, correcciones, datasets e hitos de investigación.',

    // Errors
    '404.title': 'Página no encontrada',
    '404.message': 'No pudimos encontrar la página que buscas. Puede haberse movido o no existir aún.',
    '500.title': 'Algo salió mal',
    '500.message': 'Estamos experimentando un problema. Por favor, inténtalo de nuevo en unos momentos.',
    'error.home': 'Volver al inicio',
    'error.docs': 'Documentación',
    'error.guides': 'Guías',
  },
} as const;

export type Locale = keyof typeof ui;
export type UIKey = keyof (typeof ui)['en'];
