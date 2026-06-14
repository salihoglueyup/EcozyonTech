import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/Main';
import { Skeleton, CardSkeleton } from '@/shared/ui/Skeleton';
import { ROUTE_LOADERS } from './routes';

// Build the lazy components once at module load (stable references across
// renders — never re-create lazy() inside the component).
const ROUTE_ELEMENTS = ROUTE_LOADERS.map((r) => ({ ...r, Comp: lazy(r.load) }));

// Structural skeleton shown while a lazy route chunk loads — mirrors the
// typical page shape (eyebrow + heading + intro, then a card grid) so the
// layout doesn't jump when the real content swaps in.
function PageFallback() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28" aria-busy="true" aria-label="Yükleniyor">
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {ROUTE_ELEMENTS.map(({ index, path, Comp }) => (
          <Route
            key={path || 'index'}
            index={index}
            path={path}
            element={
              <Suspense fallback={<PageFallback />}>
                <Comp />
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}
