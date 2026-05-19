import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useApp } from '@/app/providers/AppProvider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { DevTweaks } from '@/features/dev-tweaks/DevTweaks';

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sc = document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      setP(max > 0 ? (sc.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function MainLayout() {
  const { bgColor } = useApp();
  return (
    <div
      className="min-h-screen text-slate-900 font-body transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <ScrollToTop />
      <ScrollProgress />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.45'/></svg>\")",
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>

      {import.meta.env.DEV && <DevTweaks />}
    </div>
  );
}
