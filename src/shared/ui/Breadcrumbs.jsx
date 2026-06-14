import { Link } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';

// Visible breadcrumb trail for deep content pages. `items` are the crumbs
// between Home and the current page (each { label, to? }); the last item is the
// current page and renders without a link. Home is prepended automatically.
// The matching BreadcrumbList JSON-LD is emitted by the prerender step.
export function Breadcrumbs({ items = [] }) {
  const { lang } = useApp();
  const trail = [{ label: lang === 'tr' ? 'Ana Sayfa' : 'Home', to: '/' }, ...items];

  return (
    <nav aria-label={lang === 'tr' ? 'İçerik yolu' : 'Breadcrumb'}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.to && !last ? (
                <Link to={c.to} viewTransition className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-slate-700 dark:text-slate-300 font-medium truncate max-w-[60vw] sm:max-w-xs' : ''}>
                  {c.label}
                </span>
              )}
              {!last && <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
