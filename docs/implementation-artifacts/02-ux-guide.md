# MIND Informational Web — UX & Branding Guide

**Type:** UX Design System & Visual Specification  
**Audience:** AI Agents, Developers, Designers  
**Status:** Final — Ready for Implementation  
**Version:** 2.0.0  
**Author:** AMM  
**Created:** 2026-03-14  
**Companion Doc:** [01-tech-stack-refined.md](./01-tech-stack-refined.md) — Defines the structural and technical implementation.

---

## 1. Purpose & Design Philosophy

This document is the **single source of truth** for all visual, branding, and interaction decisions for the MIND marketing website. The tech stack spec (`01-tech-stack-refined.md`) defines what to build — this document defines **how it looks, feels, and moves**.

### Design Philosophy

> **Elegant. Professional. Quietly powerful.**

MIND is an award-winning AI research pipeline that solves a real enterprise problem. The marketing site MUST convey:

1. **Professional credibility** — This is enterprise-grade software backed by peer-reviewed research (EMNLP 2025). Not a toy. Not a weekend project.
2. **Sleek simplicity** — Clean lines, generous whitespace, deliberate restraint. Every visual element earns its place.
3. **Technical sophistication** — The audience is technical (researchers, enterprise engineers, AI practitioners). The design should feel like a tool they'd trust, not a flashy consumer product.
4. **Brand coherence** — The marketing site and the MIND application MUST feel like they belong to the same family, even though they use different CSS frameworks (Tailwind vs Halfmoon).

### Tone Balance

| | Commercial SaaS (80-90%) | Academic/Research (10-20%) |
|---|---|---|
| **Voice** | "Fix your knowledge base inconsistencies" | "Award-winning contradiction detection presented at EMNLP 2025" |
| **Visuals** | Clean feature grids, bold CTAs, value proposition focus | Research citation badge, BibTeX section, HuggingFace dataset link |
| **Trust signals** | Product screenshots, architecture diagrams | Conference badge, peer-reviewed paper |

> [!IMPORTANT]
> **For AI Agents:** When writing component styles, reference the exact tokens in Section 4 (Design Tokens). Do NOT invent colors, font sizes, or spacing values. If a token doesn't exist for your use case, document the gap — do not improvise.

---

## 2. Brand Identity

### 2.1 Logotype

MIND does **not** have a graphic logo. Instead, use a **stylized logotype**:

| Property | Value |
|----------|-------|
| **Text** | `MIND` |
| **Font** | `Inter`, weight 700 (Bold) |
| **Treatment** | Flat text. No effects. Clean and typographic. |
| **Favicon** | The existing SVG favicon: cyan "M" on dark slate background (`#0f172a` bg, `#06b6d4` text). Located at `public/favicon.svg`. |
| **Usage** | Top-left of navbar. Link to homepage (`/`). No tagline in the navbar — the subtitle appears only in the Hero. |

> [!NOTE]
> The logotype text color follows the current theme: white/off-white on dark mode, dark slate on light mode. The favicon remains the same in both themes.

### 2.2 Imagery Rules

| Allowed | Forbidden |
|---------|-----------|
| ✅ Product screenshots (actual MIND application) | ❌ AI-generated stock photos or illustrations |
| ✅ Hand-crafted SVG diagrams | ❌ Generic stock photography |
| ✅ CSS/SVG animations | ❌ Clip art or low-quality imagery |
| ✅ Annotated product mockups (framed screenshots) | ❌ Placeholder images (e.g., `via.placeholder.com`) |

**Photography style (if ever used):** High-contrast, moody, dark backgrounds. Think server rooms, data centers, abstract close-ups of circuit boards. But prefer illustrations/diagrams over photos.

### 2.3 Iconography

| Property | Value |
|----------|-------|
| **Library** | [Phosphor Icons](https://phosphoricons.com/) — Regular weight |
| **Why** | Already used in the MIND application. Maintains brand coherence. |
| **Style** | Outline/regular weight only. No filled icons. |
| **Size** | 20px for inline, 24px for navigation, 32-48px for feature cards |
| **Color** | Inherit parent text color by default. Accent color (`--color-accent-electric`) for interactive/highlighted states. |

---

## 3. Aesthetic Direction: "Dark Mode SaaS"

The site adopts a **deep, modern, cyber/AI aesthetic** that elevates the Halfmoon dark theme of the core application into a premium marketing experience.

### 3.1 Dark Mode (Default)

| Element | Value | Notes |
|---------|-------|-------|
| **Page background** | `#09090b` | Near-black. Richer than the app's `#0f172a`. |
| **Card / Surface background** | `#18181b` | Slightly lighter than page. Subtle depth. |
| **Elevated surface** | `#27272a` | For hover states, active cards, raised elements. |
| **Border** | `#3f3f46` | Barely visible. Defines boundaries without noise. |
| **Primary text** | `#fafafa` | Off-white. Never pure `#ffffff`. |
| **Secondary text** | `#a1a1aa` | Muted. For descriptions, captions, metadata. |
| **Muted text** | `#71717a` | Very subtle. For timestamps, footnotes. |

### 3.2 Light Mode

| Element | Value | Notes |
|---------|-------|-------|
| **Page background** | `#fafafa` | Off-white. Never pure `#ffffff`. |
| **Card / Surface background** | `#ffffff` | Clean white cards on off-white page. |
| **Elevated surface** | `#f4f4f5` | Hover states on light mode. |
| **Border** | `#e4e4e7` | Soft gray. |
| **Primary text** | `#09090b` | Near-black. Deep readability. |
| **Secondary text** | `#52525b` | Medium gray. |
| **Muted text** | `#a1a1aa` | Light gray. |

### 3.3 Accent Colors

| Token Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `--color-accent-electric` | `#3b82f6` | `59, 130, 246` | **Primary accent.** CTAs, links, active states, gradient starts, focus rings. Electric blue. |
| `--color-accent-electric-hover` | `#2563eb` | `37, 99, 235` | Hover state for primary accent. Slightly deeper. |
| `--color-accent-electric-subtle` | `#3b82f6` at 10% opacity | — | Background tint for badges, tags, selected rows. |
| `--color-accent-amber` | `#f59e0b` | `245, 158, 11` | **Secondary/contrast accent.** Warnings, highlighted callouts, important badges, visual contrast moments. |
| `--color-accent-amber-hover` | `#d97706` | `217, 119, 6` | Hover state for amber accent. |
| `--color-gradient-start` | `#3b82f6` | — | Gradient start (electric blue). |
| `--color-gradient-end` | `#8b5cf6` | — | Gradient end (violet). For gradient text headers and decorative gradients. |

#### Gradient Definitions

```css
/* Primary gradient — for hero headlines, decorative accents */
--gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);

/* Tech gradient — for the architecture section, subtle backgrounds */
--gradient-tech: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);

/* Surface gradient (dark mode only) — subtle depth on hero background */
--gradient-surface: radial-gradient(ellipse at top, #18181b 0%, #09090b 70%);
```

### 3.4 Bridge to the MIND Application ("Deep Cipher" Design System)

The MIND app uses Halfmoon/Bootstrap 5 with these tokens. The marketing site MUST visually rhyme with them:

| App Token | App Value | Marketing Site Equivalent | Marketing Value |
|-----------|-----------|---------------------------|-----------------|
| `--bs-body-bg` (dark) | `#0f172a` | `--color-bg-page` | `#09090b` (deeper, more premium) |
| `--bs-primary` | `#06b6d4` (cyan) | `--color-accent-electric` | `#3b82f6` (blue, shares the "tech cool" feel) |
| `--bs-warning` | `#f59e0b` | `--color-accent-amber` | `#f59e0b` (identical) |
| `--bs-info` | `#3b82f6` | `--color-accent-electric` | `#3b82f6` (identical) |
| Font family | `Inter` | Font family | `Inter` (identical) |

> The marketing site is a **premium evolution** of the app's visual language — darker backgrounds, bolder accents, more whitespace — but the same DNA.

---

## 4. Design Tokens (Tailwind Config)

The following MUST be placed in `tailwind.config.mjs`. These are the **only** color and font values the agent should use.

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Toggle via class on <html>
  theme: {
    extend: {
      colors: {
        // Surfaces
        page:     { DEFAULT: '#fafafa', dark: '#09090b' },
        surface:  { DEFAULT: '#ffffff', dark: '#18181b' },
        elevated: { DEFAULT: '#f4f4f5', dark: '#27272a' },
        border:   { DEFAULT: '#e4e4e7', dark: '#3f3f46' },

        // Text
        primary:   { DEFAULT: '#09090b', dark: '#fafafa' },
        secondary: { DEFAULT: '#52525b', dark: '#a1a1aa' },
        muted:     { DEFAULT: '#a1a1aa', dark: '#71717a' },

        // Accents
        electric: {
          DEFAULT: '#3b82f6',
          hover:   '#2563eb',
          subtle:  'rgba(59, 130, 246, 0.1)',
        },
        amber: {
          DEFAULT: '#f59e0b',
          hover:   '#d97706',
          subtle:  'rgba(245, 158, 11, 0.1)',
        },

        // Semantic
        success: '#10b981',
        danger:  '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Heading scale (desktop-first)
        'display':  ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1':       ['3rem',    { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2':       ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':       ['1.5rem',  { lineHeight: '1.4', fontWeight: '600' }],
        'h4':       ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body':     ['1rem',    { lineHeight: '1.6', fontWeight: '400' }],
        'small':    ['0.875rem',{ lineHeight: '1.5', fontWeight: '400' }],
        'caption':  ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        // Section spacing scale
        'section': '6rem',      // Between major landing page sections
        'section-sm': '4rem',   // Between sub-sections
        'component': '2rem',    // Between components within a section
        'element': '1rem',      // Between elements within a component
      },
      borderRadius: {
        'card': '0.75rem',      // Cards and containers
        'button': '0.5rem',     // Buttons
        'badge': '9999px',      // Pills and badges
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
        'glow-sm':  '0 0 15px rgba(59, 130, 246, 0.15)',
        'glow-md':  '0 0 30px rgba(59, 130, 246, 0.2)',
      },
      maxWidth: {
        'content': '72rem',     // Max page content width (1152px)
        'prose': '65ch',        // Max prose/reading width
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### Font Loading

Load `Inter` via Google Fonts in `BaseLayout.astro`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

For code blocks, load `JetBrains Mono`:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 5. Component Visual Specifications

### 5.1 Navbar

| Property | Value |
|----------|-------|
| **Position** | Sticky top (`position: sticky; top: 0; z-index: 50;`) |
| **Background (dark)** | `#09090b` with `backdrop-filter: blur(12px)` and slight transparency (`rgba(9, 9, 11, 0.85)`) |
| **Background (light)** | `#fafafa` with `backdrop-filter: blur(12px)` and slight transparency |
| **Height** | 64px |
| **Border** | Bottom border: `1px solid var(--color-border)` |
| **Max width** | Content constrained to `max-w-content` (1152px), centered |
| **Left** | Logotype "MIND" (Inter Bold, 1.25rem) |
| **Center/Right** | Nav links: Docs, Guides, Changelog |
| **Far right** | Language Toggle (EN/ES text), Theme Toggle (Phosphor sun/moon), Primary CTA button ("Request Demo") |
| **CTA Button** | Electric blue bg (`#3b82f6`), white text, `border-radius: button`, hover: `#2563eb` |
| **Link hover** | Color transitions to `--color-accent-electric` over 200ms |

### 5.2 Hero Section

| Property | Value |
|----------|-------|
| **Height** | `min-height: 85vh` (fills most of the viewport, not full hero) |
| **Background** | `--gradient-surface` (radial gradient from surface to page-dark) |
| **Layout** | Two-column on desktop: left = text, right = visual asset. Stacked on mobile. |
| **Headline** | `font-size: display` (4.5rem). Apply `--gradient-primary` as text gradient (`background-clip: text`). |
| **Subtitle** | `font-size: h3` (1.5rem). `color: secondary`. Max width `50ch`. |
| **Primary CTA** | "Request Demo" or "Contact Us" — electric blue button, large (px-8 py-3). |
| **Secondary CTAs** | "View on GitHub" and "Read the Docs" — ghost/outline style buttons (border: electric, text: electric, bg: transparent). |
| **CTA order** | Primary → Secondary left to right. Wrap on mobile. |
| **Visual asset** | Right column. Product screenshot in a framed mockup, OR animated architecture diagram, OR video loop. The operator will provide the asset. Build a flexible container that accepts `<img>`, `<video>`, or embedded SVG. |
| **Decorative** | Subtle glow effect behind the visual asset (`box-shadow: glow-md`). Optional: very subtle animated gradient orb in the background (CSS only, no heavy JS). |

### 5.3 Value Proposition Section

| Property | Value |
|----------|-------|
| **Layout** | Two-column comparison. Left = "The Problem", Right = "MIND's Solution". |
| **Card style** | Glassmorphism cards — `background: rgba(24, 24, 27, 0.6)` in dark mode, `backdrop-filter: blur(16px)`, `border: 1px solid var(--color-border)`, `border-radius: card`. |
| **Problem column** | Icon + headline + bullet points. Slightly desaturated styling (muted tones). |
| **Solution column** | Icon + headline + bullet points. Electric blue accent highlights on key terms. |
| **Section heading** | `font-size: h2`. Can use gradient text or plain white. Centered above the two columns. |

### 5.4 Features Grid

| Property | Value |
|----------|-------|
| **Layout** | 3-column grid desktop, 2-column tablet, 1-column mobile |
| **Cards** | Glassmorphism cards (same as Value Proposition). Each card: icon (48px, electric blue) + title (h4) + description (body, secondary color) |
| **Hover** | `transform: translateY(-4px)`, elevated shadow (`card-hover`), subtle glow (`glow-sm`). Transition 300ms ease. |
| **Features** | Multi-LLM Backend, Polylingual Topic Modeling, Hybrid Retrieval, Modular Data Ingestion, Interactive Web App, Extensible Architecture |
| **Section heading** | `font-size: h2`. Centered. |

### 5.5 Architecture Diagram

| Property | Value |
|----------|-------|
| **Type** | Animated SVG/CSS diagram showing the MIND pipeline flow |
| **Source** | Based on the ASCII architecture in the product README (Docker stack + core pipeline flow) |
| **Style** | Dark background, electric blue lines and nodes, amber highlights for key processing steps. Monospace labels. |
| **Animation** | Moderate: sequential node-by-node fade-in on scroll (CSS `@keyframes` + `IntersectionObserver`). Data flow lines animate as dashed stroke. Total animation ~3 seconds. |
| **Fallback** | If animation fails or JS is disabled, render a static SVG with all elements visible. |

### 5.6 Research Badge / Academic Section

| Property | Value |
|----------|-------|
| **Content** | EMNLP 2025 citation, HuggingFace datasets link, expandable BibTeX |
| **Style** | Compact section. Amber accent border-left on the citation card. Monospace font for BibTeX. |
| **BibTeX** | Expandable/collapsible `<details>` element with "Copy" button. |
| **Prominence** | This section should be visible but not dominant. It's 10-20% of the page's visual weight. Positioned after Features, before the final CTA. |

### 5.7 CTA Section (Bottom Page)

| Property | Value |
|----------|-------|
| **Purpose** | Repeat the primary call-to-action after the user has scrolled through all value propositions. |
| **Layout** | Centered. Headline + subtitle + CTA button. |
| **Background** | Subtle gradient or slightly elevated surface. Not boring flat. |
| **Headline** | "Ready to verify your knowledge base?" or similar. Gradient text. |

### 5.8 Footer

| Property | Value |
|----------|-------|
| **Background** | Same as page background. Separated by top border. |
| **Content** | Nav links (Docs, Guides, Changelog), GitHub link, contact emails, copyright, university attribution. |
| **Style** | Minimal. `font-size: small`. `color: muted`. Links color: `secondary`, hover: `electric`. |
| **Layout** | 3-column desktop (nav / project links / legal), stacked on mobile. |

### 5.9 Sidebar (Secondary Pages)

| Property | Value |
|----------|-------|
| **Position** | Left side, sticky (`position: sticky; top: 80px`). Width: 256px fixed on desktop. |
| **Background** | Transparent (inherits page bg). Separated by right border. |
| **Items** | Section headers (collapsible, bold, uppercase small text) + page links (body text, left padding). |
| **Active state** | Left border: 2px solid electric blue. Text: electric blue. |
| **Mobile** | Collapses into a hamburger/drawer pattern or top-of-page dropdown. |

### 5.10 Code Block

| Property | Value |
|----------|-------|
| **Font** | `JetBrains Mono`, 0.875rem |
| **Background** | `#18181b` (dark), `#f4f4f5` (light) |
| **Border** | `1px solid var(--color-border)`, `border-radius: card` |
| **Copy button** | Top-right corner, ghost style, Phosphor `ph-copy` icon. On click: copies content, icon changes to `ph-check` for 2s, tooltip "Copied!". |
| **Syntax highlighting** | Use Astro's built-in Shiki integration. Theme: `github-dark` (dark mode), `github-light` (light mode). |

### 5.11 Changelog Timeline

| Property | Value |
|----------|-------|
| **Layout** | Vertical timeline. Left line (1px, border color). Entries extend to the right. |
| **Entry** | Date (caption size, muted) + type badge (pill: Feature=electric, Fix=amber, Dataset=success, Research=amber-subtle) + title (h4) + body (prose). |
| **Hover** | Entry card gets subtle `card-hover` shadow lift. |

### 5.12 Error Pages (404, 500)

| Property | Value |
|----------|-------|
| **Style** | Same base layout. Large centered error code (display size, gradient text). Friendly message. Links back to Home, Docs, Guides. |
| **Tone** | Professional but slightly warm. "We couldn't find that page" not "ERROR: 404 NOT FOUND". |

---

## 6. Interaction & Motion Design

### Animation Budget: Moderate

The site targets an **elegant, professional** aesthetic. Animations enhance the experience subtly — they never distract, delay, or feel frivolous.

### Animation Inventory

| Element | Type | Trigger | Duration | Technology |
|---------|------|---------|----------|------------|
| Page sections | Fade up + opacity | Scroll into viewport | 500ms, ease-out | CSS `@keyframes` + `IntersectionObserver` (vanilla JS) |
| Feature cards | Staggered reveal | Scroll into viewport | 150ms delay between cards | CSS stagger with `animation-delay` |
| Navbar | Background opacity | Scroll past hero | 200ms | CSS transition triggered by scroll class |
| Buttons | Scale + shadow | Hover | 200ms | CSS `transform: scale(1.02)` |
| Cards | Lift + shadow | Hover | 300ms ease | CSS `transform: translateY(-4px)`, shadow transition |
| Architecture diagram | Sequential node reveal | Scroll into viewport | 3s total | CSS `@keyframes` + `IntersectionObserver` |
| Architecture flow lines | Dashed stroke animation | Scroll into viewport | 2s, delayed | CSS `stroke-dashoffset` animation |
| Theme toggle | Icon rotate | Click | 300ms | CSS `transform: rotate(180deg)` |
| Code copy button | Icon swap | Click | Instant swap, 2s revert | Vanilla JS |
| Page transitions | Fade opacity | Route change | 150ms | Astro `ViewTransitions` (optional, test performance first) |

### Animation Rules

1. **No Framer Motion, GSAP, or heavy animation libraries.** All motion is CSS-based with minimal vanilla JS (only `IntersectionObserver` for scroll triggers).
2. **`prefers-reduced-motion` MUST be respected.** Wrap all animations in `@media (prefers-reduced-motion: no-preference)`.
3. **No animation on page-critical content.** The hero headline and CTA MUST be visible instantly, not after an animation delay.
4. **No parallax.** It degrades performance and conflicts with the "professional" tone.
5. **Easing:** Always `ease-out` for entrances, `ease-in` for exits. Never linear (too mechanical) or `ease-in-out` (too bouncy for this brand).

### Scroll Animation Helper (Vanilla JS)

```javascript
// Place in a <script> tag in BaseLayout.astro
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

```css
/* In global.css */
[data-animate] {
  opacity: 0;
  transform: translateY(24px);
}

[data-animate].animate-in {
  animation: fadeUp 0.5s ease-out forwards;
}

/* Stagger support */
[data-animate][data-delay="1"] { animation-delay: 150ms; }
[data-animate][data-delay="2"] { animation-delay: 300ms; }
[data-animate][data-delay="3"] { animation-delay: 450ms; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-animate] {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
}
```

---

## 7. Responsive Design

### Approach: Desktop-First

Design and build for desktop viewports first (1440px reference). Scale down for smaller screens.

### Breakpoints

| Name | Max-width | Notes |
|------|-----------|-------|
| **Desktop** | > 1024px | Primary target. Full layouts. |
| **Tablet** | ≤ 1024px | Feature grid → 2 columns. Sidebar collapses. |
| **Mobile** | ≤ 768px | Single column. Navbar hamburger menu. |
| **Small mobile** | ≤ 480px | Font scale reduced. Hero stacked. |

### Key Responsive Behaviors

| Component | Desktop (>1024px) | Tablet (≤1024px) | Mobile (≤768px) |
|-----------|-------------------|-------------------|-----------------|
| **Navbar** | Horizontal links + CTA | Horizontal, CTA smaller | Hamburger menu, CTA in drawer |
| **Hero** | Two-column (text + visual) | Two-column, smaller visual | Stacked (text on top) |
| **Features Grid** | 3-column | 2-column | 1-column |
| **Value Prop** | Two-column side-by-side | Two-column narrower | Stacked |
| **Sidebar** | Fixed left, 256px | Collapsible overlay | Top-of-page dropdown |
| **Footer** | 3-column | 2-column | Single column stacked |
| **Section spacing** | `6rem` | `4rem` | `3rem` |
| **Display heading** | 4.5rem | 3.5rem | 2.5rem |

---

## 8. Dark/Light Mode

### Implementation

| Property | Value |
|----------|-------|
| **Default** | Dark mode |
| **Mechanism** | `class="dark"` on `<html>` element. Toggle via button. |
| **Persistence** | `localStorage.setItem('theme', 'dark' | 'light')` |
| **No flash** | Inline script in `<head>` reads `localStorage` before first paint (same pattern as the MIND app). |

### Toggle Component

```astro
---
// ThemeToggle.astro
---
<button id="theme-toggle" class="btn-theme-toggle" aria-label="Toggle theme">
  <i class="ph ph-moon" id="theme-icon"></i>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  
  toggle?.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    if (icon) icon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
  });
</script>
```

---

## 9. Content & Trust Signals

### Research Citation (MUST HAVE)

Display prominently (but not dominantly) on the landing page:

```text
📄 Published at EMNLP 2025
"Discrepancy Detection at the Data Level: Toward Consistent Multilingual Question Answering"
Calvo-Bartolomé, Aldana, Cantarero, de Mesa, Arenas-García, Boyd-Graber

[View Paper] [Cite (BibTeX)] [HuggingFace Datasets]
```

- Card with amber left-border accent.
- Expandable BibTeX with copy button.
- Link to HuggingFace dataset collection.

### GitHub Badge (DEFERRED)

Do not display dynamic star counts. When the repo gains traction, add a static badge or shield.

### Institution Logos (DEFERRED)

Not included in current version. Reserved for future partnership displays.

---

## 10. Accessibility

### Minimum Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Semantic HTML** | Use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`. Never use `<div>` for navigation or content structure. |
| **Alt text** | All `<img>` tags MUST have descriptive `alt` attributes. Screenshots: describe what the user sees. Diagrams: describe the data flow. |
| **Focus states** | All interactive elements MUST have visible focus rings (electric blue outline, 2px, offset 2px). |
| **ARIA labels** | Theme toggle: `aria-label="Toggle theme"`. Language toggle: `aria-label="Switch language"`. Nav: `aria-label="Main navigation"`. |
| **Color contrast** | Primary text on page bg: ≥ 7:1 (WCAG AAA). Secondary text: ≥ 4.5:1 (WCAG AA). Verified via Lighthouse. |
| **Keyboard navigation** | Full site navigable via Tab, Enter, Escape. Modals trap focus. Skip-to-content link. |

---

## 11. SEO & Meta

### Per-Page Meta Template

```html
<title>{pageTitle} — MIND</title>
<meta name="description" content="{pageDescription}">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:title" content="{pageTitle} — MIND">
<meta property="og:description" content="{pageDescription}">
<meta property="og:image" content="/images/og-{pageName}.png">
<meta property="og:type" content="website">
<meta property="og:url" content="{canonicalUrl}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{pageTitle} — MIND">
<meta name="twitter:description" content="{pageDescription}">
<meta name="twitter:image" content="/images/og-{pageName}.png">

<link rel="canonical" href="{canonicalUrl}">
```

### Sitemap

Auto-generated by `@astrojs/sitemap`. Configured in `astro.config.mjs` with the `site` property.

---

## 12. Summary: Design DNA

| Principle | Expression |
|-----------|------------|
| **Elegant** | Generous whitespace, restrained palette, no visual clutter |
| **Professional** | Inter font, consistent spacing scale, muted animations |
| **Technical** | Monospace code blocks, architecture diagrams, Phosphor icons |
| **Coherent** | Shared DNA with the MIND app (Inter, cyan/blue/amber, dark-first) |
| **Accessible** | Semantic HTML, contrast ratios, keyboard navigation |
| **Agent-Ready** | Every token, color, and spacing value explicitly defined — no improvisation |
