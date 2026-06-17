import { useEffect, useState } from 'react';
import { EmptyState, FilterPills, PageHeader, ResultCount } from '@/shared/ui/primitives';
import { useFilteredList } from '@/shared/ui/useFilteredList';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { GLOSSARY, glossaryCategories, filterByCategory, searchGlossary, glossaryByIds } from '@/core/data/glossary';

const meta = routeByKey('glossary');
const CATEGORIES = glossaryCategories();

export default function GlossaryPage() {
  const { lang, t } = useApp();
  const g = t.glossary;
  const { active, setActive, query, setQuery, visible } = useFilteredList({
    items: GLOSSARY,
    filter: filterByCategory,
    search: searchGlossary,
    lang,
  });
  // Read a #term-id anchor once, post-mount (prerender-safe).
  const [hashId] = useState(() => (typeof window !== 'undefined' ? window.location.hash.slice(1) : ''));
  useDocumentMeta(meta.title[lang], g.intro);

  useEffect(() => {
    if (!hashId) return;
    const el = document.getElementById(hashId);
    if (el) el.scrollIntoView();
  }, [hashId]);

  // Jump to a related term: clear the active filter + search first so the
  // target is never hidden behind a category/search filter, then scroll to it.
  const jumpTo = (id) => {
    setActive(null);
    setQuery('');
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  };


  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <PageHeader
          eyebrow={g.eyebrow}
          title={g.title}
          titleAccent={g.titleAccent}
          intro={g.intro}
          className="mb-8"
        />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={g.searchP}
          aria-label={g.searchLabel}
          className="w-full rounded-2xl eco-card px-4 py-3.5 text-[14.5px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
        />

        <FilterPills
          className="mt-4"
          options={CATEGORIES}
          allLabel={g.filterAll}
          value={active}
          onChange={setActive}
          lang={lang}
          label={g.filterLabel}
        />

        <ResultCount className="mt-4 mb-2">{g.count.replace('{n}', visible.length)}</ResultCount>

        {visible.length === 0 ? (
          <EmptyState className="rounded-xl p-6">{g.empty}</EmptyState>
        ) : (
          <div className="divide-y divide-slate-900/[.06] dark:divide-white/[.06]">
            {visible.map((term, i) => (
              <div key={term.id} id={term.id} className="scroll-mt-28 py-5">
                <Reveal delay={Math.min(i, 6) * 40}>
                  <div className="flex items-center gap-2.5">
                    <a href={`#${term.id}`} className="font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                      <dfn className="not-italic">{term.term[lang]}</dfn>
                    </a>
                    <span className="rounded-full bg-slate-900/[.05] dark:bg-white/[.06] px-2 py-0.5 text-[10.5px] font-medium text-slate-500 dark:text-slate-400">{term.category[lang]}</span>
                  </div>
                  <p className="mt-1.5 text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">{term.definition[lang]}</p>
                  {glossaryByIds(term.related).length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10.5px] uppercase tracking-[.12em] font-semibold text-slate-400">{g.related}</span>
                      {glossaryByIds(term.related).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => jumpTo(r.id)}
                          className="eco-press rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/15 px-2.5 py-0.5 text-[11.5px] font-medium hover:bg-cyan-500/15 transition"
                        >
                          {r.term[lang]}
                        </button>
                      ))}
                    </div>
                  )}
                </Reveal>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
