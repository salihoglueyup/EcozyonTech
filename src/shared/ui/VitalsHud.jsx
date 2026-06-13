import { useEffect, useState } from 'react';
import { onVitalsReport } from '@/core/lib/vitals';

// Dev-only Core Web Vitals overlay. Subscribes to the vitals reporter and
// shows each metric's latest value + rating, so performance is visible while
// iterating. Mounted only under import.meta.env.DEV — never ships.

const ORDER = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'];
const RATING_COLOR = {
  good: '#10B981',
  'needs-improvement': '#F59E0B',
  poor: '#EF4444',
};

// CLS is unitless (3 decimals); the rest are milliseconds.
const fmt = (m) => (m.name === 'CLS' ? m.value.toFixed(3) : `${Math.round(m.value)}ms`);

export default function VitalsHud() {
  const [metrics, setMetrics] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => onVitalsReport((m) => setMetrics((prev) => ({ ...prev, [m.name]: m }))), []);

  const reported = ORDER.filter((name) => metrics[name]);

  return (
    <div className="fixed bottom-3 left-3 z-[130] font-mono text-[11px] select-none">
      {open ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/90 text-slate-200 backdrop-blur-xl shadow-2xl p-2.5 min-w-[156px]">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="uppercase tracking-[.12em] text-[9.5px] text-slate-400">Web Vitals</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close vitals" className="text-slate-400 hover:text-white">×</button>
          </div>
          {reported.length === 0 ? (
            <div className="text-slate-500 py-1">collecting…</div>
          ) : (
            <ul className="space-y-1">
              {reported.map((name) => {
                const m = metrics[name];
                return (
                  <li key={name} className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">{name}</span>
                    <span className="tabular-nums" style={{ color: RATING_COLOR[m.rating] || '#94A3B8' }}>{fmt(m)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/10 bg-slate-900/85 text-slate-300 backdrop-blur px-2.5 py-1 shadow-lg hover:text-white"
          title="Web Vitals"
        >
          ⚡{reported.length ? ` ${reported.length}` : ''}
        </button>
      )}
    </div>
  );
}
