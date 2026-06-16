import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/core/motion';

// Floating "scroll to top" button. Appears past a scroll threshold; smooth
// scroll degrades to instant under prefers-reduced-motion.
export default function BackToTop({ label, threshold = 600 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  if (!show) return null;

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={label}
      className="fixed bottom-5 right-5 z-[80] inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl ring-1 ring-slate-900/[.1] dark:ring-white/[.1] text-slate-700 dark:text-slate-300 shadow-[0_8px_28px_-12px_rgba(15,23,42,.4)] hover:text-slate-900 dark:hover:text-white hover:ring-cyan-500/30 transition animate-enter"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M8 13V4m-4 4 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
