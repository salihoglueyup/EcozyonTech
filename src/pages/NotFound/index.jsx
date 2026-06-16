import { GRADIENTS } from '@/core/tokens';
import { ArrowRight } from '@/shared/ui/primitives';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { NAV_ITEMS, ROUTES } from '@/core/config/site';
import { buildSearchDocs, searchDocs } from '@/core/lib/search';

export default function NotFoundPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  const { pathname } = useLocation();
  useDocumentMeta(
    tr ? 'Sayfa bulunamadı — Ecozyon Tech' : 'Page not found — Ecozyon Tech',
    tr ? 'Aradığın sayfa bulunamadı.' : 'The page you are looking for was not found.',
  );

  // Turn the mistyped path into a query and surface the closest content — a
  // smart "did you mean" using the site search engine.
  const index = useMemo(
    () => buildSearchDocs({ routes: ROUTES, lang }),
    [lang],
  );
  const query = pathname.replace(/[/\-_]+/g, ' ').trim();
  const suggestions = useMemo(() => searchDocs(index, query).slice(0, 4), [index, query]);

  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-24 pt-32">
      <div className="text-center max-w-md">
        <div className="eco-gradient-text font-display text-[clamp(4rem,12vw,8rem)] leading-none tracking-tight">
          404
        </div>
        <h1 className="mt-4 font-display text-[clamp(1.4rem,2.6vw,2rem)] tracking-tight text-slate-900 dark:text-slate-100">
          {tr ? 'Bu sayfa yok' : "This page doesn't exist"}
        </h1>
        <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {tr
            ? 'Aradığın sayfa taşınmış veya hiç var olmamış olabilir.'
            : 'The page you were looking for may have moved or never existed.'}
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
          style={{ backgroundImage: GRADIENTS.cta }}
        >
          {tr ? 'Ana sayfaya dön' : 'Back to home'}
          <ArrowRight />
        </Link>

        {suggestions.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-900/[.08] dark:border-white/[.08] text-left">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center">
              {tr ? 'Bunu mu arıyordun?' : 'Were you looking for…'}
            </div>
            <ul className="space-y-2">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <Link
                    to={s.to}
                    className="eco-lift group flex items-center gap-3 rounded-xl eco-card px-4 py-2.5 hover:ring-cyan-500/30 transition"
                  >
                    <span className="shrink-0 text-slate-400 group-hover:text-cyan-500" aria-hidden="true">→</span>
                    <span className="flex-1 truncate text-[13.5px] font-medium text-slate-800 dark:text-slate-200">{s.title}</span>
                    {s.hint && <span className="shrink-0 text-[11px] text-slate-400">{s.hint}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-900/[.08] dark:border-white/[.08]">
          <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400 mb-3">
            {tr ? 'Popüler sayfalar' : 'Popular pages'}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.path}
                to={it.path}
                className="rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] px-3 py-1.5 text-[12.5px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:ring-cyan-500/30 transition"
              >
                {it.nav[lang] || it.nav.en}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('ecozyon:cmdk'))}
            className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            {tr ? 'veya hızlıca ara' : 'or search quickly'}
            <kbd className="rounded-md bg-slate-900/[.06] dark:bg-white/[.08] px-1.5 py-0.5 font-sans font-medium text-slate-600 dark:text-slate-400">⌘K</kbd>
          </button>
        </div>
      </div>
    </section>
  );
}
