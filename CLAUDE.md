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

## Prerender / SEO (implemented — Phase 4)

`vite-react-ssg` was incompatible (rr6 + Vite ≤7). Built a **custom
prerender**: `npm run build` = client build → SSR build of
`src/entry-server.jsx` → `node scripts/prerender.mjs`.

- `entry-server.jsx` uses React 19 `prerenderToNodeStream` + `StaticRouter`,
  which **resolves all Suspense** (lazy pages + globes) so emitted HTML is
  complete and indexable. Effects (Three.js, scroll) only run on the
  hydrated client.
- `App.jsx` (client) = `BrowserRouter > AppShell`; `entry-server` =
  `StaticRouter > AppShell`. `AppShell` = providers + routes (router-agnostic).
- `main.jsx`: `hydrateRoot` if `#root` has children (prod), else `createRoot`
  (dev).
- Hydration safety: `AppProvider` starts from `DEFAULTS`, then applies saved
  prefs in a one-time mount effect (eslint-disabled `set-state-in-effect` on
  that line, intentional) so server HTML == client first render.
- SSR-guarded `src/features/impact-map`: `navigator` guarded; theme now from
  `useApp()` not `document`.
- `scripts/prerender.mjs` writes `dist/<route>/index.html` for every route +
  each blog slug, injects per-route `<title>/description/canonical/og`, and
  emits `sitemap.xml` + `robots.txt`. JSON-LD Organization is static in
  `index.html`.

Caveat: `npm run preview` (vite) does SPA fallback and serves root
`index.html` for clean URLs — it does NOT reflect the per-route prerender.
Verify prerender by inspecting `dist/<route>/index.html` directly, or with a
filesystem-routing static server (`npx serve dist`). Vercel serves the
per-route files correctly (filesystem before the SPA rewrite in vercel.json).
`dist-server/` is the SSR build output (git-ignored, eslint-ignored).

## WorldGlobe engine (src/shared/3d/WorldGlobe.jsx) — enhancement reference

Imperative Three.js. `WorldGlobe(props)` (React) → `makeWorldGlobe(container,
opts)` → `{ dispose, update, flyTo }`.

**Two separate globes exist on purpose** (decided to keep separate):
- `EcoGlobe` — abstract hero decoration, Home only. **Do not touch** during
  WorldGlobe work.
- `WorldGlobe` — the geographic data globe. **Reused in two places**, so
  every change must preserve both:
  - `/impact` (ImpactMap): full — all layers, side panel, hover tooltip,
    time scrubber, fly-to on select.
  - `/services` (dashboard): `compact={true}`, layers `{active,partners,arcs}`,
    no onHover/onSelect. Must stay light.

**Opts/props contract:** `layers {active,partners,arcs,heat,solar}`,
`onHover(city,pos)`, `onSelect(city)`, `selected`, `timeYear (2024–2026)`,
`showTerminator`, `compact`, `theme ('light'|'dark')`, `cyan`, `emerald`
(accent hex; default `#0EA5E9`/`#10B981` — only `/impact` passes them,
dashboard keeps defaults so its look is unchanged).

**Lifecycle:** setup effect deps `[props.theme, props.compact, props.cyan,
props.emerald]` → scene fully rebuilt on those (rare, OK). `update()` pushes
layers/selected/timeYear/showTerminator without rebuild. `flyTo()` on
`selected.name` change. `propsRef` keeps latest callbacks for the rAF loop.

**Scene graph (root group):** inner sphere · land-mask dot field
(`N = (compact?4500:8200) * (lowPower?0.55:1)`, oceans skipped via
`ECO_GEO.isLand`) · Fresnel atmosphere shell · terminator line + night
hemisphere · cityGroup (core+halo per city) · heatGroup · solarGroup ·
arcGroup (HQ "İstanbul" → top cities by users, lines + traveling packets).

**Implemented enhancements (E1–E4 — done):**
- E1 perf: rAF **pauses** offscreen (IntersectionObserver) + tab-hidden
  (visibilitychange), resumes via `resume()`. `reduceMotion`/`motion`
  multiplier zeroes auto-rotate + pulses + arc/terminator motion under
  prefers-reduced-motion. `lowPower` tier (deviceMemory≤4 or min dim <420):
  ~55% points, pixelRatio cap 1.5, AA off. `dispose()` traverses scene and
  frees all geometries/materials + detaches IO/visibility listeners.
- E2 visual: atmosphere is a **Fresnel ShaderMaterial** rim (BackSide,
  additive); city halos use additive blending. Structural color
  (inner sphere, landmass dot ramp `accentA→accentB`, atmosphere) is
  accent-driven via `cyan`/`emerald`; semantic city/heat/solar colors stay
  fixed. Setup effect deps now include `props.cyan/emerald`.
- E3 interaction: wheel + 2-pointer pinch zoom (clamped, lerped), disabled
  on compact so it never hijacks page scroll; `wheel` is `passive:false`
  with preventDefault. Keyboard: container `tabIndex/role=application/
  aria-label`, arrows rotate, +/- zoom. `flyTo` on select unchanged.
- E4 data: 59 cities (was ~43); arcs sorted by users (deterministic),
  16 routes (10 compact). ImpactMap stats + live CO₂ counter scale from
  the dataset automatically.

Invariants for future 3D work: keep `/services` compact light + scroll-safe
and `/impact` behavior intact; keep deterministic for prerender/tests; new
visual/interaction features should stay opt-gated or behavior-preserving.
Parked (Q1 = keep globes separate): porting the AI node/arc motif to
`EcoGlobe` / a WorldGlobe "showcase" mode.

## Roadmap (in progress)

All phases complete: P1 testing/CI/ErrorBoundary/404 · P2 serverless backend +
real forms · P3 new pages (Pricing/Blog/Careers/Legal) · P4 SEO/prerender ·
P5 a11y (skip link, prefers-reduced-motion, labelled inputs) + polish.
TypeScript intentionally out of scope (possible future opt-in phase).
