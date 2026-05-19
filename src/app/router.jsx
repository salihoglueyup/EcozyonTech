import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/Main';

const HomePage = lazy(() => import('@/pages/Home'));
const ServicesPage = lazy(() => import('@/pages/Services'));
const PricingPage = lazy(() => import('@/pages/Pricing'));
const ImpactPage = lazy(() => import('@/pages/Impact'));
const AboutPage = lazy(() => import('@/pages/About'));
const BlogPage = lazy(() => import('@/pages/Blog'));
const BlogPostPage = lazy(() => import('@/pages/BlogPost'));
const CareersPage = lazy(() => import('@/pages/Careers'));
const ContactPage = lazy(() => import('@/pages/Contact'));
const LegalPage = lazy(() => import('@/pages/Legal'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-slate-400 text-[13px]">
      <span className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Yükleniyor…
      </span>
    </div>
  );
}

// path → element. `index: true` for the home route.
const ROUTE_ELEMENTS = [
  { index: true, el: <HomePage /> },
  { path: 'services', el: <ServicesPage /> },
  { path: 'pricing', el: <PricingPage /> },
  { path: 'impact', el: <ImpactPage /> },
  { path: 'about', el: <AboutPage /> },
  { path: 'blog', el: <BlogPage /> },
  { path: 'blog/:slug', el: <BlogPostPage /> },
  { path: 'careers', el: <CareersPage /> },
  { path: 'contact', el: <ContactPage /> },
  { path: 'legal', el: <LegalPage /> },
  { path: '*', el: <NotFoundPage /> },
];

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {ROUTE_ELEMENTS.map(({ index, path, el }) => (
          <Route
            key={path || 'index'}
            index={index}
            path={path}
            element={<Suspense fallback={<PageFallback />}>{el}</Suspense>}
          />
        ))}
      </Route>
    </Routes>
  );
}
