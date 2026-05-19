import { Link } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';

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
      </div>
    </section>
  );
}
