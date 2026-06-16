import { GRADIENTS } from '@/core/tokens';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FilterPills, PageHeader } from '@/shared/ui/primitives';
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
        <PageHeader
          eyebrow={g.eyebrow}
          title={g.title}
          titleAccent={g.titleAccent}
          intro={g.intro}
          className="max-w-3xl mb-10"
        />

        <FilterPills
          className="mb-5"
          options={CATEGORIES}
          allLabel={g.filterAll}
          value={active}
          onChange={setActive}
          lang={lang}
          label={g.filterLabel}
        />

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

        <div className="mt-12 rounded-2xl p-7 ring-1 ring-cyan-500/20" style={{ backgroundImage: GRADIENTS.panel }}>
          <h2 className="font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100">{g.ctaTitle}</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">{g.ctaText}</p>
          <Link to="/contact?from=integrations" className="eco-press mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
            {g.cta}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
