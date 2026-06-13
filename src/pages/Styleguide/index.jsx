import { useState } from 'react';
import { Tag, GlowOrb } from '@/shared/ui/primitives';
import { Reveal, useReveal } from '@/shared/ui/useReveal';
import { SectionNav } from '@/shared/ui/SectionNav';
import { Skeleton, CardSkeleton } from '@/shared/ui/Skeleton';
import { Tabs } from '@/shared/ui/Tabs';
import { Tooltip } from '@/shared/ui/Tooltip';
import { useToast } from '@/shared/ui/Toast';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Sparkline, BarMini, Donut } from '@/shared/ui/charts';
import {
  useApp,
  ACCENT_PALETTES,
  FONT_OPTIONS_DISPLAY,
  FONT_OPTIONS_BODY,
} from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { SECTIONS } from './sections';

const meta = routeByKey('styleguide');

// Fixed semantic colors used across the app (accent-independent).
const SEMANTIC = [
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Cyan', hex: '#0EA5E9' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Slate 900', hex: '#0F172A' },
  { name: 'Slate 400', hex: '#94A3B8' },
];

// A labelled color swatch.
function Swatch({ hex, name }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-9 w-9 rounded-lg ring-1 ring-black/[.08] dark:ring-white/[.12]" style={{ backgroundColor: hex }} aria-hidden="true" />
      <div className="leading-tight">
        <div className="text-[12.5px] font-medium text-slate-900 dark:text-slate-100">{name}</div>
        <div className="text-[11px] tabular-nums text-slate-400">{hex}</div>
      </div>
    </div>
  );
}

// Section wrapper: anchor id + heading + optional description.
function Section({ id, title, desc, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-slate-900/[.06] dark:border-white/[.06] pt-10">
      <Reveal>
        <h2 className="font-display text-[22px] tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
        {desc && <p className="mt-1 text-[13.5px] text-slate-500 dark:text-slate-400">{desc}</p>}
        <div className="mt-6">{children}</div>
      </Reveal>
    </section>
  );
}

// Small group label inside a section.
function GroupLabel({ children }) {
  return <div className="mb-3 text-[11px] uppercase tracking-[.14em] font-semibold text-slate-400">{children}</div>;
}

export default function StyleguidePage() {
  const { lang, t, accents } = useApp();
  const tr = lang === 'tr';
  const g = t.styleguide;
  const sc = g.sections;
  useDocumentMeta(meta.title[lang], g.intro);

  const navSections = SECTIONS.map((s) => ({ id: s.id, label: s.label[lang] }));

  // Interactive demo state.
  const [tab, setTab] = useState('overview');
  const toast = useToast();
  const [numRef, numIn] = useReveal();
  const [replayKey, setReplayKey] = useState(0);

  const demoTabs = [
    { id: 'overview', label: tr ? 'Genel' : 'Overview' },
    { id: 'specs', label: tr ? 'Özellikler' : 'Specs' },
    { id: 'activity', label: tr ? 'Etkinlik' : 'Activity' },
  ];

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <SectionNav sections={navSections} />
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="cyan">// {g.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {g.title}
            <span className="eco-gradient-text">
              {g.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{g.intro}</p>
        </div>

        <div className="space-y-12">
          {/* Colors */}
          <Section id="colors" title={sc.colors.title} desc={sc.colors.desc}>
            <GroupLabel>{g.palettes}</GroupLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(ACCENT_PALETTES).map(([key, pal]) => (
                <div key={key} className="rounded-xl eco-card p-4">
                  <div className="mb-2.5 text-[12px] font-medium text-slate-700 dark:text-slate-300">{key}</div>
                  <div className="flex gap-4">
                    <Swatch hex={pal.cyan} name="cyan" />
                    <Swatch hex={pal.emerald} name="emerald" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <GroupLabel>{g.current}</GroupLabel>
              <div className="flex gap-4">
                <Swatch hex={accents.cyan} name="--ec-cyan" />
                <Swatch hex={accents.emerald} name="--ec-emerald" />
              </div>
            </div>

            <div className="mt-6">
              <GroupLabel>{g.semantic}</GroupLabel>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {SEMANTIC.map((c) => (
                  <Swatch key={c.hex} hex={c.hex} name={c.name} />
                ))}
              </div>
            </div>
          </Section>

          {/* Typography */}
          <Section id="typography" title={sc.typography.title} desc={sc.typography.desc}>
            <GroupLabel>{g.displayScale}</GroupLabel>
            <div className="space-y-2 font-display text-slate-900 dark:text-slate-100 tracking-tight">
              <div className="flex items-baseline gap-4"><span className="w-12 shrink-0 text-[11px] tabular-nums text-slate-400">3.4r</span><span className="text-[clamp(2rem,4vw,3.4rem)] leading-none">Aa</span></div>
              <div className="flex items-baseline gap-4"><span className="w-12 shrink-0 text-[11px] tabular-nums text-slate-400">28px</span><span className="text-[28px] leading-none">Aa</span></div>
              <div className="flex items-baseline gap-4"><span className="w-12 shrink-0 text-[11px] tabular-nums text-slate-400">20px</span><span className="text-[20px] leading-none">Aa</span></div>
              <div className="flex items-baseline gap-4"><span className="w-12 shrink-0 text-[11px] tabular-nums text-slate-400">16px</span><span className="text-[16px] leading-none">Aa</span></div>
            </div>

            <div className="mt-6">
              <GroupLabel>{g.bodyScale}</GroupLabel>
              <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <p className="text-[15px] leading-relaxed">{g.intro}</p>
                <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">{g.intro}</p>
                <p className="text-[11.5px] uppercase tracking-[.14em] text-slate-400">{g.body} · caption</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <GroupLabel>{g.fontFamilies} — {g.display}</GroupLabel>
                <div className="flex flex-wrap gap-2">
                  {FONT_OPTIONS_DISPLAY.map((f) => (
                    <span key={f} className="rounded-full bg-slate-900/[.04] dark:bg-white/[.06] px-3 py-1 text-[12.5px] text-slate-700 dark:text-slate-300">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <GroupLabel>{g.fontFamilies} — {g.body}</GroupLabel>
                <div className="flex flex-wrap gap-2">
                  {FONT_OPTIONS_BODY.map((f) => (
                    <span key={f} className="rounded-full bg-slate-900/[.04] dark:bg-white/[.06] px-3 py-1 text-[12.5px] text-slate-700 dark:text-slate-300">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Tags */}
          <Section id="tags" title={sc.tags.title} desc={sc.tags.desc}>
            <div className="flex flex-wrap gap-3">
              <Tag color="emerald">emerald</Tag>
              <Tag color="cyan">cyan</Tag>
              <Tag color="slate">slate</Tag>
            </div>
          </Section>

          {/* Buttons */}
          <Section id="buttons" title={sc.buttons.title} desc={sc.buttons.desc}>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="eco-press inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
                {g.primary}
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
              </button>
              <button type="button" className="eco-press inline-flex items-center rounded-full px-5 py-2.5 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.05] dark:hover:bg-white/[.06] transition">
                {g.ghost}
              </button>
              <button type="button" className="eco-press inline-flex items-center rounded-full px-5 py-2.5 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 ring-1 ring-slate-900/[.12] dark:ring-white/[.14] hover:ring-cyan-500/40 transition">
                {g.outline}
              </button>
            </div>
          </Section>

          {/* Cards & surfaces */}
          <Section id="cards" title={sc.cards.title} desc={sc.cards.desc}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="eco-lift rounded-2xl eco-card p-6">
                <Tag color="cyan">eco-card</Tag>
                <h3 className="mt-3 font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100">{g.display}</h3>
                <p className="mt-1.5 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{g.intro}</p>
              </div>
              <div className="eco-lift relative overflow-hidden rounded-2xl eco-card p-6">
                <GlowOrb className="-top-16 -right-16" color="rgba(14,165,233,.5)" size={220} />
                <Tag color="emerald">GlowOrb</Tag>
                <h3 className="relative mt-3 font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100">{g.body}</h3>
                <p className="relative mt-1.5 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{g.intro}</p>
              </div>
            </div>
          </Section>

          {/* Skeletons */}
          <Section id="skeletons" title={sc.skeletons.title} desc={sc.skeletons.desc}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl eco-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton circle className="h-10 w-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
              <CardSkeleton />
            </div>
          </Section>

          {/* Form controls */}
          <Section id="forms" title={sc.forms.title} desc={sc.forms.desc}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="sg-email" className="mb-1.5 block text-[12.5px] font-medium text-slate-700 dark:text-slate-300">{g.inputLabel}</label>
                <input id="sg-email" type="email" placeholder={g.inputPlaceholder} className="w-full rounded-xl bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3.5 py-2.5 text-[13.5px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-cyan-500/40 transition" />
              </div>
              <div>
                <label htmlFor="sg-topic" className="mb-1.5 block text-[12.5px] font-medium text-slate-700 dark:text-slate-300">{g.selectLabel}</label>
                <select id="sg-topic" className="w-full rounded-xl bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3.5 py-2.5 text-[13.5px] text-slate-900 dark:text-slate-100 outline-none focus:ring-cyan-500/40 transition">
                  <option>{g.primary}</option>
                  <option>{g.ghost}</option>
                  <option>{g.outline}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="sg-msg" className="mb-1.5 block text-[12.5px] font-medium text-slate-700 dark:text-slate-300">{g.textareaLabel}</label>
                <textarea id="sg-msg" rows={3} placeholder={g.textareaPlaceholder} className="w-full rounded-xl bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3.5 py-2.5 text-[13.5px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-cyan-500/40 transition resize-none" />
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section id="tabs" title={sc.tabs.title} desc={sc.tabs.desc}>
            <Tabs tabs={demoTabs} value={tab} onChange={setTab} />
            <div className="mt-4 rounded-xl eco-card p-5 text-[13.5px] text-slate-600 dark:text-slate-400" role="tabpanel">
              <span className="font-medium text-slate-900 dark:text-slate-100">{demoTabs.find((x) => x.id === tab)?.label}</span> — {g.intro}
            </div>
          </Section>

          {/* Tooltip */}
          <Section id="tooltip" title={sc.tooltip.title} desc={sc.tooltip.desc}>
            <div className="flex flex-wrap gap-6">
              {['top', 'bottom', 'left', 'right'].map((side) => (
                <Tooltip key={side} side={side} label={`${side} tooltip`}>
                  <button type="button" className="rounded-full px-4 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 ring-1 ring-slate-900/[.12] dark:ring-white/[.14] hover:ring-cyan-500/40 transition">
                    {side}
                  </button>
                </Tooltip>
              ))}
            </div>
          </Section>

          {/* Toast */}
          <Section id="toast" title={sc.toast.title} desc={sc.toast.desc}>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => toast({ message: g.toastMsg, type: 'success' })} className="rounded-full px-4 py-2 text-[13px] font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/[.08] transition">
                {g.fireSuccess}
              </button>
              <button type="button" onClick={() => toast({ message: g.toastMsg, type: 'error' })} className="rounded-full px-4 py-2 text-[13px] font-medium text-rose-700 dark:text-rose-400 ring-1 ring-rose-500/30 hover:bg-rose-500/[.08] transition">
                {g.fireError}
              </button>
              <button type="button" onClick={() => toast({ message: g.toastMsg, type: 'info' })} className="rounded-full px-4 py-2 text-[13px] font-medium text-cyan-700 dark:text-cyan-400 ring-1 ring-cyan-500/30 hover:bg-cyan-500/[.08] transition">
                {g.fireInfo}
              </button>
            </div>
          </Section>

          {/* Animated number */}
          <Section id="numbers" title={sc.numbers.title} desc={sc.numbers.desc}>
            <div ref={numRef} className="flex flex-wrap items-end gap-x-10 gap-y-4">
              {[
                { value: '8.4K', label: tr ? 'Kullanıcı' : 'Users' },
                { value: '%92', label: tr ? 'Memnuniyet' : 'Satisfaction' },
                { value: '164t', label: 'CO₂' },
              ].map((m) => (
                <div key={m.label}>
                  <AnimatedNumber
                    key={`${m.label}-${replayKey}`}
                    value={m.value}
                    play={numIn}
                    className="font-display text-[34px] leading-none tracking-tight tabular-nums text-slate-900 dark:text-slate-100"
                  />
                  <div className="mt-1.5 text-[12px] text-slate-500 dark:text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setReplayKey((k) => k + 1)} className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 ring-1 ring-slate-900/[.12] dark:ring-white/[.14] hover:ring-cyan-500/40 transition">
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 7a4 4 0 1 1-1.2-2.8M11 2.5V5H8.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {g.replay}
            </button>
          </Section>

          {/* Charts */}
          <Section id="charts" title={sc.charts.title} desc={sc.charts.desc}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl eco-card p-5">
                <GroupLabel>{g.trend}</GroupLabel>
                <Sparkline data={[4, 8, 6, 10, 7, 12, 9, 14]} color={accents.cyan} width={120} height={40} className="h-12 w-full" label={g.trend} />
              </div>
              <div className="rounded-xl eco-card p-5">
                <GroupLabel>{g.bars}</GroupLabel>
                <BarMini data={[5, 9, 7, 12, 8, 14, 11]} color={accents.emerald} width={120} height={40} className="h-12 w-full" label={g.bars} />
              </div>
              <div className="rounded-xl eco-card p-5">
                <GroupLabel>{g.ring}</GroupLabel>
                <Donut value={72} size={56} stroke={6} color={accents.emerald} label={`${g.ring} 72%`}>
                  72%
                </Donut>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </section>
  );
}
