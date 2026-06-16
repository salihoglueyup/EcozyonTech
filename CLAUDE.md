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
- **i18n**: each namespace lives in `src/core/i18n/ns/<name>.js`
  (default-exports `{ tr, en }`); `dictionary.js` assembles them into
  `ECO_I18N.tr` / `.en` via `import.meta.glob`. Add a namespace = drop a new
  file in `ns/`. A test enforces **deep** (nested) TR/EN key parity — keep
  both in sync.
- **shared primitives** (`src/shared/ui/primitives.jsx`): `PageHeader`
  (eyebrow Tag + **h1** + intro — the per-route page title; sibling of
  `SectionHeader`, which is the feature-section **h2** and takes an optional
  `as` prop to render h1), `ArrowRight` (the one CTA arrow icon, aria-hidden),
  `Tag`, `EcoLogo`, etc. Don't re-inline a page header or arrow svg — use
  these. A test enforces **exactly one `<h1>` per route page** (heading
  outline + a11y), and an axe pass covers each page + the navbar mega-menu.
- **design tokens**: brand color lives in `src/core/tokens.js` (consumed by
  Tailwind, the accent system, charts); the `.eco-gradient-text` utility is
  the brand heading gradient; `GRADIENTS.cta`/`.panel` are the canonical CTA
  fill + faint panel tint (no inline `linear-gradient` dupes). **content
  search**: collections self-register
  in `src/core/content/registry.js` — `buildSearchDocs` derives from it, so a
  new searchable type is "register once" (no edits to search/palette/404).
- **navigation IA**: routes carry a `group` (product/resources/company/legal) +
  a `place` (nav/footer/none) in `site.js`. Navbar (mega-menu), footer (columns)
  and the sitemap all derive from one grouping via `NAV_GROUPS`/`FOOTER_GROUPS`
  + `routesInGroup()`. `NAV_ITEMS` = the `featured` highlights (NotFound chips).
- **structured data / SEO**: pure schema.org builders in `src/core/lib/jsonld.js`
  (Article/Product/FAQPage/BreadcrumbList/WebSite…). The prerender injects the
  right JSON-LD per route + TR/EN/x-default **hreflang** (the `?lang=en` alt
  renders English — AppProvider reads `?lang=` post-mount). Visible
  `<Breadcrumbs>` on deep content pages. Pricing data lives in
  `src/core/data/pricing.js` (page + prerender share it).
- **telemetry**: cookieless `track(name, props)` in `src/core/lib/telemetry.js`
  honors DNT/GPC, beacons to `/api/telemetry` (sink mirrors vitals; demo-acks).
  Dev `EventsHud` overlay. Named "telemetry" not "analytics" on purpose —
  content blockers block any URL containing "analytics" (would break the dev
  module load). Both telemetry.js + EventsHud are coverage-excluded like vitals.
- **motion tokens**: durations/easings live in `src/core/motion.js`, mirrored as
  `--dur-*`/`--ease-*` CSS vars (index.css `:root`). `prefersReducedMotion()` +
  `useReducedMotion()` replace ad-hoc matchMedia reads.
- **route table + prefetch**: `src/app/routes.js` is the single `path → lazy
  import` table (kept component-free to avoid a router↔layout cycle). router.jsx
  builds elements; `routePrefetch.js` warms a chunk on hover/focus of any
  internal link (Save-Data-aware), mounted via `useRoutePrefetch()` in MainLayout.
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
- `EcoGlobe` — abstract hero decoration, Home only. Shares the AI motif
  (nodes + arcs + traveling packets) and the perf hygiene (IO/visibility
  pause, reduced-motion, full dispose) with WorldGlobe, but is otherwise
  independent — no shared code. **Do not touch** during WorldGlobe work.
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
Parked: a WorldGlobe "showcase" mode (compact decorative variant of the
data globe). The AI node/arc motif port to `EcoGlobe` is done — see the
EcoGlobe note above.

### Real geography (G0–G5)

Built from Natural Earth 110m (public domain) via `scripts/build-geo.mjs`
(`npm run build:geo`, run manually — outputs are committed, NOT in the CI
build chain; `data-src/` is gitignored, `topojson-client` is build-only).
Outputs in `src/core/data/`:
- `land.json` — 1° packed bitfield. `geo.js` exposes O(1) `isLand` +
  re-exports `latLonToXYZ`. The globe dot field uses this (not the old
  `ECO_GEO` ellipses) so dots align with borders. `atob` decode runs at
  module load (Node has `atob`, so prerender's lazy resolve is fine).
- `borders.json` — 226 rings, 0.2° quantized → one merged `LineSegments`
  (`borders` opt). ~30 KB gz; whole WorldGlobe lazy chunk ≈ 42 KB gz.
- `capitals.json` — 215 Admin-0 capitals → dim shared-geo/mat dots
  (`capitals` opt). Hover reuses the raycaster but capitals are **not
  selectable** and product cities take hover priority, so the impact
  story stays primary. `HoverCard` renders a capital badge + skips
  users/co2/solar (`m.details.capital`).

Both layers render on `/impact` **and** dashboard compact (user choice);
compact adaptation = fainter/thinner borders + smaller/dimmer capitals.
To regenerate after data/source changes: `npm run build:geo` then commit
the three JSON files.

## Roadmap (in progress)

All phases complete: P1 testing/CI/ErrorBoundary/404 · P2 serverless backend +
real forms · P3 new pages (Pricing/Blog/Careers/Legal) · P4 SEO/prerender ·
P5 a11y (skip link, prefers-reduced-motion, labelled inputs) + polish.

Structural moves done: design-token pipeline · content registry · i18n ns
split · navigation IA · structured-data/hreflang · analytics layer · motion
tokens · route-table + prefetch (see Conventions). **Parked on purpose:** the
`createBrowserRouter` data-router migration — high risk to the custom
prerender, low benefit for a static-content app (no async loaders; errors
already handled by the layout ErrorBoundary). Revisit only if real data
loading lands. TypeScript intentionally out of scope (possible future opt-in).
