import { useId, useState } from 'react';
import { Tag } from '@/shared/ui/primitives';
import { estimateAnnualCO2, potentialSavings, formatCO2 } from '@/core/lib/co2';

const SLIDERS = [
  { key: 'carKmPerWeek', labelKey: 'car', unitKey: 'carUnit', max: 600, step: 10, color: '#0EA5E9' },
  { key: 'kwhPerMonth', labelKey: 'energy', unitKey: 'energyUnit', max: 800, step: 10, color: '#10B981' },
  { key: 'meatMealsPerWeek', labelKey: 'diet', unitKey: 'dietUnit', max: 21, step: 1, color: '#F59E0B' },
];

export function Calculator({ t }) {
  const c = t.calc;
  const [vals, setVals] = useState({ carKmPerWeek: 120, kwhPerMonth: 220, meatMealsPerWeek: 7 });
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
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-8">
          <Tag color="cyan">// {c.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.06] tracking-[-0.02em] text-slate-900">
            {c.title}
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-2xl">{c.sub}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.05] p-6 lg:p-7 space-y-6">
            {SLIDERS.map((s) => {
              const id = `${baseId}-${s.key}`;
              return (
                <div key={s.key}>
                  <div className="flex items-baseline justify-between mb-2">
                    <label htmlFor={id} className="text-[13px] font-medium text-slate-700">{c[s.labelKey]}</label>
                    <span className="font-mono text-[13px] text-slate-900 tabular-nums">
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
              <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">{c.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
