import { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import { useApp } from '@/app/providers/AppProvider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
// Non-critical overlays: split out of the entry chunk and mounted once the page
// is idle (the ⌘K palette listens globally, the tour only shows first-visit) so
// neither competes with first paint.
const CommandPalette = lazy(() => import('@/shared/ui/CommandPalette'));
const OnboardingTour = lazy(() => import('@/shared/ui/OnboardingTour'));
import BackToTop from '@/shared/ui/BackToTop';
import { DevTweaks } from '@/features/dev-tweaks/DevTweaks';
import VitalsHud from '@/shared/ui/VitalsHud';
import EventsHud from '@/shared/ui/EventsHud';
import { useRoutePrefetch } from '@/app/routePrefetch';

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const sc = document.documentElement;
        const max = sc.scrollHeight - sc.clientHeight;
        setP(max > 0 ? (sc.scrollTop / max) * 100 : 0);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[70] h-[2.5px] pointer-events-none">
      <div
        className="h-full origin-left"
        style={{
          width: `${p}%`,
          background: 'linear-gradient(90deg, var(--ec-cyan, #0EA5E9) 0%, var(--ec-emerald, #10B981) 100%)',
          boxShadow: '0 0 12px rgba(14,165,233,.6)',
          transition: 'width .08s linear',
        }}
      />
    </div>
  );
}

// Reset scroll position on every route change.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Announces the new page to assistive tech on SPA navigation. Screen readers
// don't re-announce on client-side route changes, so we mirror the freshly-set
// document title into a polite live region (after the page's title effect runs).
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setMsg(document.title), 150);
    return () => clearTimeout(id);
  }, [pathname]);
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {msg}
    </div>
  );
}

export default function MainLayout() {
  const { bgColor, t } = useApp();
  const { pathname } = useLocation();
  useRoutePrefetch();
  // Mount the deferred overlays once the page is idle, so their chunks load
  // after first paint instead of competing with it.
  const [overlaysReady, setOverlaysReady] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cic = window.cancelIdleCallback || clearTimeout;
    const id = ric(() => setOverlaysReady(true));
    return () => cic(id);
  }, []);
  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 font-body transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <ScrollToTop />
      <a href="#main" className="skip-link">{t.a11y.skipToContent}</a>
      <RouteAnnouncer />
      <ScrollProgress />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[.18] dark:opacity-[.06] mix-blend-multiply dark:mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.45'/></svg>\")",
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main id="main" className="flex-grow">
          <ErrorBoundary>
            <div key={pathname} className="page-fade">
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>

      {overlaysReady && (
        <Suspense fallback={null}>
          <CommandPalette />
          <OnboardingTour />
        </Suspense>
      )}
      <BackToTop label={t.a11y.backToTop} />
      {import.meta.env.DEV && <DevTweaks />}
      {import.meta.env.DEV && <VitalsHud />}
      {import.meta.env.DEV && <EventsHud />}
      <CookieBanner />
    </div>
  );
}
