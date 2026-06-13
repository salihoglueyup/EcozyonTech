import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { PRESS_RELEASES, COVERAGE, BRAND_FACTS, BRAND_COLORS } from '@/core/data/press';

const meta = routeByKey('press');

export default function PressPage() {
  const { lang, t } = useApp();
  const p = t.press;
  useDocumentMeta(meta.title[lang], p.intro);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="cyan">// {p.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {p.title}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {p.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{p.intro}</p>
        </div>

        {/* Press releases */}
        <h2 className="mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{p.releases}</h2>
        <div className="space-y-4">
          {PRESS_RELEASES.map((rel, i) => (
            <Reveal key={rel.slug} delay={i * 60}>
              <article className="rounded-2xl eco-card p-6 lg:p-7">
                <div className="text-[12px] tabular-nums text-slate-400">{fmtDate(rel.date)}</div>
                <h3 className="mt-1.5 font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug">{rel.title[lang]}</h3>
                <div className="mt-2.5 space-y-2 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rel.body[lang].map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Coverage */}
        <h2 className="mt-14 mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{p.coverage}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {COVERAGE.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <div className="flex h-full flex-col rounded-2xl eco-card p-5">
                <div className="font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100">{c.outlet}</div>
                <div className="mt-0.5 text-[11.5px] tabular-nums text-slate-400">{fmtDate(c.date)}</div>
                <p className="mt-3 flex-1 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed italic">{c.quote[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Media kit */}
        <h2 className="mt-14 mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{p.mediaKit}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Reveal>
            <dl className="rounded-2xl eco-card p-6 divide-y divide-slate-900/[.06] dark:divide-white/[.06]">
              {BRAND_FACTS.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                  <dt className="text-[12.5px] text-slate-500 dark:text-slate-400">{f.label[lang]}</dt>
                  <dd className="text-[13.5px] font-medium text-slate-900 dark:text-slate-100 text-right">{f.value[lang]}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={60}>
            <div className="rounded-2xl eco-card p-6">
              <div className="text-[12.5px] text-slate-500 dark:text-slate-400 mb-3">{p.brandColors}</div>
              <div className="flex flex-wrap gap-3">
                {BRAND_COLORS.map((col) => (
                  <div key={col.hex} className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-lg ring-1 ring-black/[.08] dark:ring-white/[.12]" style={{ backgroundColor: col.hex }} aria-hidden="true" />
                    <div className="leading-tight">
                      <div className="text-[12.5px] font-medium text-slate-900 dark:text-slate-100">{col.name}</div>
                      <div className="text-[11px] tabular-nums text-slate-400">{col.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Press contact */}
        <Reveal>
          <div className="mt-14 rounded-2xl p-7 lg:p-8 ring-1 ring-cyan-500/20" style={{ backgroundImage: 'linear-gradient(120deg,rgba(14,165,233,.08),rgba(16,185,129,.08))' }}>
            <h2 className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100">{p.contactTitle}</h2>
            <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">{p.contactText}</p>
            <Link
              to="/contact?from=press"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition"
            >
              {p.contactCta}
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
