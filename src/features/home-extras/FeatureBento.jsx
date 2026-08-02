import React from 'react';
import { useApp } from '@/app/providers/AppProvider';
import { Reveal } from '@/shared/ui/useReveal';
import { SpotlightCard } from '@/shared/ui/SpotlightCard';
import { AnimatedIcon } from '@/shared/ui/AnimatedIcon';
import { Sparkline } from '@/shared/ui/charts';

const BENTO_ICONS = [
  <g key="globe"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/><ellipse cx="10" cy="10" rx="4" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2 10h16" stroke="currentColor" strokeWidth="1.5"/></g>,
  <g key="cpu"><rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 8h4v4H8z" fill="currentColor"/><path d="M9 2v2M11 2v2M9 16v2M11 16v2M2 9h2M2 11h2M16 9h2M16 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></g>,
  <g key="shield"><path d="M10 2L3 5v6c0 5.55 3.84 10.74 7 12 3.16-1.26 7-6.45 7-12V5l-7-3z" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
];

export function FeatureBento() {
  const { t } = useApp();
  const h = t.home; // Has whyTitle, whyEyebrow, and why[] (3 items)
  
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl mb-12">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-cyan-600 dark:text-cyan-400 mb-3">{h.whyEyebrow}</div>
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-slate-900 dark:text-slate-100">{h.whyTitle}</h2>
          </div>
        </Reveal>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-[280px]">
          {/* Card 1: Large Wide */}
          <Reveal delay={0} className="md:col-span-2">
            <SpotlightCard className="h-full rounded-3xl eco-card p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-6">
                  <AnimatedIcon stagger={120}>
                    <svg viewBox="0 0 20 20" className="h-6 w-6">{BENTO_ICONS[0]}</svg>
                  </AnimatedIcon>
                </span>
                <h3 className="font-display text-[22px] tracking-tight text-slate-900 dark:text-slate-100">{h.why[0].title}</h3>
                <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">{h.why[0].desc}</p>
              </div>
              {/* Abstract network graphic for Card 1 */}
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-700"></div>
              <div className="absolute right-0 bottom-0 w-64 h-48 opacity-20 dark:opacity-30 mask-image-gradient">
                 <div className="w-full h-full border border-cyan-500/30 rounded-tl-[100px]"></div>
                 <div className="absolute bottom-0 right-0 w-48 h-32 border border-cyan-500/40 rounded-tl-[80px]"></div>
                 <div className="absolute bottom-0 right-0 w-32 h-16 border border-cyan-500/50 rounded-tl-[60px]"></div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Card 2: Square */}
          <Reveal delay={100} className="md:col-span-1">
            <SpotlightCard className="h-full rounded-3xl eco-card p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
                  <AnimatedIcon stagger={120}>
                    <svg viewBox="0 0 20 20" className="h-6 w-6">{BENTO_ICONS[1]}</svg>
                  </AnimatedIcon>
                </span>
                <h3 className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100">{h.why[1].title}</h3>
                <p className="mt-3 text-[14.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{h.why[1].desc}</p>
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            </SpotlightCard>
          </Reveal>

          {/* Card 3: Wide Bottom (spans 3) */}
          <Reveal delay={200} className="md:col-span-3">
            <SpotlightCard className="h-full rounded-3xl eco-card p-8 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
              <div className="relative z-10 md:w-1/2">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-6">
                  <AnimatedIcon stagger={120}>
                    <svg viewBox="0 0 20 20" className="h-6 w-6">{BENTO_ICONS[2]}</svg>
                  </AnimatedIcon>
                </span>
                <h3 className="font-display text-[22px] tracking-tight text-slate-900 dark:text-slate-100">{h.why[2].title}</h3>
                <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">{h.why[2].desc}</p>
              </div>
              
              <div className="relative z-10 md:w-1/2 h-full w-full flex items-center justify-center">
                 <div className="w-full max-w-sm rounded-xl border border-slate-900/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[12px] font-mono text-slate-500">Security Scans</span>
                       <span className="text-[12px] font-mono text-emerald-500">0 vulnerabilities</span>
                    </div>
                    <Sparkline data={[5, 4, 6, 2, 8, 3, 4, 1, 3, 2, 5]} color="#6366f1" height={50} width={300} className="w-full h-12" />
                 </div>
              </div>
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 group-hover:opacity-100 opacity-50 transition-all duration-700"></div>
            </SpotlightCard>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
