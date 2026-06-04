import React, { useState, useEffect, useRef } from 'react';
import { Tag } from '@/shared/ui/primitives';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Reveal } from '@/shared/ui/useReveal';

// ── Metrics ────────────────────────────────────────────────────────────────
export function Metrics({ t }) {
  return (
    <section id="metrics" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <Tag color="cyan">// 01 · Impact</Tag>
            <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100 max-w-xl">
              {t.metrics.title}
            </h2>
          </div>
          <p className="max-w-md text-[14.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{t.metrics.sub}</p>
        </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {t.metrics.items.map((m, i) => <MetricCard key={i} m={m} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ m, idx }) {
  const [seen, setSeen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const accentColors = ["#0EA5E9", "#10B981", "#10B981", "#7C3AED"];
  const accent = accentColors[idx % accentColors.length];

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/60 dark:bg-white/[.04] backdrop-blur-xl p-6 ring-1 ring-slate-900/[.04] dark:ring-white/[.06] hover:ring-cyan-500/30 transition"
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition" style={{ background: `radial-gradient(circle, ${accent}60, transparent)` }} />

      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
          0{idx + 1}
        </div>
        {m.trend && <MetricSparkline data={m.trend} color={accent} />}
      </div>

      <div className={`mt-4 font-display text-[44px] leading-none tracking-[-0.03em] text-slate-900 dark:text-slate-100 transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <AnimatedNumber value={m.value} play={seen} />
        <span style={{ color: accent }}>{m.suffix}</span>
      </div>
      <div className="mt-2 text-[14px] text-slate-800 dark:text-slate-200 font-medium">{m.label}</div>
      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 leading-snug">{m.note}</div>

      {(m.delta || m.compare) && (
        <div className="mt-4 pt-3 border-t border-slate-900/[.05] dark:border-white/[.06] flex items-center justify-between text-[11px] gap-2">
          {m.delta && (
            <span className="inline-flex items-center gap-1 font-mono" style={{ color: accent }}>
              <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="currentColor"><path d="M5 2l4 5H1z" /></svg>
              {m.delta}
            </span>
          )}
          {m.compare && (
            <span className="text-slate-500 font-mono text-right">{m.compare}</span>
          )}
        </div>
      )}
    </div>
  );
}

function MetricSparkline({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const W = 64, H = 22;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / Math.max(max - min, 0.0001)) * H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-6 w-16 flex-none">
      <defs>
        <linearGradient id={`ms-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={`url(#ms-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={W} cy={H - ((data[data.length - 1] - min) / Math.max(max - min, 0.0001)) * H} r="1.6" fill={color} />
    </svg>
  );
}
