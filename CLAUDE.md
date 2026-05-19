# CLAUDE.md

Project memory for Ecozyon Tech. Read this first.

## What this is

Corporate **portfolio/demo** website for "Ecozyon Tech" (AI + sustainability +
wearables). React 19 + Vite 8 + Tailwind 3 + react-router 7. Multi-page SPA,
Feature-Sliced Design. Bilingual TR/EN. Not a real product — built to showcase
engineering quality.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # production build -> dist/
npm run preview  # preview build
npm run lint     # ESLint (flat config)
npm test         # Vitest (run once)
npm run test:watch
```

All four (lint, test, build) must stay green; CI enforces them
(`.github/workflows/ci.yml`).

## Architecture (FSD)

```
src/app/        composition root: App, router (lazy routes), providers/AppProvider
src/pages/      one folder per route; composes feature sections, sets <title>
src/layouts/Main persistent shell: Navbar, Footer, ScrollToTop, ScrollProgress,
                ErrorBoundary around <Outlet/>, dev-only DevTweaks
src/features/   self-contained sections (hero, metrics, tech-ecosystem,
                use-cases, how-it-works, dashboard, impact-map, about,
                contact, dev-tweaks)
src/shared/ui   primitives (Tag/GlowOrb/EcoLogo), ErrorBoundary
src/shared/3d   Three.js globes, lazy-loaded via LazyGlobes
src/core/       config (site/routes/nav), i18n (dictionary), data (cities),
                hooks (useDocumentMeta)
src/test/       Vitest setup + cross-cutting tests
```

Routes: `/` `/services` `/impact` `/about` `/contact` + `*` → real NotFound page.

## Conventions / things to know

- **`@/` alias = `src/`** (vite.config.js + jsconfig.json).
- **Shared state** lives in `AppProvider` (`useApp()`, `useI18n()`):
  lang/theme/accents/fonts, persisted to `localStorage` (`ecozyon.prefs`),
  applies CSS vars + `dark` class + `<html lang>`. Pages read from context and
  pass the active dictionary down to feature sections as the `t` prop.
- **i18n** is `src/core/i18n/dictionary.js` (`ECO_I18N.tr` / `.en`). A test
  enforces TR/EN top-level key parity — keep both in sync.
- **dev-tweaks** is a vendored design-host panel; mounted only when
  `import.meta.env.DEV`. Never ships. ESLint relaxes react-hooks/no-unused
  for it on purpose (see eslint.config.js override) — don't "fix" its
  internals.
- **3D is lazy** (`LazyGlobes`): Three.js is its own dynamic chunk; renders a
  Suspense fallback on the server / before load. Initial JS ~39 kB.
- **JSX automatic runtime** everywhere (no `import React`). Vitest must match:
  `esbuild.jsx: 'automatic'` in vite.config.js — do not remove.

## Known / intentional lint warnings (0 errors, ~12 warnings)

- `react-refresh/only-export-components` — files co-locate hooks/constants
  with components (deliberate FSD; HMR-only hint).
- `react-hooks/exhaustive-deps` — the generated Three.js globes use a
  single-setup effect on purpose (adding deps would rebuild the globe every
  render). Do not add the flagged deps.

## Prerender decision (Phase 0 spike — important for SEO work)

`vite-react-ssg` is **incompatible** (needs react-router ^6 + Vite ^2–7; we
run rr7 + Vite 8). Chosen approach for SEO/prerender: **custom prerender via
`react-dom/server` + react-router `StaticRouter`** as a post-build Node step
(Vite SSR build) + `hydrateRoot`.

SSR hazards to guard before prerender (only one component):
`src/features/impact-map/index.jsx` uses `navigator.language` (in a useMemo)
and `document.documentElement` (in render) — guard both with
`typeof window !== 'undefined'`. Everything else is already SSR-safe
(effects/handlers, DEV-only, or lazy 3D → fallback). `AppProvider.loadPrefs()`
is already guarded.

## Roadmap (in progress)

Phased enhancement: P1 testing/CI/ErrorBoundary/404 (done) · P2 serverless
backend + real forms · P3 new pages (Pricing/Blog/Careers/Legal) · P4
SEO/prerender · P5 a11y/polish. TypeScript intentionally out of scope.
