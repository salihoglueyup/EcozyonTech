import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/Main';
import { Skeleton, CardSkeleton } from '@/shared/ui/Skeleton';

const HomePage = lazy(() => import('@/pages/Home'));
const ServicesPage = lazy(() => import('@/pages/Services'));
const PricingPage = lazy(() => import('@/pages/Pricing'));
const ImpactPage = lazy(() => import('@/pages/Impact'));
const CasesPage = lazy(() => import('@/pages/Cases'));
const CaseStudyPage = lazy(() => import('@/pages/CaseStudy'));
const HelpPage = lazy(() => import('@/pages/Help'));
const ChangelogPage = lazy(() => import('@/pages/Changelog'));
const StatusPage = lazy(() => import('@/pages/Status'));
const PressPage = lazy(() => import('@/pages/Press'));
const ResourcesPage = lazy(() => import('@/pages/Resources'));
const StyleguidePage = lazy(() => import('@/pages/Styleguide'));
const SearchPage = lazy(() => import('@/pages/Search'));
const IntegrationsPage = lazy(() => import('@/pages/Integrations'));
const IntegrationPage = lazy(() => import('@/pages/Integration'));
const GlossaryPage = lazy(() => import('@/pages/Glossary'));
const AboutPage = lazy(() => import('@/pages/About'));
const BlogPage = lazy(() => import('@/pages/Blog'));
const BlogPostPage = lazy(() => import('@/pages/BlogPost'));
const CareersPage = lazy(() => import('@/pages/Careers'));
const ContactPage = lazy(() => import('@/pages/Contact'));
const LegalPage = lazy(() => import('@/pages/Legal'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

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

// path → element. `index: true` for the home route.
const ROUTE_ELEMENTS = [
  { index: true, el: <HomePage /> },
  { path: 'services', el: <ServicesPage /> },
  { path: 'pricing', el: <PricingPage /> },
  { path: 'impact', el: <ImpactPage /> },
  { path: 'cases', el: <CasesPage /> },
  { path: 'cases/:slug', el: <CaseStudyPage /> },
  { path: 'help', el: <HelpPage /> },
  { path: 'changelog', el: <ChangelogPage /> },
  { path: 'status', el: <StatusPage /> },
  { path: 'press', el: <PressPage /> },
  { path: 'resources', el: <ResourcesPage /> },
  { path: 'styleguide', el: <StyleguidePage /> },
  { path: 'search', el: <SearchPage /> },
  { path: 'integrations', el: <IntegrationsPage /> },
  { path: 'integrations/:slug', el: <IntegrationPage /> },
  { path: 'glossary', el: <GlossaryPage /> },
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
