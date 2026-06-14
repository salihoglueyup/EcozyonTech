// Single source of truth for routes: path → lazy import thunk. Kept free of any
// component imports (no MainLayout) so both the router and the prefetcher can
// import it without a cycle. React.lazy turns each thunk into the route element
// (router.jsx); the same thunk powers hover/focus prefetch (routePrefetch.js),
// so warming a chunk before navigation makes the later transition instant.
// `index: true` is the home route; `*` is NotFound (never prefetched).
export const ROUTE_LOADERS = [
  { index: true, load: () => import('@/pages/Home') },
  { path: 'services', load: () => import('@/pages/Services') },
  { path: 'pricing', load: () => import('@/pages/Pricing') },
  { path: 'impact', load: () => import('@/pages/Impact') },
  { path: 'cases', load: () => import('@/pages/Cases') },
  { path: 'cases/:slug', load: () => import('@/pages/CaseStudy') },
  { path: 'help', load: () => import('@/pages/Help') },
  { path: 'changelog', load: () => import('@/pages/Changelog') },
  { path: 'status', load: () => import('@/pages/Status') },
  { path: 'press', load: () => import('@/pages/Press') },
  { path: 'resources', load: () => import('@/pages/Resources') },
  { path: 'styleguide', load: () => import('@/pages/Styleguide') },
  { path: 'search', load: () => import('@/pages/Search') },
  { path: 'integrations', load: () => import('@/pages/Integrations') },
  { path: 'integrations/:slug', load: () => import('@/pages/Integration') },
  { path: 'glossary', load: () => import('@/pages/Glossary') },
  { path: 'roi', load: () => import('@/pages/Roi') },
  { path: 'developers', load: () => import('@/pages/Developers') },
  { path: 'leaderboard', load: () => import('@/pages/Leaderboard') },
  { path: 'compare', load: () => import('@/pages/Compare') },
  { path: 'sitemap', load: () => import('@/pages/Sitemap') },
  { path: 'accessibility', load: () => import('@/pages/Accessibility') },
  { path: 'about', load: () => import('@/pages/About') },
  { path: 'blog', load: () => import('@/pages/Blog') },
  { path: 'blog/tag/:tag', load: () => import('@/pages/BlogTag') },
  { path: 'blog/:slug', load: () => import('@/pages/BlogPost') },
  { path: 'careers', load: () => import('@/pages/Careers') },
  { path: 'contact', load: () => import('@/pages/Contact') },
  { path: 'legal', load: () => import('@/pages/Legal') },
  { path: '*', load: () => import('@/pages/NotFound') },
];
