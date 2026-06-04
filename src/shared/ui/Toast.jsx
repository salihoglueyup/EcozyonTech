import { createContext, useCallback, useContext, useRef, useState } from 'react';

// ── Context ────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    ({ message, type = 'info', duration = 4000 }) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ── Render ──────────────────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="8" r="6" />
      <path d="M5.5 8.5 7 10l3.5-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="8" r="6" />
      <path d="M10 6 6 10M6 6l4 4" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7v4M8 5.5v.01" strokeLinecap="round" />
    </svg>
  ),
};

const TYPE_STYLES = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-rose-600 dark:text-rose-400',
  info: 'text-cyan-600 dark:text-cyan-400',
};

function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[100] flex flex-col-reverse gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/70 dark:border-slate-700/50 ring-1 ring-slate-900/[.08] dark:ring-white/[.06] shadow-[0_16px_50px_-20px_rgba(15,23,42,.4)] p-4 animate-[fadeUp_.28s_ease-out]"
        >
          <span className={`mt-0.5 shrink-0 ${TYPE_STYLES[t.type] || TYPE_STYLES.info}`}>
            {ICONS[t.type] || ICONS.info}
          </span>
          <span className="flex-1 text-[13px] text-slate-800 dark:text-slate-200 leading-snug">
            {t.message}
          </span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="shrink-0 h-5 w-5 rounded-full grid place-items-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
