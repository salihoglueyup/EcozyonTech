import { useEffect } from 'react';
import { ROUTE_LOADERS } from './routes';

// Hover/focus route prefetch: warm a lazy route's JS chunk before the user
// navigates, so the transition resolves instantly. Built from the single
// ROUTE_LOADERS table in router.jsx (one source for routing + prefetch).

// Compile a route path template ('cases/:slug') to a full-path matcher.
function compile(path) {
  return new RegExp('^/' + path.replace(/:[^/]+/g, '[^/]+') + '/?$');
}

const MATCHERS = ROUTE_LOADERS
  .filter((r) => r.path && r.path !== '*')
  .map((r) => ({ re: compile(r.path), load: r.load }));
const HOME = ROUTE_LOADERS.find((r) => r.index);

// Resolve a pathname to its lazy import thunk (or null). Static and `:param`
// routes both match; '*'/NotFound is intentionally never prefetched.
export function findLoader(pathname) {
  if (pathname === '/') return HOME?.load || null;
  for (const m of MATCHERS) if (m.re.test(pathname)) return m.load;
  return null;
}

const warmed = new Set();

// Fire the matching loader at most once per path. Failures un-warm the path so
// a later real navigation can retry.
export function prefetchRoute(pathname) {
  if (typeof pathname !== 'string' || warmed.has(pathname)) return;
  const load = findLoader(pathname);
  if (!load) return;
  warmed.add(pathname);
  Promise.resolve()
    .then(load)
    .catch(() => warmed.delete(pathname));
}

// Delegated listener: prefetch the route behind any internal <a> the user
// hovers or focuses. Honors the data-saver hint and only touches same-origin
// app links. Mount once (in the layout); client-only via useEffect.
export function useRoutePrefetch() {
  useEffect(() => {
    if (navigator.connection?.saveData) return; // respect Save-Data

    const onPoint = (e) => {
      const a = e.target?.closest?.('a[href]');
      if (!a) return;
      try {
        const url = new URL(a.href, window.location.origin);
        if (url.origin === window.location.origin) prefetchRoute(url.pathname);
      } catch {
        /* non-URL href — ignore */
      }
    };

    window.addEventListener('pointerover', onPoint, { passive: true });
    window.addEventListener('focusin', onPoint);
    return () => {
      window.removeEventListener('pointerover', onPoint);
      window.removeEventListener('focusin', onPoint);
    };
  }, []);
}
