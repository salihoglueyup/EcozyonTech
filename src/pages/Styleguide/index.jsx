import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { SectionNav } from '@/shared/ui/SectionNav';
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
  const g = t.styleguide;
  const sc = g.sections;
  useDocumentMeta(meta.title[lang], g.intro);

  const navSections = SECTIONS.map((s) => ({ id: s.id, label: s.label[lang] }));

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <SectionNav sections={navSections} />
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="cyan">// {g.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {g.title}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
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
        </div>
      </div>
    </section>
  );
}
