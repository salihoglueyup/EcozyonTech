import { Link } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { NAV_ITEMS } from '@/core/config/site';

export default function NotFoundPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  useDocumentMeta(
    tr ? 'Sayfa bulunamadı — Ecozyon Tech' : 'Page not found — Ecozyon Tech',
    tr ? 'Aradığın sayfa bulunamadı.' : 'The page you are looking for was not found.',
  );

  return (
    <section className="min-h-[70vh] grid place-items-center px-6 py-24 pt-32">
      <div className="text-center max-w-md">
        <div
          className="font-display text-[clamp(4rem,12vw,8rem)] leading-none tracking-tight bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}
        >
          404
        </div>
        <h1 className="mt-4 font-display text-[clamp(1.4rem,2.6vw,2rem)] tracking-tight text-slate-900">
          {tr ? 'Bu sayfa yok' : "This page doesn't exist"}
        </h1>
        <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">
          {tr
            ? 'Aradığın sayfa taşınmış veya hiç var olmamış olabilir.'
            : 'The page you were looking for may have moved or never existed.'}
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
          style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
        >
          {tr ? 'Ana sayfaya dön' : 'Back to home'}
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
        </Link>

        <div className="mt-10 pt-8 border-t border-slate-900/[.08]">
          <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">
            {tr ? 'Popüler sayfalar' : 'Popular pages'}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.path}
                to={it.path}
                className="rounded-full bg-white/70 ring-1 ring-slate-900/[.08] px-3 py-1.5 text-[12.5px] text-slate-700 hover:text-slate-900 hover:ring-cyan-500/30 transition"
              >
                {it.nav[lang] || it.nav.en}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('ecozyon:cmdk'))}
            className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-slate-900 transition"
          >
            {tr ? 'veya hızlıca ara' : 'or search quickly'}
            <kbd className="rounded-md bg-slate-900/[.06] px-1.5 py-0.5 font-sans font-medium text-slate-600">⌘K</kbd>
          </button>
        </div>
      </div>
    </section>
  );
}
