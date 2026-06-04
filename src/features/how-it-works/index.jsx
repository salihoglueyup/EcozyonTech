import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';

// ────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS — 3-step flow
// ────────────────────────────────────────────────────────────────────────────
export function HowItWorks({ t, lang }) {
  const h = t.howItWorks;
  return (
    <section id="how" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-900/[.08] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <Reveal>
          <Tag color="emerald">// 02 · {h.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {h.title}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)" }}>
              {h.titleAccent}
            </span>
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{h.sub}</p>
          </Reveal>
        </div>

        {/* Stepper */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Connector dotted line (desktop only) */}
          <svg aria-hidden className="hidden lg:block absolute top-[88px] left-[12%] right-[12%] h-2 z-0 pointer-events-none" viewBox="0 0 1000 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="1000" y2="4" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 5" opacity=".35" />
            <circle cx="0" cy="4" r="3" fill="#0EA5E9" />
            <circle cx="500" cy="4" r="3" fill="#10B981" />
            <circle cx="1000" cy="4" r="3" fill="#10B981" />
          </svg>

          {h.steps.map((s, i) => (
            <StepCard key={i} step={s} idx={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 lg:mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-7 lg:p-9 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 50%, rgba(14,165,233,.4), transparent 45%), radial-gradient(circle at 80% 50%, rgba(16,185,129,.4), transparent 45%)" }} />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight tracking-tight">
                {lang === "tr"
                  ? "İlk pilot grubuna katıl, ücretsiz kullan."
                  : "Join the first pilot, free of charge."}
              </div>
              <div className="mt-2 text-[13.5px] text-slate-300">
                {lang === "tr"
                  ? "Erken kullanıcılarımıza özel cihaz + 12 ay Pro abonelik."
                  : "Free hardware + 12-month Pro plan for early users."}
              </div>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 dark:text-slate-100 text-[13.5px] font-medium px-5 py-3 hover:bg-slate-100 transition self-start">
              {h.cta}
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, idx }) {
  const ref = useRef();
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const accents = ["#0EA5E9", "#10B981", "#10B981"];
  const accent = accents[idx];

  return (
    <div
      ref={ref}
      className={`relative z-10 rounded-3xl border border-white/70 dark:border-white/[.08] bg-white/75 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-6 lg:p-7 transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${idx * 120}ms` }}
    >
      {/* Step number badge */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white font-display text-[18px] tracking-tight"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 12px 32px -16px ${accent}aa` }}
        >
          {step.n}
          <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full ring-2 ring-white" style={{ backgroundColor: accent }}>
            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: accent }} />
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/[.04] px-2.5 py-1 text-[10.5px] text-slate-600 dark:text-slate-400 font-mono">
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5" /><path d="M7 4v3.5L9 9" strokeLinecap="round" /></svg>
          {step.time}
        </span>
      </div>

      <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold mb-1" style={{ color: accent }}>{step.tag}</div>
      <h3 className="font-display text-[22px] lg:text-[24px] tracking-tight text-slate-900 dark:text-slate-100 leading-tight">{step.title}</h3>
      <p className="mt-2.5 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>

      <ul className="mt-5 space-y-2">
        {step.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-700 dark:text-slate-300">
            <svg className="mt-0.5 h-4 w-4 flex-none" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke={accent} strokeOpacity=".25" />
              <path d="M5 8l2 2 4-4" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Decorative inline visual */}
      <div className="mt-6 -mx-2 px-2 pt-4 border-t border-slate-900/[.06]">
        <StepVisual idx={idx} accent={accent} />
      </div>
    </div>
  );
}

// Tiny per-step micro-illustration
function StepVisual({ idx, accent }) {
  if (idx === 0) {
    // Connect — pairing dots
    return (
      <div className="relative h-14">
        <svg viewBox="0 0 240 60" className="absolute inset-0 w-full h-full">
          <g>
            <rect x="14" y="20" width="36" height="22" rx="6" fill={accent} opacity=".12" />
            <rect x="14" y="20" width="36" height="22" rx="6" fill="none" stroke={accent} strokeWidth="1.2" />
            <circle cx="32" cy="31" r="2.5" fill={accent} />
          </g>
          <line x1="56" y1="31" x2="180" y2="31" stroke={accent} strokeWidth="1.2" strokeDasharray="3 4" />
          {[70, 100, 130, 160].map((x, i) => (
            <circle key={i} cx={x} cy="31" r="2" fill={accent}>
              <animate attributeName="opacity" values="0;1;0" dur="1.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <g>
            <circle cx="200" cy="31" r="14" fill={accent} opacity=".12" />
            <circle cx="200" cy="31" r="9" fill={accent} opacity=".25" />
            <circle cx="200" cy="31" r="5" fill={accent} />
            <path d="M198 31l1.5 1.5L203 29" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>
    );
  }
  if (idx === 1) {
    // Collect — sparkline + sensors
    return (
      <div className="relative h-14">
        <svg viewBox="0 0 240 60" className="absolute inset-0 w-full h-full">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={10 + i * 16} y={48} width="9" height={[18, 28, 14][i]} rx="2" fill={accent} opacity=".4" />
              <rect x={10 + i * 16} y={48 - [18, 28, 14][i]} width="9" height="3" rx="1.5" fill={accent} />
            </g>
          ))}
          <path d="M70 40 L92 32 L112 36 L132 22 L154 28 L176 14 L200 20 L222 10" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M70 40 L92 32 L112 36 L132 22 L154 28 L176 14 L200 20 L222 10 L222 56 L70 56 Z" fill={accent} opacity=".12" />
          <circle cx="222" cy="10" r="3" fill={accent}>
            <animate attributeName="r" values="2;4;2" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    );
  }
  // Act — suggestion chip + applied state
  return (
    <div className="flex items-center gap-2 h-14">
      <div className="flex-1 rounded-xl px-3 py-2 text-[11px]" style={{ backgroundColor: `${accent}15`, color: accent }}>
        <span className="font-mono uppercase tracking-wide opacity-70">tip</span>{" "}
        <span className="text-slate-700 dark:text-slate-300">Bisikletle git → -1.4 kg</span>
      </div>
      <button className="rounded-full text-white text-[11px] font-semibold px-3 py-2 shadow-sm" style={{ backgroundColor: accent }}>
        ✓ Apply
      </button>
    </div>
  );
}
