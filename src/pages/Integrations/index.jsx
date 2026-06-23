import { GRADIENTS } from '@/core/tokens';
import { Link } from 'react-router-dom';
import { ArrowRight, EmptyState, FilterPills, PageHeader, RelatedRoutes, ResultCount, SearchInput, StatusBadge } from '@/shared/ui/primitives';
import { useFilteredList } from '@/shared/ui/useFilteredList';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { INTEGRATIONS, integrationCategories, filterByCategory, searchIntegrations, statusMeta } from '@/core/data/integrations';

const meta = routeByKey('integrations');
const CATEGORIES = integrationCategories();

export default function IntegrationsPage() {
  const { lang, t } = useApp();
  const g = t.integrations;
  const { active, setActive, query, setQuery, visible } = useFilteredList({
    items: INTEGRATIONS,
    filter: filterByCategory,
    search: searchIntegrations,
    lang,
  });
  useDocumentMeta(meta.title[lang], g.intro);

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

        <SearchInput
          className="mb-5 max-w-sm"
          value={query}
          onChange={setQuery}
          placeholder={g.searchP}
          label={g.searchLabel}
          clearLabel={g.searchClear}
          inputClassName="py-3 text-[14px]"
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

        <ResultCount>{g.count.replace('{n}', visible.length)}</ResultCount>

        {visible.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.5-4.5" strokeLinecap="round" /></svg>}
            action={
              <button
                type="button"
                onClick={() => { setActive(null); setQuery(''); }}
                className="eco-press inline-flex items-center gap-1.5 rounded-full bg-slate-900/[.05] dark:bg-white/[.08] px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.08] dark:hover:bg-white/[.12] transition"
              >
                {g.clearFilters}
              </button>
            }
          >
            {g.empty}
          </EmptyState>
        ) : (
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
                  <StatusBadge accent={sm.accent} label={sm.label[lang]} pulse={it.status === 'connected'} className="text-[11px]" dotClassName="h-1.5 w-1.5" />
                </div>
                <h2 className="mt-3 font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{it.name}</h2>
                <p className="mt-1 flex-1 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{it.tagline[lang]}</p>
                <span className="mt-3 text-[11.5px] text-slate-400">{it.category[lang]}</span>
              </Link>
            );
          })}
        </div>
        )}

        <div className="mt-12 rounded-2xl p-7 ring-1 ring-cyan-500/20" style={{ backgroundImage: GRADIENTS.panel }}>
          <h2 className="font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100">{g.ctaTitle}</h2>
          <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">{g.ctaText}</p>
          <Link to="/contact?from=integrations" className="eco-press mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
            {g.cta}
            <ArrowRight />
          </Link>
        </div>

        {/* After browsing connectors, route on: the API docs to build one, the
            product, or a way to talk. Labels come from the route table. */}
        <RelatedRoutes title={t.related.related} routeKeys={['developers', 'services', 'contact']} lang={lang} />
      </div>
    </section>
  );
}
