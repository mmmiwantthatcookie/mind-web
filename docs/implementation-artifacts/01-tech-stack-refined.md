# MIND Informational Web — Technical Structure Specification

**Type:** Frontend Structure & Agent Implementation Guide  
**Audience:** AI Agents, Developers  
**Status:** Final — Ready for Implementation  
**Version:** 2.0.0  
**Author:** AMM  
**Created:** 2026-03-14  
**Companion Doc:** [02-ux-guide.md](./02-ux-guide.md) — All visual, branding, and interaction decisions are defined there.

---

## Purpose

This document is the **single source of truth** for the structural and technical specification of the MIND marketing website. It defines: what pages exist, what components compose them, what technologies to use, how to set up and deploy, and what constraints apply. The companion UX Guide (`02-ux-guide.md`) defines **how things look and feel** — this document defines **what things are and how they are built**.

> [!IMPORTANT]
> **For AI Agents:** Follow every instruction literally. When a section says "MUST", it is a hard requirement. When it says "SHOULD", prefer compliance unless there is a documented technical reason not to. When it says "COULD", treat as optional unless the user explicitly requests it. Cross-reference the UX Guide for all visual decisions.

---

## Scope

### In Scope

| Area | Description |
|------|-------------|
| **Component Definition** | What components exist, their purpose, props/content slots, and where they render in the page hierarchy. |
| **Architecture & Routing** | File-based routing schema, folder structure, and layout wrappers. |
| **Technology Stack** | Exact frameworks, versions, integrations, and their configuration. |
| **Agent-Ready Specifications** | Step-by-step setup, build, and deploy commands. All technical decisions made — no ambiguity left for the implementer. |
| **Functional Requirements** | User flows, acceptance criteria, and interaction capabilities. |
| **i18n Architecture** | Internationalization scaffolding (English primary, Spanish secondary). |

### Out of Scope

| Area | Description |
|------|-------------|
| **Copywriting** | The human operator writes all prose content. The agent builds the scaffolding and placeholder structure only. |
| **Core Product Modification** | The MIND tool/pipeline is a separate, complete project. This spec is strictly for the informative marketing website. |
| **Visual Design Decisions** | Colors, typography, spacing, animation styles — all defined in `02-ux-guide.md`. |

### Hard Constraints

| Constraint | Detail |
|------------|--------|
| **Budget** | Free hosting tier only (Vercel free tier). No paid services, no paid APIs. |
| **Simplicity** | The human operator has limited JS expertise. The tech stack MUST be simple enough that an AI agent can implement it entirely, and the human can maintain content (Markdown files) without touching JS/TS logic. |
| **No AI-Generated Imagery** | All images are either product screenshots, hand-crafted diagrams, or CSS/SVG animations. Never use AI-generated stock photos or illustrations. |
| **Visual Coherence** | The marketing site MUST feel like it belongs to the same brand as the MIND application (which uses the "Deep Cipher" design system on Halfmoon/Bootstrap 5). The UX Guide defines the exact bridge between the two. |

### Assumptions

- The core MIND project is complete and won't require modifications.
- Content (MD/MDX files) will be written and managed by the human operator, not the agent.
- The website is static-first — SSG (Static Site Generation) is the default. SSR is used only when required.

---

## Technology Stack

### Framework: Astro

| Property | Value |
|----------|-------|
| **Framework** | [Astro](https://astro.build) |
| **Why** | File-based routing, zero-JS by default, first-class Markdown/MDX support, Tailwind integration, excellent build performance. Perfect for a content-heavy marketing site. |
| **Rendering** | SSG (Static Site Generation) by default. No SSR unless explicitly required. |

### Styling: Tailwind CSS v4

| Property | Value |
|----------|-------|
| **CSS Framework** | [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta) |
| **Why** | Utility-first, compiles to minimal CSS, excellent Astro integration. Bridges well with the existing Halfmoon design tokens in the app via shared CSS custom properties. |
| **Configuration** | Define the full design system (colors, typography, spacing, breakpoints) in `tailwind.config.mjs`. Exact tokens are specified in the UX Guide. |

> [!NOTE]
> The core MIND application uses **Halfmoon v2 / Bootstrap 5**. The marketing website uses **Tailwind CSS v4**. These are different CSS frameworks intentionally. The visual coherence is achieved by sharing the same **design tokens** (color values, font family, spacing scale) documented in the UX Guide, not by using the same CSS framework.

### Content: Markdown / MDX

| Property | Value |
|----------|-------|
| **Content Format** | Markdown (`.md`) and MDX (`.mdx`) for pages needing embedded components. |
| **Content Collections** | Use Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) for Docs, Guides, and Changelog entries. |
| **Frontmatter** | Every content file MUST include: `title`, `description`, `date`, `lang` (for i18n), and optionally `tags`, `order`. |

### Icons: Phosphor Icons

| Property | Value |
|----------|-------|
| **Icon Library** | [Phosphor Icons](https://phosphoricons.com/) |
| **Why** | Already used in the MIND application (`@phosphor-icons/web`). Use the same icon set to maintain visual coherence. |
| **Integration** | Use the Astro-compatible package or inline SVG. Prefer SVG for zero-JS. |

### Hosting: Vercel

| Property | Value |
|----------|-------|
| **Provider** | [Vercel](https://vercel.com) — Free tier |
| **Adapter** | `@astrojs/vercel` |
| **Build** | Astro's SSG output pushed to Vercel. No serverless functions unless absolutely needed. |
| **Constraint** | All pages MUST build as static HTML. If a serverless function is ever added, it MUST complete within 10 seconds (Vercel free tier limit). |

### i18n: Astro Native i18n

| Property | Value |
|----------|-------|
| **Strategy** | Use Astro's built-in [i18n routing](https://docs.astro.build/en/guides/internationalization/). |
| **Default locale** | `en` (English) — served at `/` |
| **Secondary locale** | `es` (Spanish) — served at `/es/` |
| **Implementation** | Build English first. The i18n routing structure MUST be in place from day one so Spanish content can be dropped in later without refactoring. |
| **UI** | Language toggle in the navigation bar (flag or `EN / ES` text). |

---

## Project Architecture

### File Structure

```text
mind-web/
├── astro.config.mjs          # Astro config (integrations, i18n, adapter)
├── tailwind.config.mjs        # Tailwind design tokens (from UX Guide)
├── package.json
├── tsconfig.json
├── public/                    # Static assets (images, videos, og-images)
│   ├── images/
│   │   ├── screenshots/       # Product screenshots (provided by operator)
│   │   └── diagrams/          # Architecture diagrams (SVG preferred)
│   ├── videos/                # Demo videos or loops (if provided)
│   └── favicon.svg            # "M" logotype favicon (inherited from app)
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── global/            # Used on every page
│   │   │   ├── Navbar.astro
│   │   │   ├── Footer.astro
│   │   │   ├── LanguageToggle.astro
│   │   │   └── ThemeToggle.astro
│   │   ├── landing/           # Landing page specific
│   │   │   ├── Hero.astro
│   │   │   ├── ValueProposition.astro
│   │   │   ├── FeaturesGrid.astro
│   │   │   ├── ArchitectureDiagram.astro
│   │   │   ├── ResearchBadge.astro
│   │   │   └── CTASection.astro
│   │   └── content/           # Secondary page specific
│   │       ├── Sidebar.astro
│   │       ├── ProseFormatter.astro
│   │       ├── CodeBlock.astro
│   │       ├── ChangelogTimeline.astro
│   │       └── TableOfContents.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell, <head>, global styles
│   │   ├── LandingLayout.astro
│   │   └── ContentLayout.astro # Sidebar + prose area for docs/guides
│   ├── pages/
│   │   ├── index.astro        # Landing Page (EN)
│   │   ├── docs/
│   │   │   └── [...slug].astro # Dynamic route for docs collection
│   │   ├── guides/
│   │   │   └── [...slug].astro
│   │   ├── changelog.astro
│   │   ├── 404.astro          # Custom 404
│   │   ├── 500.astro          # Custom 500
│   │   └── es/                # Spanish mirror (i18n)
│   │       ├── index.astro
│   │       ├── docs/
│   │       ├── guides/
│   │       └── changelog.astro
│   ├── content/               # Astro Content Collections
│   │   ├── config.ts          # Collection schemas (zod validation)
│   │   ├── docs/
│   │   │   └── en/            # English docs (operator fills)
│   │   │       └── _placeholder.md
│   │   ├── guides/
│   │   │   └── en/
│   │   │       └── _placeholder.md
│   │   └── changelog/
│   │       └── en/
│   │           └── _placeholder.md
│   ├── styles/
│   │   └── global.css         # Tailwind directives + global overrides
│   ├── i18n/
│   │   ├── ui.ts              # UI string translations (nav labels, buttons)
│   │   └── utils.ts           # Locale detection helpers
│   └── utils/
│       └── reading-time.ts    # Optional: reading time calculation
└── docs/
    └── implementation-artifacts/
        ├── 01-tech-stack-refined.md  # THIS FILE
        └── 02-ux-guide.md           # Companion UX Guide
```

### Component Hierarchy

#### Landing Page

```text
BaseLayout
└── LandingLayout
    ├── Navbar (global, sticky)
    │   ├── Logotype ("MIND" stylized text)
    │   ├── Nav Links [Docs, Guides, Changelog]
    │   ├── LanguageToggle (EN/ES)
    │   ├── ThemeToggle (sun/moon)
    │   └── CTA Button ("Request Demo" — primary)
    ├── Hero
    │   ├── Headline (gradient text)
    │   ├── Subtitle (problem statement)
    │   ├── Primary CTA ("Contact / Request Demo")
    │   ├── Secondary CTAs ("View on GitHub", "Read the Docs")
    │   └── Visual Asset (video loop / dashboard mockup / animated diagram)
    ├── ValueProposition
    │   ├── Problem Column ("Enterprise knowledge bases accumulate contradictions...")
    │   └── Solution Column ("MIND automates discrepancy detection...")
    ├── FeaturesGrid
    │   ├── FeatureCard: Multi-LLM Backend
    │   ├── FeatureCard: Polylingual Topic Modeling
    │   ├── FeatureCard: Hybrid Retrieval
    │   ├── FeatureCard: Modular Data Ingestion
    │   ├── FeatureCard: Interactive Web Application
    │   └── FeatureCard: Extensible Architecture
    ├── ArchitectureDiagram
    │   └── Animated SVG/CSS diagram (pipeline flow)
    ├── ResearchBadge
    │   ├── EMNLP 2025 citation
    │   ├── HuggingFace datasets link
    │   └── BibTeX expandable section
    ├── CTASection (bottom page CTA repeat)
    └── Footer (global)
        ├── Nav Links
        ├── GitHub link
        ├── Contact emails
        └── Copyright
```

#### Secondary Pages (Docs / Guides / Changelog)

```text
BaseLayout
└── ContentLayout
    ├── Navbar (global, sticky — same as landing)
    ├── Sidebar
    │   ├── Section headers (collapsible groups)
    │   └── Page links (from Content Collection)
    ├── ContentArea
    │   ├── TableOfContents (right-side sticky, auto-generated from headings)
    │   ├── ProseFormatter (Tailwind typography plugin wrapper)
    │   │   └── MDX-rendered content
    │   └── CodeBlock (syntax highlighted, with copy button)
    └── Footer (global)
```

---

## Functional Requirements

### Primary User Flows

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| REQ-F-001 | User scrolls through Landing Page to discover Problem vs Solution and Features | Must | Distinct sections for Hero, Value Proposition, Features Grid are visible and scrollable |
| REQ-F-002 | User clicks "Request Demo / Contact" primary CTA | Must | Opens email client (mailto) or navigates to a contact form/section |
| REQ-F-003 | User clicks "View on GitHub" CTA | Must | Opens `https://github.com/ShockCitrus/mind-industry` in a new tab |
| REQ-F-004 | User navigates to Secondary Pages via navigation menu | Must | Clickable links to `/docs/`, `/guides/`, `/changelog` are accessible from any page via sticky navbar |

### Secondary User Flows

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| REQ-F-005 | User or LLM directly accesses documentation URLs | Must | Direct URL to any doc page returns rendered content. Semantic HTML for LLM consumption. |
| REQ-F-006 | User views Changelog with chronological updates | Should | A timeline or list view with entries tagged by type (Feature, Fix, Dataset) |
| REQ-F-007 | User navigates between internal pages via hyperlinks | Must | Internal links route seamlessly without full page reload (Astro prefetch) |
| REQ-F-008 | User clicks external links (GitHub, HuggingFace, YouTube) | Must | Opens in new tab (`target="_blank"` with `rel="noopener noreferrer"`) |

### Interactive Capabilities

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| REQ-F-009 | User copies code from documentation code blocks | Should | "Copy" button on code blocks. Click → clipboard copy → visual "Copied!" feedback (2s) |
| REQ-F-010 | User toggles Dark / Light mode | Must | Theme toggle control (sun/moon icon). Instant switch. Preference persisted in `localStorage`. |
| REQ-F-011 | User toggles language (EN / ES) | Must | Language toggle in navbar. Navigates to the locale-prefixed equivalent page. |
| REQ-F-012 | User views the EMNLP 2025 research citation | Must | ResearchBadge component on landing page. Expandable BibTeX section. |

---

## Non-Functional Requirements

| ID | Category | Requirement | Target | Priority |
|----|----------|-------------|--------|----------|
| REQ-NF-001 | Performance | Landing page MUST load fast | Lighthouse Performance ≥ 90 | Must |
| REQ-NF-002 | Accessibility | Pages SHOULD be usable by screen readers. Semantic HTML, alt text, ARIA labels. | Lighthouse Accessibility ≥ 80 | Should |
| REQ-NF-003 | Reliability | Static site high availability | 99.9% uptime (offloaded to Vercel) | Must |
| REQ-NF-004 | Maintainability | Content updates MUST be possible for non-developers. Add a `.md` file → rebuild → deployed. | Operator can add a doc page by creating one MD file | Must |
| REQ-NF-005 | i18n | English primary, Spanish secondary. Language switching via UI toggle. | English from day one, Spanish structure scaffolded | Must |
| REQ-NF-006 | SEO | Proper meta tags, OG images, semantic HTML, sitemap | Lighthouse SEO ≥ 90 | Should |
| REQ-NF-007 | Desktop-First | Optimize for desktop viewports first. Mobile support SHOULD be functional but not the primary target. | Desktop breakpoints prioritized in responsive design | Must |

### Verification Methods

| ID | How to Verify |
|----|---------------|
| REQ-NF-001 | Run `npx lighthouse <url> --output=html`. Performance score ≥ 90. |
| REQ-NF-002 | Run `npx lighthouse <url> --output=html`. Accessibility score ≥ 80. Navigate with keyboard only. |
| REQ-NF-003 | Relies on Vercel SLA for static hosting. |
| REQ-NF-004 | Operator creates a new `.md` file in `src/content/docs/en/`, runs `npm run build` — new page appears. |
| REQ-NF-005 | Verify language toggle navigates to `/es/` equivalent. Verify `es/` content placeholder renders. |
| REQ-NF-006 | Run Lighthouse SEO audit. Verify `<meta>` tags, OG image, and sitemap.xml exist. |
| REQ-NF-007 | Visual inspection at 1440px, 1024px, 768px, 375px viewports. |

---

## Edge Cases & Error Handling

| ID | Scenario | Expected Behaviour | Notes |
|----|----------|--------------------|-------|
| EC-001 | User navigates to non-existent route | Custom branded 404 page with links to Landing, Docs, Guides | Must be visually consistent with the main site |
| EC-002 | Server error during page render | Custom branded 500 page | Should be graceful and minimal |
| EC-003 | Missing content collection entry | Graceful fallback — show "Content coming soon" placeholder | Prevents build errors during scaffolding phase |
| EC-004 | External resource unavailable (e.g., Phosphor CDN) | Page renders without icons. No broken layout. | Icons should be self-hosted after initial dev phase |
| EC-005 | Vercel free tier limits hit | All content is SSG. No serverless functions unless within 10s limit. Prefer build-time data fetching. | Hard constraint |
| EC-006 | Rapid user interactions (clicking theme toggle, etc.) | Debounce UI interactions. No visual flicker or state corruption. | Standard UX guardrail |

---

## Agent Setup Instructions

### Step 1: Initialize the Project

```bash
# From the mind-web/ repository root
npm create astro@latest ./ -- --template minimal --no-install --no-git --typescript strict
```

### Step 2: Install Dependencies

```bash
npm install
npm install @astrojs/tailwind tailwindcss @astrojs/mdx @astrojs/sitemap @astrojs/vercel
npm install @phosphor-icons/web
npm install -D @tailwindcss/typography
```

### Step 3: Configure Astro

Create/update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://mind-web.vercel.app', // Update with actual domain
  integrations: [tailwind(), mdx(), sitemap()],
  adapter: vercel(),
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false, // EN at /, ES at /es/
    },
  },
});
```

### Step 4: Configure Tailwind

Create `tailwind.config.mjs` — use the exact design tokens from `02-ux-guide.md` Section 4 (Design Tokens).

### Step 5: Build Components

Follow the component hierarchy defined in this document. For visual styling of each component, reference the corresponding section in the UX Guide.

**Build order:**
1. `BaseLayout.astro` → `global.css` → Tailwind config
2. `Navbar.astro` + `Footer.astro` (global shell)
3. `Hero.astro` → `ValueProposition.astro` → `FeaturesGrid.astro` (landing page, top to bottom)
4. `ArchitectureDiagram.astro` → `ResearchBadge.astro` → `CTASection.astro` (landing page continued)
5. `ContentLayout.astro` → `Sidebar.astro` → `ProseFormatter.astro` → `CodeBlock.astro` (secondary pages)
6. `ChangelogTimeline.astro` (changelog page)
7. `404.astro` → `500.astro` (error pages)
8. i18n wiring (`LanguageToggle.astro`, `i18n/ui.ts`, `/es/` routes)

### Step 6: Content Collections

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lang: z.enum(['en', 'es']),
    order: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lang: z.enum(['en', 'es']),
    order: z.number().optional(),
  }),
});

const changelogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    lang: z.enum(['en', 'es']),
    type: z.enum(['feature', 'fix', 'dataset', 'research']),
    version: z.string().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
  guides: guidesCollection,
  changelog: changelogCollection,
};
```

### Step 7: Deploy

```bash
# Build locally — verify no errors
npm run build

# Preview locally
npm run preview

# Deploy to Vercel
npx vercel --prod
```

---

## Implementation Order (Recommended)

| Phase | What | Requirements Covered | Notes |
|-------|------|----------------------|-------|
| **1** | Project init, Astro + Tailwind setup, Vercel deploy skeleton | EC-005, REQ-NF-003 | Deploy empty shell to Vercel first → validates hosting works |
| **2** | BaseLayout, Navbar, Footer, ThemeToggle | REQ-F-010 | Global shell. Must work before any pages. |
| **3** | Landing Page (Hero → ValueProp → Features → Architecture → Research → CTA) | REQ-F-001, REQ-F-002, REQ-F-003, REQ-F-012 | Build top-to-bottom. Refer to UX Guide for each component's visual spec. |
| **4** | Content Collections + ContentLayout + Sidebar + ProseFormatter | REQ-F-004, REQ-F-005, REQ-F-007, REQ-NF-004 | Secondary page framework. Test with placeholder `.md` files. |
| **5** | CodeBlock (copy button), Changelog timeline | REQ-F-006, REQ-F-009 | Interactive features. |
| **6** | Error pages (404, 500) | EC-001, EC-002 | Branded error pages. |
| **7** | i18n wiring (LanguageToggle, `/es/` routes, `ui.ts`) | REQ-F-011, REQ-NF-005 | Scaffold structure. Spanish content added by operator later. |
| **8** | SEO (meta tags, OG images, sitemap) | REQ-NF-006 | Final polish pass. |
| **9** | Lighthouse audit + fixes | REQ-NF-001, REQ-NF-002, REQ-NF-006, REQ-NF-007 | Performance and accessibility validation. |

---

## Key Integration Points

| Integration | Detail |
|-------------|--------|
| **Vercel** | Free tier. SSG output. No serverless functions. `@astrojs/vercel` adapter. |
| **GitHub** | External links to `https://github.com/ShockCitrus/mind-industry`. Opened in new tabs. |
| **HuggingFace** | External link to datasets collection. Badge/link in ResearchBadge component. |
| **Google Fonts** | Load `Inter` (and any additional fonts specified in UX Guide) via `<link>` preconnect. |
| **Phosphor Icons** | Self-hosted or CDN with local fallback. Same icon set as the MIND application. |

## Deferred Decisions

| Decision | Current Default | When to Revisit |
|----------|-----------------|-----------------|
| Headless CMS | File-based Markdown in `src/content/` | When content volume outgrows manual file management |
| GitHub Stars widget | Static badge only (user has 1 star currently) | When the repo has meaningful traction |
| Institution logos | Not included | When partnership agreements allow logo use |
| Contact form backend | `mailto:` link | When enterprise lead capture becomes a priority |
| Copywriting | Placeholder templates | Operator fills content before launch |

---

## Risks & Watch Points

| Risk | Mitigation |
|------|------------|
| **Vercel timeout (EC-005)** | Enforce SSG everywhere. Never add API routes without checking free tier limits. |
| **Lighthouse regression** | Run Lighthouse after each phase, not just at the end. |
| **i18n refactoring cost** | Scaffold `/es/` routes from day one (Phase 7) even if Spanish content isn't ready. |
| **Design Token drift** | Both UX Guide and `tailwind.config.mjs` MUST reference the same exact color/font values. The UX Guide is the source of truth for tokens. |
| **Content placeholder confusion** | All placeholder files MUST start with `_` prefix and contain a clear "This is a placeholder" note. |
