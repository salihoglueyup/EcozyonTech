import { GRADIENTS } from '@/core/tokens';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, EmptyState, FilterPills, PageHeader, ResultCount, SearchInput } from '@/shared/ui/primitives';
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
            <EmptyState>{t.help.empty}</EmptyState>
          )}
          {visible.map((entry) => (
            <HelpItem key={entry.id} entry={entry} lang={lang} defaultOpen={entry.id === hashId} />
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

function HelpItem({ entry, lang, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={entry.id} className="scroll-mt-28 rounded-2xl eco-card overflow-hidden transition hover:ring-cyan-500/20">
      <div className="flex items-center gap-3 pl-6 pr-6">
        <a
          href={`#${entry.id}`}
          aria-label={lang === 'tr' ? 'Bu soruya bağlantı' : 'Link to this question'}
          className="shrink-0 text-slate-300 dark:text-slate-600 hover:text-cyan-500"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l1.8-1.8a3 3 0 0 0-4.2-4.2l-1 1M9.5 6.5a3 3 0 0 0-4.2 0L3.5 8.3a3 3 0 0 0 4.2 4.2l1-1" strokeLinecap="round" /></svg>
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex-1 flex items-center gap-3 py-5 text-left"
        >
          <span className="flex-1 font-display text-[15px] lg:text-[16px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
            {entry.q[lang]}
          </span>
          <span className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/[.05] dark:bg-white/[.08] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3v8M3 7h8" strokeLinecap="round" /></svg>
          </span>
        </button>
      </div>
      <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}>
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{entry.a[lang]}</div>
        </div>
      </div>
    </div>
  );
}
