import { useEffect, useState } from 'react';
import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { GLOSSARY, glossaryCategories, filterByCategory, searchGlossary } from '@/core/data/glossary';

const meta = routeByKey('glossary');
const CATEGORIES = glossaryCategories();

export default function GlossaryPage() {
  const { lang, t } = useApp();
  const g = t.glossary;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  // Read a #term-id anchor once, post-mount (prerender-safe).
  const [hashId] = useState(() => (typeof window !== 'undefined' ? window.location.hash.slice(1) : ''));
  useDocumentMeta(meta.title[lang], g.intro);

  useEffect(() => {
    if (!hashId) return;
    const el = document.getElementById(hashId);
    if (el) el.scrollIntoView();
  }, [hashId]);

  const visible = searchGlossary(filterByCategory(GLOSSARY, active), query, lang);

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Tag color="cyan">// {g.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {g.title}
            <span className="eco-gradient-text">
              {g.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{g.intro}</p>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={g.searchP}
          aria-label={g.searchLabel}
          className="w-full rounded-2xl eco-card px-4 py-3.5 text-[14.5px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
        />

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={g.filterLabel}>
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

        <div className="mt-4 mb-2 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400" aria-live="polite">
          {g.count.replace('{n}', visible.length)}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl eco-card p-6 text-[13.5px] text-slate-500 dark:text-slate-400">{g.empty}</p>
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
                </Reveal>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
