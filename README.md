# Ecozyon Tech

Corporate website for Ecozyon Tech, built with **React 19**, **Vite**, **Tailwind CSS**
and **react-router-dom**. Multi-page SPA following a Feature-Sliced Design (FSD) layout.

## Getting Started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (Vite)
npm run build    # production build -> dist/
npm run preview  # preview the production build
npm run lint     # ESLint (flat config)
```

## Routes

| Path        | Page      | Composes                                                   |
| ----------- | --------- | ---------------------------------------------------------- |
| `/`         | Home      | Hero + Metrics                                             |
| `/services` | Services  | How it works + Tech ecosystem + Use cases + Dashboard demo |
| `/impact`   | Impact    | Interactive 3D impact map                                  |
| `/about`    | About     | About bento (mission/vision/values/team)                   |
| `/contact`  | Contact   | Contact form + "what happens next" timeline                |

Unknown paths redirect to `/`. SPA fallback for deep links is configured in
`vercel.json`.

## Architecture (Feature-Sliced Design)

```
src/
  app/          Composition root: providers, router, App entry
    providers/  AppProvider — lang/theme/accent/typography state (+ localStorage)
    router.jsx  Lazy-loaded routes under the Main layout
  pages/        One folder per route; composes feature sections + sets <title>
  layouts/
    Main/       Persistent shell: Navbar, Footer, ScrollToTop, scroll progress
  features/     Self-contained sections (hero, metrics, tech-ecosystem,
                use-cases, how-it-works, dashboard, impact-map, about,
                contact, dev-tweaks)
  shared/
    ui/         Reusable primitives (Tag, GlowOrb, EcoLogo)
    3d/         Three.js globes, lazy-loaded via LazyGlobes
  core/
    config/     Site metadata, routes, navigation
    i18n/        TR/EN dictionary
    data/        Static datasets (cities)
    hooks/       useDocumentMeta (per-route SEO)
```

### Key conventions

- **`@/` path alias** maps to `src/` (configured in `vite.config.js` + `jsconfig.json`).
- **Shared state** lives in `AppProvider` (`useApp()` / `useI18n()`); pages pass the
  active dictionary down to feature sections as props.
- **Internationalization**: TR/EN, switchable from the navbar, persisted to
  `localStorage`.
- **Performance**: pages are route-split and Three.js loads as its own dynamic
  chunk only when a globe renders (initial JS is ~39 kB instead of ~1.1 MB).
- **Design tweak panel** (`features/dev-tweaks`) is mounted only when
  `import.meta.env.DEV` — it never ships to production.
