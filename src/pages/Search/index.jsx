import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES, routeByKey } from '@/core/config/site';
import { buildSearchDocs, searchDocs } from '@/core/lib/search';

const meta = routeByKey('search');

// Per-type glyph + kindLabel key (kindLabel copy is reused from t.cmd).
const TYPE_META = {
  page: { icon: '→', key: 'pages' },
  post: { icon: '✎', key: 'posts' },
  help: { icon: '?', key: 'help' },
  term: { icon: '¶', key: 'glossary' },
  case: { icon: '◆', key: 'cases' },
  integration: { icon: '⊞', key: 'integrations' },
  changelog: { icon: '⊙', key: 'changelog' },
  job: { icon: '⊕', key: 'roles' },
};

export default function SearchPage() {
  const { lang, t } = useApp();
  const s = t.search;
  useDocumentMeta(meta.title[lang], s.intro);

  const [params, setParams] = useSearchParams();
  // Start empty so server HTML == client first render; sync from the URL after
  // mount (and on back/forward), keeping the page prerender-safe + shareable.
  const [q, setQ] = useState('');
  useEffect(() => {
    const next = params.get('q') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ((cur) => (cur === next ? cur : next));
  }, [params]);

  const onChange = (value) => {
    setQ(value);
    setParams(value ? { q: value } : {}, { replace: true });
  };

  const index = useMemo(
    () => buildSearchDocs({ routes: ROUTES, lang }),
    [lang],
  );
  const results = useMemo(() => searchDocs(index, q), [index, q]);
  const query = q.trim();

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <PageHeader
          eyebrow={s.eyebrow}
          title={s.title}
          titleAccent={s.titleAccent}
          intro={s.intro}
          className="mb-8"
        />

        <div className="flex items-center gap-3 rounded-2xl eco-card px-4">
          <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => onChange(e.target.value)}
            placeholder={s.placeholder}
            aria-label={s.label}
            className="w-full bg-transparent py-3.5 text-[15px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
          />
        </div>

        {query && (
          <div className="mt-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400" aria-live="polite">
            {s.count.replace('{n}', results.length)}
          </div>
        )}

        {!query ? (
          <p className="mt-8 text-[14px] text-slate-500 dark:text-slate-400">{s.prompt}</p>
        ) : results.length === 0 ? (
          <p className="mt-8 text-[14px] text-slate-500 dark:text-slate-400">{s.empty.replace('{q}', query)}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {results.map((r) => {
              const tm = TYPE_META[r.type] || TYPE_META.page;
              return (
                <li key={r.id}>
                  <Link
                    to={r.to}
                    className="group flex items-center gap-3 rounded-xl eco-card px-4 py-3 hover:ring-cyan-500/30 transition"
                  >
                    <span className="shrink-0 text-slate-400 group-hover:text-cyan-500" aria-hidden="true">{tm.icon}</span>
                    <span className="flex-1 truncate text-[14px] font-medium text-slate-800 dark:text-slate-200">{r.title}</span>
                    {r.hint && <span className="shrink-0 text-[11.5px] text-slate-400">{r.hint}</span>}
                    <span className="shrink-0 text-[10.5px] uppercase tracking-wide text-slate-300 dark:text-slate-500">{t.cmd[tm.key]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
