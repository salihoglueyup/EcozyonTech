import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useApp } from '@/app/providers/AppProvider';
import { useFocusTrap } from '@/shared/ui/useFocusTrap';
import { TOUR_KEY, shouldShowTour, clampStep, isLastStep } from '@/core/lib/onboarding';

// First-visit onboarding tour: a focus-trapped, keyboard-navigable step dialog
// that introduces the most useful features. Auto-opens once for new visitors
// (gated by localStorage) and can be reopened via the `ecozyon:tour` event.
// Renders nothing on the server / until opened, so it adds nothing to the
// prerendered HTML.
export default function OnboardingTour() {
  const { t } = useApp();
  const tour = t.tour;
  const steps = tour.steps;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const dialogRef = useRef(null);
  const titleId = useId();
  useFocusTrap(dialogRef, open);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(TOUR_KEY, 'done');
    } catch {
      /* private mode — non-fatal */
    }
    setOpen(false);
  }, []);

  // Auto-open once for first-time visitors, shortly after load. Suppressed for
  // automation (navigator.webdriver) so it never blocks e2e flows.
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;
    let stored = null;
    try {
      stored = localStorage.getItem(TOUR_KEY);
    } catch {
      /* ignore */
    }
    if (!shouldShowTour(stored)) return;
    const id = setTimeout(() => {
      setStep(0);
      setOpen(true);
    }, 1200);
    return () => clearTimeout(id);
  }, []);

  // Reopen on demand (e.g. from a help/sitemap link firing the event).
  useEffect(() => {
    const onOpen = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener('ecozyon:tour', onOpen);
    return () => window.removeEventListener('ecozyon:tour', onOpen);
  }, []);

  if (!open) return null;
  const last = isLastStep(step, steps.length);
  const s = steps[step];
  const go = (delta) => setStep((x) => clampStep(x + delta, steps.length));

  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      finish();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      last ? finish() : go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div className="fixed inset-0 z-[125] flex items-end sm:items-center justify-center p-4" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={finish} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-sm rounded-2xl border border-white/70 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-[0_40px_120px_-30px_rgba(15,23,42,.55)] p-6 animate-enter"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-cyan-600 dark:text-cyan-400">
            {tour.badge.replace('{n}', step + 1).replace('{total}', steps.length)}
          </span>
          <button type="button" onClick={finish} className="text-[12px] text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
            {tour.skip}
          </button>
        </div>

        <h2 id={titleId} className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100">{s.title}</h2>
        <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>

        <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
          {steps.map((_, idx) => (
            <span key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-5 bg-cyan-500' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={step === 0}
            className="eco-press text-[13px] font-medium text-slate-600 dark:text-slate-300 disabled:opacity-0 transition"
          >
            {tour.back}
          </button>
          <button
            type="button"
            onClick={() => (last ? finish() : go(1))}
            className="eco-press inline-flex items-center gap-1.5 rounded-full bg-slate-900 dark:bg-white px-5 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            {last ? tour.finish : tour.next}
          </button>
        </div>
      </div>
    </div>
  );
}
