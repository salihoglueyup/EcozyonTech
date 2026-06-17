---
name: add-route-page
description: Scaffold a new route/page for the Ecozyon Tech site end-to-end — the page component, the lazy route-table entry, the navigation IA registration (group + place), i18n, prerender awareness, and the required tests. Use when adding a new top-level page like /pricing or /careers.
---

# Add a route page (end-to-end)

A new page touches several single-source-of-truth files. Do all of them or the
nav/footer/sitemap/prerender will be inconsistent.

## Steps

1. **Page component** — `src/pages/<Name>/index.jsx`. Compose feature sections;
   set the document title/description with `useDocumentMeta(...)`; render the
   page **h1** via `PageHeader` (eyebrow Tag + h1 + intro). Read copy from
   `useApp()` and pass `t` down to sections.

   ```jsx
   import { PageHeader } from '@/shared/ui/primitives';
   import { useApp } from '@/app/providers/AppProvider';
   import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';

   export default function <Name>Page() {
     const { t } = useApp();
     const p = t.<namespace>;
     useDocumentMeta(p.metaTitle, p.metaDesc);
     return (
       <div className="...">
         <PageHeader eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
         {/* sections */}
       </div>
     );
   }
   ```

2. **Route table** — add `path → () => import('@/pages/<Name>')` to
   `src/app/routes.js` (the single lazy path→import table; keep it
   component-free to avoid the router↔layout cycle). `router.jsx` builds the
   element; `routePrefetch.js` warms the chunk on hover automatically.

3. **Navigation IA** — register the route in `src/core/config/site.js` with a
   `group` (product | resources | company | legal) and a `place` (nav | footer |
   none). Navbar mega-menu, footer columns, and the sitemap all derive from this
   one grouping via `NAV_GROUPS`/`FOOTER_GROUPS`/`routesInGroup()` — do NOT
   hand-edit the navbar or footer.

4. **i18n** — add the page namespace (`add-i18n-namespace` skill); TR/EN parity.

5. **Prerender / SEO** — `scripts/prerender.mjs` writes `dist/<route>/index.html`
   for every route automatically. If the page deserves richer structured data
   (Collection/Product/FAQ/etc.), add a case in `structuredData()`; otherwise it
   gets the default title/description/canonical/og + BreadcrumbList + hreflang.
   Add a visible `<Breadcrumbs>` if it's a deep content page.

6. **Tests** — the suite enforces **exactly one `<h1>` per route page** and runs
   an **axe** pass per page; make sure the new page renders one h1 and is
   accessible. Add a render test if the page has logic.

7. **Verify** — delegate to the `gate-runner` subagent, or run: `npm run lint`,
   `npx vitest run`, `npm run build`, `npm run bundle:check`. After build,
   confirm `dist/<route>/index.html` has the right meta (or use the
   `prerender-seo-verifier` subagent).

## Don'ts

- Don't edit Navbar/Footer/sitemap directly — they derive from `site.js`.
- Don't add the route to `router.jsx` as an eager element — keep it lazy in
  `routes.js`.
