import { useEffect, useId } from 'react';
import { Tag } from '@/shared/ui/primitives';
import { estimateAnnualCO2, potentialSavings, formatCO2 } from '@/core/lib/co2';
import { CALC_FIELDS, DEFAULT_CALC, CALC_PRESETS, encodeCalc, decodeCalc, normalizeCalc, applyPreset, presetSaving } from '@/core/lib/calcShare';
import { usePersistentState } from '@/shared/ui/usePersistentState';
import { useToast } from '@/shared/ui/Toast';
import { Reveal } from '@/shared/ui/useReveal';

// Presentation per field (labels/units/color); the numeric model — keys,
// defaults and bounds — lives in calcShare so the URL and sliders never drift.
const SLIDER_UI = {
  carKmPerWeek: { labelKey: 'car', unitKey: 'carUnit', color: '#0EA5E9' },
  kwhPerMonth: { labelKey: 'energy', unitKey: 'energyUnit', color: '#10B981' },
  meatMealsPerWeek: { labelKey: 'diet', unitKey: 'dietUnit', color: '#F59E0B' },
};
const SLIDERS = CALC_FIELDS.map((f) => ({ ...f, ...SLIDER_UI[f.key] }));

export function Calculator({ t }) {
  const c = t.calc;
  const toast = useToast();
  // Last inputs persist across visits; a shared ?car=&kwh=&meat= link wins on
  // first load (applied post-mount so prerendered HTML stays deterministic).
  const [vals, setVals] = usePersistentState('ecozyon.calc', DEFAULT_CALC);
  useEffect(() => {
    const fromUrl = typeof window !== 'undefined' && decodeCalc(window.location.search);
    if (fromUrl) setVals(normalizeCalc(fromUrl));
    // Run once on mount; the deep link is read a single time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const share = async () => {
    if (typeof window === 'undefined') return;
    const { origin, pathname } = window.location;
    const url = `${origin}${pathname}?${encodeCalc(vals)}#calculator`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ message: c.shareCopied, type: 'success' });
    } catch {
      toast({ message: c.shareError, type: 'error' });
    }
  };

  const est = estimateAnnualCO2(vals);
  const saved = potentialSavings(est.total);
  const baseId = useId();

  const bar = [
    { v: est.transport, color: '#0EA5E9' },
    { v: est.energy, color: '#10B981' },
    { v: est.diet, color: '#F59E0B' },
  ];
  const max = Math.max(est.total, 1);

  return (
    <section id="calculator" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-8">
          <Reveal>
          <Tag color="cyan">// {c.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.06] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {c.title}
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{c.sub}</p>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-3xl eco-card p-6 lg:p-7 space-y-6">
            {SLIDERS.map((s) => {
              const id = `${baseId}-${s.key}`;
              return (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between mb-2">
                    <label htmlFor={id} className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{c[s.labelKey]}</label>
                    <span className="font-mono text-[13px] text-slate-900 dark:text-slate-100 tabular-nums">
                      {vals[s.key]} <span className="text-slate-400">{c[s.unitKey]}</span>
                    </span>
                  </div>
                  <input
                    id={id}
                    type="range"
                    min={0}
                    max={s.max}
                    step={s.step}
                    value={vals[s.key]}
                    onChange={(e) => setVals((v) => ({ ...v, [s.key]: Number(e.target.value) }))}
                    className="w-full accent-cyan-600 cursor-pointer"
                    style={{ accentColor: s.color }}
                  />
                </div>
              );
            })}

            {/* Quick scenarios — each applies a transform of the current
                inputs; the badge shows what it would cut from them now. */}
            <div className="pt-2 border-t border-slate-900/[.06] dark:border-white/[.06]">
              <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-2.5">
                {c.presetsTitle}
              </div>
              <div className="flex flex-wrap gap-2">
                {CALC_PRESETS.map((p) => {
                  const { pct } = presetSaving(p, vals);
                  const shown = Math.round(pct * 100);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setVals(applyPreset(p, vals))}
                      className="group inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/[.05] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] pl-3 pr-2 py-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:ring-cyan-500/40 hover:text-slate-900 dark:hover:text-slate-100 transition"
                    >
                      {c.presets[p.id]}
                      <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${shown > 0 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                        {shown > 0 ? `−${shown}%` : '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 lg:p-7 flex flex-col">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-cyan-300/80">{c.total}</div>
            <div className="mt-1 font-display text-[44px] leading-none tracking-[-0.03em] tabular-nums" aria-live="polite">
              {formatCO2(est.total)}
              <span className="text-[16px] text-slate-400 font-body"> CO₂e</span>
            </div>

            {/* Stacked breakdown bar */}
            <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              {bar.map((b, i) => (
                <div key={i} style={{ width: `${(b.v / max) * 100}%`, backgroundColor: b.color }} />
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl bg-white/[.06] ring-1 ring-white/10 px-4 py-3">
                <div className="text-[11px] text-slate-300">{c.savingsNote}</div>
                <div className="mt-0.5 font-display text-[26px] tracking-tight text-emerald-300 tabular-nums">
                  −{formatCO2(saved)}
                </div>
              </div>
              <button
                type="button"
                onClick={share}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[.08] ring-1 ring-white/15 px-4 h-9 text-[12.5px] font-medium text-white hover:bg-white/[.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="3.5" r="2" /><circle cx="4" cy="8" r="2" /><circle cx="12" cy="12.5" r="2" />
                  <path d="M5.7 7 10.3 4.5M5.7 9l4.6 2.5" strokeLinecap="round" />
                </svg>
                {c.share}
              </button>
              <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}