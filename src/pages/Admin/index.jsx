import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, PageHeader } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';

// Read the current admin session from /api/admin/me. Returns 'loading' until the
// check settles, then 'in' (with a login) or 'out'. fetch is guarded so the page
// renders in non-browser test environments too.
function useAdminSession() {
  const [state, setState] = useState({ status: 'loading', login: null });
  useEffect(() => {
    if (typeof fetch === 'undefined') {
      setState({ status: 'out', login: null }); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let alive = true;
    fetch('/api/admin/me', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setState({ status: d?.login ? 'in' : 'out', login: d?.login || null }))
      .catch(() => alive && setState({ status: 'out', login: null }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export default function AdminPage() {
  const { t } = useApp();
  const a = t.admin;
  useDocumentMeta(`${a.title} — Ecozyon Tech`, a.signInIntro);
  const [params] = useSearchParams();
  const errorKey = params.get('error');
  const errorMsg = errorKey && a.errors[errorKey];
  const { status, login } = useAdminSession();

  const logout = async () => {
    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } catch {
        /* ignore — reload below reflects the cleared cookie either way */
      }
    }
    if (typeof window !== 'undefined') window.location.assign('/admin');
  };

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <PageHeader
          eyebrow={a.title}
          title={status === 'in' ? a.title : a.signInTitle}
          intro={status === 'in' ? a.intro : a.signInIntro}
          className="max-w-2xl mb-10"
        />

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 rounded-xl px-4 py-3 text-[13.5px] bg-rose-50 dark:bg-rose-500/[.12] text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20"
          >
            {errorMsg}
          </div>
        )}

        {status === 'loading' && (
          <p className="text-[14px] text-slate-500 dark:text-slate-400">{a.loading}</p>
        )}

        {status === 'out' && (
          <a
            href="/api/admin/login"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
            {a.signInBtn}
            <ArrowRight />
          </a>
        )}

        {status === 'in' && (
          <div className="rounded-2xl eco-card p-6">
            <p className="text-[14px] text-slate-700 dark:text-slate-300">
              {a.signedInAs.replace('{login}', login)}
            </p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[.05] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] px-4 py-2 text-[13px] text-slate-700 dark:text-slate-300 hover:ring-cyan-500/30 transition"
            >
              {a.logout}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
