import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FilterPills, PageHeader, ResultCount } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { CASES, caseSectors } from '@/core/data/cases';

const meta = routeByKey('cases');
const SECTORS = caseSectors(CASES);

export default function CasesPage() {
  const { lang, t } = useApp();
  const tr = lang === 'tr';
  const [activeSector, setActiveSector] = useState(null);
  useDocumentMeta(meta.title[lang], t.cases.intro);

  const visible = activeSector ? CASES.filter((c) => c.sector.en === activeSector) : CASES;

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <PageHeader
          eyebrow={t.cases.eyebrow}
          title={t.cases.title}
          titleAccent={t.cases.titleAccent}
          intro={t.cases.intro}
          className="max-w-3xl mb-10"
        />

        <FilterPills
          className="mb-5"
          options={SECTORS}
          allLabel={t.cases.filterAll}
          value={activeSector}
          onChange={setActiveSector}
          lang={lang}
          label={t.cases.filterLabel}
        />

        <ResultCount>{t.cases.count.replace('{n}', visible.length)}</ResultCount>

        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((c) => {
            const headline = c.results[0];
            return (
              <Link
                key={c.slug}
                to={`/cases/${c.slug}`}
                className="group flex flex-col rounded-2xl eco-card p-6 lg:p-7 hover:ring-cyan-500/30 transition"
              >
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold" style={{ backgroundColor: `${c.accent}1f`, color: c.accent }}>
                    {c.city}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{c.sector[lang]}</span>
                </div>
                <h2 className="mt-2.5 font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100">{c.client[lang]}</h2>
                <p className="mt-1.5 flex-1 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{c.summary[lang]}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="font-display text-[26px] leading-none tracking-tight tabular-nums" style={{ color: c.accent }}>
                      {headline.value}
                      {headline.unit[lang] && <span className="ml-1 text-[12px] font-medium text-slate-400">{headline.unit[lang]}</span>}
                    </div>
                    <div className="mt-1 text-[11.5px] text-slate-500 dark:text-slate-400">{headline.label[lang]}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                    {t.cases.readCase}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-[13px] text-slate-600 dark:text-slate-400">
          {tr ? 'Hepsini haritada gör: ' : 'See them all on the map: '}
          <Link to="/impact" className="text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-emerald-500 decoration-2">
            {tr ? 'Etki Haritası' : 'Impact Map'}
          </Link>
        </div>
      </div>
    </section>
  );
}
