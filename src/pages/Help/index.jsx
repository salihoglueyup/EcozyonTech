import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { HELP, helpCategories, filterByCategory, searchHelp } from '@/core/data/help';

const meta = routeByKey('help');
const CATEGORIES = helpCategories(HELP);

export default function HelpPage() {
  const { lang, t } = useApp();
  const [activeCat, setActiveCat] = useState(null);
  const [query, setQuery] = useState('');
  useDocumentMeta(meta.title[lang], t.help.intro);

  const scoped = filterByCategory(HELP, activeCat);
  const visible = searchHelp(scoped, query, lang);

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10">
          <Tag color="cyan">// {t.help.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {t.help.title}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {t.help.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{t.help.intro}</p>
        </div>

        <div className="mb-5 relative">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.help.searchP}
            aria-label={t.help.searchLabel}
            className="w-full rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] pl-10 pr-4 py-3 text-[14px] text-slate-800 dark:text-slate-200 outline-none focus:ring-cyan-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t.help.filterLabel}>
          {[{ id: null, label: { tr: t.help.filterAll, en: t.help.filterAll } }, ...CATEGORIES].map((cat) => {
            const on = activeCat === cat.id;
            return (
              <button
                key={cat.id ?? 'all'}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                aria-pressed={on}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ring-1 transition ${
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
          {t.help.count.replace('{n}', visible.length)}
        </div>

        <div className="space-y-2">
          {visible.length === 0 && (
            <div className="rounded-2xl eco-card p-8 text-center text-[13.5px] text-slate-500 dark:text-slate-400">{t.help.empty}</div>
          )}
          {visible.map((entry) => (
            <HelpItem key={entry.id} entry={entry} lang={lang} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl eco-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[14px] text-slate-700 dark:text-slate-300">{t.help.more}</span>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium text-white shrink-0"
            style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
          >
            {t.help.contact}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HelpItem({ entry, lang }) {
  const [open, setOpen] = useState(false);
  return (
    <div id={entry.id} className="scroll-mt-28 rounded-2xl eco-card overflow-hidden transition hover:ring-cyan-500/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-[15px] lg:text-[16px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
          {entry.q[lang]}
        </span>
        <span className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/[.05] dark:bg-white/[.08] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3v8M3 7h8" strokeLinecap="round" /></svg>
        </span>
      </button>
      <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}>
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{entry.a[lang]}</div>
        </div>
      </div>
    </div>
  );
}
