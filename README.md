# Ecozyon Tech

> Corporate **portfolio/demo** site — AI + sustainability + wearables.
> Multi-page, prerendered, bilingual (TR/EN), with a real serverless form
> backend, an interactive 3D globe driven by real-world geography, and a
> green CI pipeline.

[![CI](https://github.com/salihoglueyup/EcozyonTech/actions/workflows/ci.yml/badge.svg)](https://github.com/salihoglueyup/EcozyonTech/actions/workflows/ci.yml)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind 3](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![React Router 7](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r184-000000?logo=threedotjs&logoColor=white)
![Prerender](https://img.shields.io/badge/prerender-static_SSG-10b981)
![License](https://img.shields.io/badge/license-MIT-blue)

> Not a real product — built to **showcase engineering quality** end-to-end:
> SSG, a11y, perf, i18n, serverless, testing, CI.

<!-- Screenshots/GIFs will land in docs/screenshots/ during Phase A browser pass. -->

## Highlights

- **Multi-page SPA** with **per-route static prerender** (React 19
  `prerenderToNodeStream` + `StaticRouter`) — every route ships its own HTML,
  `<title>`, canonical and OG tags, plus generated `sitemap.xml` + `robots.txt`.
- **3D world globe** (Three.js) built from **real Natural Earth 110m**
  data — country borders, 215 capitals, raster land mask — lazy-loaded so
  it never touches the initial bundle (~39 kB JS gz).
- **Serverless form backend** (`/api/contact`, `/api/newsletter`) on Vercel
  + a Vite dev middleware that runs the same pure logic locally. No Vercel
  CLI required.
- **Bilingual TR/EN** dictionary with **test-enforced key parity** between
  the two languages.
- **a11y baseline:** skip link, `prefers-reduced-motion` handling, labelled
  inputs, keyboard-rotatable globe.
- **Feature-Sliced Design**, clean separation, every layer testable.
- **CI** (`.github/workflows/ci.yml`) blocks any red lint, test, or build.

## Quick start

```bash
git clone https://github.com/salihoglueyup/EcozyonTech.git
cd EcozyonTech
npm install
npm run dev        # Vite dev server (forms work via dev middleware)
npm run build      # client build + SSR build + static prerender → dist/
npm run preview    # preview build (SPA fallback — see CLAUDE.md caveat)
npm run lint       # ESLint (flat config)
npm test           # Vitest (run once)
npm run e2e        # Playwright behavioral e2e (excludes @visual)
npm run e2e:visual # Playwright visual regression (local; platform-specific)
```

> `lint`, `test`, `build`, `bundle:check` and behavioral `e2e` are enforced
> by CI. The visual-regression suite (`e2e:visual`) is local-only — its
> screenshot baselines are platform-specific (font rendering). Refresh them
> after intentional UI changes with `npm run e2e:visual:update`.

## Routes

| Path           | Page     | Notes                                              |
| -------------- | -------- | -------------------------------------------------- |
| `/`            | Home     | Hero + Metrics + EcoGlobe decorative globe         |
| `/services`    | Services | How it works · Tech · Use cases · Dashboard demo   |
| `/pricing`     | Pricing  | 3 tiers                                            |
| `/impact`      | Impact   | Interactive 3D impact map (real geography)         |
| `/about`       | About    | Mission / vision / values / team                   |
| `/blog`        | Blog     | Data-driven list                                   |
| `/blog/:slug`  | Post     | Individual insight                                 |
| `/careers`     | Careers  | Open roles                                         |
| `/contact`     | Contact  | Real form → `/api/contact`                         |
| `/legal`       | Legal    | Privacy (KVKK) + Terms (`#privacy` / `#terms`)     |
| `*`            | NotFound | Real bilingual 404                                 |

## 3D Globe

The `/impact` map and the `/services` dashboard mini-globe share the same
`makeWorldGlobe()` engine — every change has to preserve both. Real
geography (country borders + 215 capitals + raster land mask) is generated
from **Natural Earth 110m** (public domain) at build time:

```bash
npm run build:geo  # regenerates src/core/data/{land,borders,capitals}.json
```

Outputs are **committed** (not part of the CI build chain). The whole globe
chunk — code + geo data — is **~47 kB gzip**, lazy-loaded after first paint.

Engine details (Fresnel atmosphere, IO/visibility offscreen pause,
reduced-motion handling, low-power tier, keyboard a11y, fly-to, time
scrubber, etc.) are in [`CLAUDE.md`](./CLAUDE.md) under "WorldGlobe engine".

## Backend

`/api/contact`, `/api/newsletter` and `/api/apply` are Vercel serverless
functions that share pure logic in `api/_lib/forms.js` — validation,
honeypot, per-IP rate limiting, optional Resend email via `RESEND_API_KEY`
+ `CONTACT_TO` (demo-mode otherwise).

`/api/vitals` ingests Web Vitals beacons via `api/_lib/vitals.js` —
validates the metric and forwards it to `VITALS_WEBHOOK_URL` if set, else
acks cheaply (demo mode). A Vite dev middleware runs the exact same logic
locally for every endpoint, so the dev loop matches production. All `_lib`
logic is unit-tested.

## Architecture (FSD)

```
api/             serverless functions + shared pure logic (unit-tested)
scripts/         prerender.mjs (post-build static generation)
                 build-geo.mjs  (Natural Earth → land/borders/capitals JSON)
src/app/         App (BrowserRouter) · AppShell · entry-server (StaticRouter)
                 router · providers/AppProvider
src/pages/       one folder per route; sets <title> via useDocumentMeta
src/layouts/Main Navbar, Footer, ScrollToTop, ErrorBoundary, skip link
src/features/    hero, metrics, tech-ecosystem, use-cases, how-it-works,
                 dashboard, impact-map, about, contact, dev-tweaks
src/shared/      ui (primitives, ErrorBoundary) · 3d (lazy Three.js globes)
src/core/        config (routes/nav) · i18n · data (cities/posts/jobs) · hooks
src/test/        Vitest setup + cross-cutting tests
```

## Conventions

- `@/` alias → `src/` (Vite + jsconfig).
- Shared state in `AppProvider` (`useApp()` / `useI18n()`), persisted to
  `localStorage`, hydration-safe (DEFAULTS first, prefs applied post-mount).
- Pages pass the active dictionary down as the `t` prop.
- Route-split pages; Three.js is its own dynamic chunk.
- a11y: skip link, `prefers-reduced-motion`, labelled inputs, keyboard-
  navigable globe.
- TypeScript intentionally out of scope.

See [`CLAUDE.md`](./CLAUDE.md) for the full engineering notes (prerender
caveats, globe internals, design decisions).

## License

[MIT](./LICENSE) — feel free to study, fork, and learn from.
