import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { POSTS, readingTime, postTags, filterByTag, searchPosts } from '@/core/data/posts';

const meta = routeByKey('blog');
const TAGS = postTags(POSTS);
const COVER_GRADIENTS = [
  'linear-gradient(135deg,#0EA5E9 0%,#10B981 100%)',
  'linear-gradient(135deg,#10B981 0%,#7C3AED 100%)',
  'linear-gradient(135deg,#7C3AED 0%,#F59E0B 100%)',
  'linear-gradient(135deg,#F59E0B 0%,#EC4899 100%)',
  'linear-gradient(135deg,#EC4899 0%,#0EA5E9 100%)',
];

export default function BlogPage() {
  const { lang, t } = useApp();
  const tr = lang === 'tr';
  const [activeTag, setActiveTag] = useState(null);
  const [query, setQuery] = useState('');
  const visible = searchPosts(filterByTag(POSTS, activeTag), query, lang);
  useDocumentMeta(
    meta.title[lang],
    tr
      ? 'Sürdürülebilirlik, donanım ve davranış değişimi üzerine yazılar.'
      : 'Writing on sustainability, hardware and behavior change.',
  );

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="emerald">// {tr ? 'Blog' : 'Blog'}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {tr ? 'Notlar & ' : 'Notes & '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {tr ? 'içgörüler' : 'insights'}
            </span>
          </h1>
        </div>

        <div className="mb-5 relative max-w-sm">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.blog.searchP}
            aria-label={t.blog.searchLabel}
            className="w-full rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] pl-10 pr-4 py-2.5 text-[13px] text-slate-800 dark:text-slate-200 outline-none focus:ring-cyan-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={t.blog.filterLabel}>
          {[{ id: null, label: { tr: t.blog.all, en: t.blog.all } }, ...TAGS].map((tg) => {
            const on = activeTag === tg.id;
            return (
              <button
                key={tg.id ?? 'all'}
                type="button"
                onClick={() => setActiveTag(tg.id)}
                aria-pressed={on}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ring-1 transition ${
                  on
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-slate-900 dark:ring-white'
                    : 'bg-white/70 dark:bg-white/[.06] text-slate-700 dark:text-slate-300 ring-slate-900/[.08] dark:ring-white/[.1] hover:ring-cyan-500/30'
                }`}
              >
                {tg.label[lang]}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {visible.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group flex flex-col sm:flex-row gap-5 rounded-2xl eco-card p-5 lg:p-6 hover:ring-cyan-500/30 transition"
            >
              {/* Cover thumbnail */}
              <div
                className="shrink-0 w-full sm:w-44 h-28 sm:h-auto rounded-xl overflow-hidden"
                style={{
                  background: COVER_GRADIENTS[visible.indexOf(p) % COVER_GRADIENTS.length],
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-white/70">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/[.12] text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/15 dark:ring-emerald-400/20 px-2 py-0.5 font-semibold">
                    {p.tag[lang]}
                  </span>
                  <time className="text-slate-500 font-mono">{p.date}</time>
                  <span className="text-slate-400 font-mono">· {readingTime(p, lang)} {t.blog.readMin}</span>
                </div>
                <h2 className="mt-2 font-display text-[18px] lg:text-[20px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition">
                  {p.title[lang]}
                </h2>
                <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{p.excerpt[lang]}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-800 dark:text-slate-200">
                  {tr ? 'Devamını oku' : 'Read more'}
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h6m-2-2 2 2-2 2" /></svg>
                </span>
              </div>
            </Link>
          ))}
          {visible.length === 0 && (
            <p className="py-10 text-center text-[14px] text-slate-500 dark:text-slate-400">
              {query.trim() ? t.blog.noResults : t.blog.empty}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
