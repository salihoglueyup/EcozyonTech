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
`showTerminator`, `compact`, `theme ('light'|'dark')`.

**Lifecycle:** setup effect deps `[props.theme, props.compact]` → scene fully
rebuilt on theme/compact change (rare, OK). `update()` pushes
layers/selected/timeYear/showTerminator without rebuild. `flyTo()` on
`selected.name` change. `propsRef` keeps latest callbacks for the rAF loop.

**Scene graph (root group):** inner sphere · land-mask dot field
(`N = compact ? 4500 : 8200`, oceans skipped via `ECO_GEO.isLand`) · backside
glow sphere · terminator line + night hemisphere · cityGroup (core+halo per
city) · heatGroup · solarGroup · arcGroup (HQ "İstanbul" → top-12 cities
>200 users, lines + traveling packets).

**Enhancement seams (for E1–E4):**
- E1 perf: rAF is **unconditional** (no offscreen/hidden pause). pixelRatio
  capped at 2; N already compact-aware. **No geometry/material dispose** —
  only `renderer.dispose()` → GPU leak on theme/compact change & unmount.
  Auto-rotate `auto.rot=0.0008` (set 0 for prefers-reduced-motion).
- E2 visual: glow is flat backside sphere; terminator is a static tilted
  ring (real sun orientation intentionally skipped); colors are hardcoded
  hex (0x0EA5E9/0x10B981/0xF59E0B) — wire to accents/theme.
- E3 interaction: pointer-drag rotate (x clamped ±1.2), raycast hover/click
  on cityGroup, `flyTo` exists; **no zoom, no keyboard**; window-level
  pointermove/up listeners.
- E4 data: arc HQ hardcoded "İstanbul"; marker size already scales with
  users/co2.

All E1–E4 changes: new opt flags **default off** or behavior-preserving;
verify `/services` compact + `/impact` both unaffected; keep deterministic
for prerender/tests.

## Roadmap (in progress)

All phases complete: P1 testing/CI/ErrorBoundary/404 · P2 serverless backend +
real forms · P3 new pages (Pricing/Blog/Careers/Legal) · P4 SEO/prerender ·
P5 a11y (skip link, prefers-reduced-motion, labelled inputs) + polish.
TypeScript intentionally out of scope (possible future opt-in phase).
