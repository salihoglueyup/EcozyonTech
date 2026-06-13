import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { INTEGRATIONS, integrationCategories, filterByCategory, statusMeta } from '@/core/data/integrations';

const meta = routeByKey('integrations');
const CATEGORIES = integrationCategories();

export default function IntegrationsPage() {
  const { lang, t } = useApp();
  const g = t.integrations;
  const [active, setActive] = useState(null);
  useDocumentMeta(meta.title[lang], g.intro);

  const visible = filterByCategory(INTEGRATIONS, active);

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mb-10">
          <Tag color="cyan">// {g.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {g.title}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {g.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{g.intro}</p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={g.filterLabel}>
          {[{ id: null, label: { tr: g.filterAll, en: g.filterAll } }, ...CATEGORIES].map((cat) => {
            const on = active === cat.id;
            return (
              <button
                key={cat.id ?? 'all'}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={on}
                className={`eco-press rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ring-1 transition ${
                  on
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-slate-900 dark:ring-white'
                    : 'bg-white/70 dark:bg-white/[.06] text-slate-700 dark:text-slate-300 ring-slate-900/[.08] dark:ring-white/[.1] hover:ring-cyan-500/30'
                }`}
              >
                {cat.label[lang]}
              </button>
            );
          })}
        </div>

        <div className="mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400" aria-live="polite">
          {g.count.replace('{n}', visible.length)}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((it) => {
            const sm = statusMeta(it.status);
            return (
              <Link
                key={it.slug}
                to={`/integrations/${it.slug}`}
                className="eco-lift group flex flex-col rounded-2xl eco-card p-5 lg:p-6 hover:ring-cyan-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl font-display text-[15px] font-semibold text-white" style={{ backgroundColor: it.accent }} aria-hidden="true">
                    {it.name.slice(0, 1)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: sm.accent }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sm.accent }} />
                    {sm.label[lang]}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{it.name}</h2>
                <p className="mt-1 flex-1 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{it.tagline[lang]}</p>
                <span className="mt-3 text-[11.5px] text-slate-400">{it.category[lang]}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl p-7 ring-1 ring-cyan-500/20" style={{ backgroundImage: 'linear-gradient(120deg,rgba(14,165,233,.08),rgba(16,185,129,.08))' }}>
          <h2 className="font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100">{g.ctaTitle}</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">{g.ctaText}</p>
          <Link to="/contact?from=integrations" className="eco-press mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
            {g.cta}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
