import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/Main';

const HomePage = lazy(() => import('@/pages/Home'));
const ServicesPage = lazy(() => import('@/pages/Services'));
const ImpactPage = lazy(() => import('@/pages/Impact'));
const AboutPage = lazy(() => import('@/pages/About'));
const ContactPage = lazy(() => import('@/pages/Contact'));
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

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="services"
          element={
            <Suspense fallback={<PageFallback />}>
              <ServicesPage />
            </Suspense>
          }
        />
        <Route
          path="impact"
          element={
            <Suspense fallback={<PageFallback />}>
              <ImpactPage />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<PageFallback />}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<PageFallback />}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
