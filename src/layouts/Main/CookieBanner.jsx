import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useToast } from '@/shared/ui/Toast';

const STORAGE_KEY = 'ecozyon.cookies.ack';

// Lightweight one-time banner. Acknowledgement is persisted in localStorage
// so the banner never appears again. SSR-safe: hidden by default, the
// localStorage check happens in a post-mount effect.
export default function CookieBanner() {
  const { t } = useApp();
  const toast = useToast();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Intentional one-shot post-hydration sync, mirroring AppProvider:
    // initial state stays false so server HTML and the client's first
    // render match; once mounted, we read localStorage and reveal.
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      /* storage unavailable — keep banner hidden */
    }
  }, []);

  const accept = () => {
    try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
    setVisible(false);
    toast({ message: t.cookies.saved, type: 'success' });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-[80] rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/70 dark:border-slate-700/50 ring-1 ring-slate-900/[.08] dark:ring-white/[.06] shadow-[0_20px_60px_-20px_rgba(15,23,42,.35)] p-4 animate-[fadeUp_.32s_ease-out]"
    >
      <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
        {t.cookies.text}
        <Link to="/legal#cookies" className="text-slate-900 dark:text-slate-100 underline underline-offset-2 decoration-emerald-500 decoration-2 hover:decoration-cyan-500">
          {t.cookies.link}
        </Link>
        .
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={accept}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-medium text-white"
          style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
        >
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}
