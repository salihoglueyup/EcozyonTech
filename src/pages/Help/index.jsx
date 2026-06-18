import { GRADIENTS } from '@/core/tokens';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, EmptyState, FilterPills, PageHeader, ResultCount, SearchInput } from '@/shared/ui/primitives';
import { Disclosure } from '@/shared/ui/Collapse';
import { useFilteredList } from '@/shared/ui/useFilteredList';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { HELP, helpCategories, filterByCategory, searchHelp } from '@/core/data/help';

const meta = routeByKey('help');
const CATEGORIES = helpCategories(HELP);

export default function HelpPage() {
  const { lang, t } = useApp();
  const { active: activeCat, setActive: setActiveCat, query, setQuery, visible } = useFilteredList({
    items: HELP,
    filter: filterByCategory,
    search: searchHelp,
    lang,
  });
  useDocumentMeta(meta.title[lang], t.help.intro);

  // Deep-link: /help#<id> opens that question and scrolls to it. Read once on
  // mount (the hash is empty during prerender, so the SSR HTML is unaffected).
  const [hashId] = useState(() => (typeof window === 'undefined' ? '' : window.location.hash.slice(1)));
  useEffect(() => {
    if (!hashId) return;
    document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [hashId]);


  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <PageHeader
          eyebrow={t.help.eyebrow}
          title={t.help.title}
          titleAccent={t.help.titleAccent}
          intro={t.help.intro}
          className="mb-10"
        />

        <SearchInput
          className="mb-5"
          value={query}
          onChange={setQuery}
          placeholder={t.help.searchP}
          label={t.help.searchLabel}
          clearLabel={t.help.searchClear}
          inputClassName="py-3 text-[14px]"
        />

        <FilterPills
          className="mb-5"
          options={CATEGORIES}
          allLabel={t.help.filterAll}
          value={activeCat}
          onChange={setActiveCat}
          lang={lang}
          label={t.help.filterLabel}
        />

        <ResultCount>{t.help.count.replace('{n}', visible.length)}</ResultCount>

        <div className="space-y-2">
          {visible.length === 0 && (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.5-4.5" strokeLinecap="round" /></svg>}
              action={
                <button
                  type="button"
                  onClick={() => { setActiveCat(null); setQuery(''); }}
                  className="eco-press inline-flex items-center gap-1.5 rounded-full bg-slate-900/[.05] dark:bg-white/[.08] px-3.5 py-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.08] dark:hover:bg-white/[.12] transition"
                >
                  {t.help.clearFilters}
                </button>
              }
            >
              {t.help.empty}
            </EmptyState>
          )}
          {visible.map((entry) => (
            <HelpItem key={entry.id} entry={entry} lang={lang} relatedLabel={t.related.related} defaultOpen={entry.id === hashId} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl eco-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[14px] text-slate-700 dark:text-slate-300">{t.help.more}</span>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium text-white shrink-0"
            style={{ backgroundImage: GRADIENTS.cta }}
          >
            {t.help.contact}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HelpItem({ entry, lang, relatedLabel, defaultOpen = false }) {
  // Optional related-page chips — turn a terminal answer into a next action.
  // Labels come from the route table, so they need no per-link translation.
  const related = (entry.links ?? []).map(routeByKey).filter(Boolean);
  return (
    <Disclosure
      summary={entry.q[lang]}
      defaultOpen={defaultOpen}
      id={entry.id}
      className="scroll-mt-28"
      aside={
        <a
          href={`#${entry.id}`}
          aria-label={lang === 'tr' ? 'Bu soruya bağlantı' : 'Link to this question'}
          className="shrink-0 text-slate-300 dark:text-slate-600 hover:text-cyan-500"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l1.8-1.8a3 3 0 0 0-4.2-4.2l-1 1M9.5 6.5a3 3 0 0 0-4.2 0L3.5 8.3a3 3 0 0 0 4.2 4.2l1-1" strokeLinecap="round" /></svg>
        </a>
      }
    >
      {entry.a[lang]}
      {related.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400">{relatedLabel}</span>
          {related.map((route) => (
            <Link
              key={route.key}
              to={route.path}
              className="group inline-flex items-center gap-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 px-2.5 py-1 text-[12px] font-medium hover:bg-cyan-500/15 transition"
            >
              {route.nav[lang]}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </Disclosure>
  );
}
