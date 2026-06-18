import { Link } from 'react-router-dom';
import { ArrowRight, EmptyState, FilterPills, PageHeader, ResultCount, SearchInput } from '@/shared/ui/primitives';
import { useFilteredList } from '@/shared/ui/useFilteredList';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { CASES, caseSectors, filterBySector, searchCases } from '@/core/data/cases';

const meta = routeByKey('cases');
const SECTORS = caseSectors(CASES);

export default function CasesPage() {
  const { lang, t } = useApp();
  const tr = lang === 'tr';
  const { active: activeSector, setActive: setActiveSector, query, setQuery, visible } = useFilteredList({
    items: CASES,
    filter: filterBySector,
    search: searchCases,
    lang,
  });
  useDocumentMeta(meta.title[lang], t.cases.intro);

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

        <SearchInput
          className="mb-5 max-w-sm"
          value={query}
          onChange={setQuery}
          placeholder={t.cases.searchP}
          label={t.cases.searchLabel}
          clearLabel={t.cases.searchClear}
          inputClassName="py-3 text-[14px]"
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

        {visible.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.5-4.5" strokeLinecap="round" /></svg>}
            action={
              <button
                type="button"
                onClick={() => { setActiveSector(null); setQuery(''); }}
                className="eco-press inline-flex items-center gap-1.5 rounded-full bg-slate-900/[.05] dark:bg-white/[.08] px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.08] dark:hover:bg-white/[.12] transition"
              >
                {t.cases.clearFilters}
              </button>
            }
          >
            {t.cases.empty}
          </EmptyState>
        ) : (
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
        )}

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
