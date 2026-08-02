// Single source of truth for routes: path → lazy import thunk. Kept free of any
// component imports (no MainLayout) so both the router and the prefetcher can
// import it without a cycle. React.lazy turns each thunk into the route element
// (router.jsx); the same thunk powers hover/focus prefetch (routePrefetch.js),
// so warming a chunk before navigation makes the later transition instant.
// `index: true` is the home route; `*` is NotFound (never prefetched).
export const ROUTE_LOADERS = [
  { index: true, load: () => import('@/pages/Home') },
  { path: 'services', load: () => import('@/pages/Services') },
  { path: 'impact', load: () => import('@/pages/Impact') },
  { path: 'cases', load: () => import('@/pages/Cases') },
  { path: 'cases/:slug', load: () => import('@/pages/CaseStudy') },
  { path: 'help', load: () => import('@/pages/Help') },
  { path: 'changelog', load: () => import('@/pages/Changelog') },
  { path: 'press', load: () => import('@/pages/Press') },
  { path: 'styleguide', load: () => import('@/pages/Styleguide') },
  { path: 'search', load: () => import('@/pages/Search') },
  { path: 'glossary', load: () => import('@/pages/Glossary') },
  { path: 'roi', load: () => import('@/pages/Roi') },
  { path: 'assessment', load: () => import('@/pages/Assessment') },
  { path: 'developers', load: () => import('@/pages/Developers') },
  { path: 'sitemap', load: () => import('@/pages/Sitemap') },
  { path: 'accessibility', load: () => import('@/pages/Accessibility') },
  { path: 'about', load: () => import('@/pages/About') },
  { path: 'blog', load: () => import('@/pages/Blog') },
  { path: 'blog/tag/:tag', load: () => import('@/pages/BlogTag') },
  { path: 'blog/:slug', load: () => import('@/pages/BlogPost') },
  { path: 'careers', load: () => import('@/pages/Careers') },
  { path: 'contact', load: () => import('@/pages/Contact') },
  { path: 'legal', load: () => import('@/pages/Legal') },
  // Admin CMS — intentionally NOT in ROUTES (site.js): reachable + client-routed
  // but never prerendered, never in the sitemap/nav, and robots-disallowed. Its
  // own lazy chunk keeps the editor + auth UI out of the public entry bundle.
  { path: 'admin', load: () => import('@/pages/Admin') },
  { path: '*', load: () => import('@/pages/NotFound') },
];
