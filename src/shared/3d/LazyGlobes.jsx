import { lazy, Suspense } from 'react';

// Defer Three.js: these dynamic imports become their own chunk and only
// download when a globe actually renders.
const EcoGlobeInner = lazy(() =>
  import('./EcoGlobe').then((m) => ({ default: m.EcoGlobe })),
);
const WorldGlobeInner = lazy(() =>
  import('./WorldGlobe').then((m) => ({ default: m.WorldGlobe })),
);

function GlobeFallback() {
  return (
    <div className="grid place-items-center h-full w-full text-slate-400 text-[12px]">
      <span className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Loading globe…
      </span>
    </div>
  );
}

export function EcoGlobe(props) {
  return (
    <Suspense fallback={<GlobeFallback />}>
      <EcoGlobeInner {...props} />
    </Suspense>
  );
}

export function WorldGlobe(props) {
  return (
    <Suspense fallback={<GlobeFallback />}>
      <WorldGlobeInner {...props} />
    </Suspense>
  );
}
