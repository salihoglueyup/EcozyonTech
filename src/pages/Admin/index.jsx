import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, PageHeader, StatusBadge } from '@/shared/ui/primitives';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/Toast';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { slugify } from '@/core/data/posts';

const hasFetch = typeof fetch !== 'undefined';
const todayISO = () => new Date().toISOString().slice(0, 10);

// ── Form <-> post mapping ────────────────────────────────────────────────────
// The body is edited as flat rows ({ type, tr, en }); on save each heading row
// gets a single shared id (slugified from EN, falling back to TR) so the TR and
// EN anchor ids stay identical across a language switch.
const blankForm = () => ({
  id: null,
  slug: '',
  date: todayISO(),
  status: 'draft',
  title: { tr: '', en: '' },
  excerpt: { tr: '', en: '' },
  tag: { tr: '', en: '' },
  author: { name: '', role: { tr: '', en: '' } },
  terms: '',
  rows: [{ type: 'paragraph', tr: '', en: '' }],
});

function rowsFromBody(body = {}) {
  const tr = body.tr || [];
  const en = body.en || [];
  const n = Math.max(tr.length, en.length);
  const rows = [];
  for (let i = 0; i < n; i++) {
    const bt = tr[i];
    const be = en[i];
    const isHeading = (bt && typeof bt === 'object') || (be && typeof be === 'object');
    rows.push({
      type: isHeading ? 'heading' : 'paragraph',
      tr: isHeading ? bt?.h || '' : bt || '',
      en: isHeading ? be?.h || '' : be || '',
    });
  }
  return rows.length ? rows : blankForm().rows;
}

function bodyFromRows(rows) {
  const build = (lang) =>
    rows.map((r) =>
      r.type === 'heading' ? { h: r[lang], id: slugify(r.en || r.tr) || 'section' } : r[lang],
    );
  return { tr: build('tr'), en: build('en') };
}

function formFromPost(post) {
  return {
    id: post.id,
    slug: post.slug || '',
    date: post.date || todayISO(),
    status: post.status || 'draft',
    title: { tr: post.title?.tr || '', en: post.title?.en || '' },
    excerpt: { tr: post.excerpt?.tr || '', en: post.excerpt?.en || '' },
    tag: { tr: post.tag?.tr || '', en: post.tag?.en || '' },
    author: { name: post.author?.name || '', role: { tr: post.author?.role?.tr || '', en: post.author?.role?.en || '' } },
    terms: (post.terms || []).join(', '),
    rows: rowsFromBody(post.body),
  };
}

function payloadFromForm(f) {
  return {
    slug: f.slug,
    date: f.date,
    status: f.status,
    title: f.title,
    excerpt: f.excerpt,
    tag: f.tag,
    author: f.author,
    terms: f.terms.split(',').map((t) => t.trim()).filter(Boolean),
    body: bodyFromRows(f.rows),
  };
}

// ── Session ──────────────────────────────────────────────────────────────────
function useAdminSession() {
  const [state, setState] = useState({ status: 'loading', login: null });
  useEffect(() => {
    if (!hasFetch) {
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
  const errorMsg = params.get('error') && a.errors[params.get('error')];
  const { status, login } = useAdminSession();

  const logout = async () => {
    if (hasFetch) {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } catch {
        /* ignore — the reload below reflects the cleared cookie either way */
      }
    }
    if (typeof window !== 'undefined') window.location.assign('/admin');
  };

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-4xl px-6">
        <PageHeader
          eyebrow={a.title}
          title={status === 'in' ? a.title : a.signInTitle}
          intro={status === 'in' ? a.intro : a.signInIntro}
          className="max-w-2xl mb-10"
        />

        {errorMsg && (
          <div role="alert" className="mb-6 rounded-xl px-4 py-3 text-[13.5px] bg-rose-50 dark:bg-rose-500/[.12] text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20">
            {errorMsg}
          </div>
        )}

        {status === 'loading' && <p className="text-[14px] text-slate-500 dark:text-slate-400">{a.loading}</p>}

        {status === 'out' && (
          <a href="/api/admin/login" className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" /></svg>
            {a.signInBtn}
            <ArrowRight />
          </a>
        )}

        {status === 'in' && <Dashboard a={a} login={login} onLogout={logout} />}
      </div>
    </section>
  );
}

// ── Dashboard: list ↔ editor ────────────────────────────────────────────────
function Dashboard({ a, login, onLogout }) {
  const toast = useToast();
  const [posts, setPosts] = useState(null); // null = loading
  const [view, setView] = useState({ mode: 'list', form: null });
  const [pendingDelete, setPendingDelete] = useState(null);

  const refresh = () => {
    if (!hasFetch) {
      setPosts([]);
      return;
    }
    fetch('/api/admin/posts', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => setPosts(Array.isArray(d.posts) ? d.posts : []))
      .catch(() => setPosts([]));
  };
  // refresh() may setState synchronously in the no-fetch (test/SSR) path; that's
  // the intended one-time load, mirroring the session hook above.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(refresh, []);

  const confirmDelete = async () => {
    const id = pendingDelete.id;
    setPendingDelete(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast({ message: a.toast.deleted, type: 'success' });
      refresh();
    } catch {
      toast({ message: a.toast.deleteError, type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">{a.signedInAs.replace('{login}', login)}</p>
        <button type="button" onClick={onLogout} className="text-[12.5px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2">
          {a.logout}
        </button>
      </div>

      {view.mode === 'editor' ? (
        <PostEditor
          a={a}
          initial={view.form}
          onCancel={() => setView({ mode: 'list', form: null })}
          onSaved={() => {
            setView({ mode: 'list', form: null });
            refresh();
          }}
        />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{a.list.heading}</h2>
            <button
              type="button"
              onClick={() => setView({ mode: 'editor', form: blankForm() })}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition"
            >
              {a.list.new}
            </button>
          </div>

          {posts === null && <p className="text-[14px] text-slate-500 dark:text-slate-400">{a.loading}</p>}
          {posts && posts.length === 0 && <p className="rounded-2xl eco-card p-6 text-[14px] text-slate-500 dark:text-slate-400">{a.list.empty}</p>}

          <ul className="space-y-2">
            {(posts || []).map((p) => (
              <li key={p.id ?? p.slug} className="flex items-center gap-4 rounded-2xl eco-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100">{p.title?.tr || p.slug}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-slate-400 font-mono">
                    <span>{p.date}</span>
                    <StatusBadge
                      accent={p.status === 'published' ? '#10B981' : '#F59E0B'}
                      label={p.status === 'published' ? a.list.published : a.list.draft}
                      className="text-[11px]"
                      dotClassName="h-1.5 w-1.5"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => setView({ mode: 'editor', form: formFromPost(p) })} className="text-[12.5px] text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2">
                  {a.list.edit}
                </button>
                <button type="button" onClick={() => setPendingDelete(p)} className="text-[12.5px] text-rose-600 dark:text-rose-400 hover:underline underline-offset-2">
                  {a.list.delete}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {pendingDelete && (
        <Modal onClose={() => setPendingDelete(null)} label={a.confirm.deleteTitle} className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 ring-1 ring-slate-900/[.08] dark:ring-white/[.1] shadow-xl">
          <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{a.confirm.deleteTitle}</h2>
          <p className="mt-2 text-[13.5px] text-slate-600 dark:text-slate-400">{a.confirm.deleteText}</p>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-900/[.05] dark:hover:bg-white/[.06]">
              {a.confirm.deleteCancel}
            </button>
            <button type="button" onClick={confirmDelete} className="rounded-full bg-rose-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-rose-700 transition">
              {a.confirm.deleteConfirm}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Editor form ──────────────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg bg-white/70 dark:bg-white/[.05] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3 py-2 text-[13.5px] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-cyan-500/50';
const labelCls = 'block text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-1';

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function PostEditor({ a, initial, onCancel, onSaved }) {
  const e = a.editor;
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const setRow = (i, patch) =>
    setForm((f) => ({ ...f, rows: f.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) }));
  const addRow = (type) => setForm((f) => ({ ...f, rows: [...f.rows, { type, tr: '', en: '' }] }));
  const removeRow = (i) => setForm((f) => ({ ...f, rows: f.rows.filter((_, j) => j !== i) }));
  const moveRow = (i, dir) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.rows.length) return f;
      const rows = [...f.rows];
      [rows[i], rows[j]] = [rows[j], rows[i]];
      return { ...f, rows };
    });

  const save = async () => {
    setErrors({});
    setSaving(true);
    try {
      const url = form.id ? `/api/admin/posts/${form.id}` : '/api/admin/posts';
      const res = await fetch(url, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadFromForm(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        toast({ message: a.toast.saveError, type: 'error' });
        return;
      }
      toast({ message: a.toast.saved, type: 'success' });
      onSaved();
    } catch {
      toast({ message: a.toast.saveError, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="rounded-2xl eco-card p-6">
      <h2 className="mb-5 font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">
        {form.id ? e.editTitle : e.createTitle}
      </h2>

      {hasErrors && (
        <div role="alert" className="mb-5 rounded-xl px-4 py-2.5 text-[13px] bg-rose-50 dark:bg-rose-500/[.12] text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20">
          {e.fixErrors}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="f-slug" label={`${e.slug} ${errors.slug ? '⚠' : ''}`}>
          <input id="f-slug" className={inputCls} value={form.slug} onChange={(ev) => set({ slug: ev.target.value })} placeholder={e.slugHint} />
        </Field>
        <Field id="f-date" label={`${e.date} ${errors.date ? '⚠' : ''}`}>
          <input id="f-date" type="date" className={inputCls} value={form.date} onChange={(ev) => set({ date: ev.target.value })} />
        </Field>
        <Field id="f-status" label={e.status}>
          <select id="f-status" className={inputCls} value={form.status} onChange={(ev) => set({ status: ev.target.value })}>
            <option value="draft">{e.statusDraft}</option>
            <option value="published">{e.statusPublished}</option>
          </select>
        </Field>
        <Field id="f-terms" label={e.terms}>
          <input id="f-terms" className={inputCls} value={form.terms} onChange={(ev) => set({ terms: ev.target.value })} placeholder={e.termsHint} />
        </Field>
      </div>

      <BilingualField id="title" label={`${e.titleField} ${errors.title ? '⚠' : ''}`} e={e} value={form.title} onChange={(v) => set({ title: v })} />
      <BilingualField id="excerpt" label={`${e.excerpt} ${errors.excerpt ? '⚠' : ''}`} e={e} value={form.excerpt} onChange={(v) => set({ excerpt: v })} textarea />
      <BilingualField id="tag" label={`${e.tag} ${errors.tag ? '⚠' : ''}`} e={e} value={form.tag} onChange={(v) => set({ tag: v })} />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field id="f-author" label={`${e.authorName} ${errors.author ? '⚠' : ''}`}>
          <input id="f-author" className={inputCls} value={form.author.name} onChange={(ev) => set({ author: { ...form.author, name: ev.target.value } })} />
        </Field>
      </div>
      <BilingualField
        id="role"
        label={e.authorRole}
        e={e}
        value={form.author.role}
        onChange={(v) => set({ author: { ...form.author, role: v } })}
      />

      {/* Body blocks */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className={`${labelCls} mb-0`}>{`${e.body} ${errors.body ? '⚠' : ''}`}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => addRow('heading')} className="rounded-full bg-slate-900/[.05] dark:bg-white/[.06] px-3 py-1 text-[12px] text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.1]">{e.addHeading}</button>
            <button type="button" onClick={() => addRow('paragraph')} className="rounded-full bg-slate-900/[.05] dark:bg-white/[.06] px-3 py-1 text-[12px] text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.1]">{e.addParagraph}</button>
          </div>
        </div>
        <ul className="space-y-3">
          {form.rows.map((row, i) => (
            <li key={i} className="rounded-xl ring-1 ring-slate-900/[.08] dark:ring-white/[.08] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">{row.type === 'heading' ? e.heading : e.paragraph}</span>
                <div className="flex gap-1.5 text-[11px] text-slate-400">
                  <button type="button" aria-label={e.moveUp} onClick={() => moveRow(i, -1)} className="hover:text-slate-700 dark:hover:text-slate-200">↑</button>
                  <button type="button" aria-label={e.moveDown} onClick={() => moveRow(i, 1)} className="hover:text-slate-700 dark:hover:text-slate-200">↓</button>
                  <button type="button" aria-label={e.remove} onClick={() => removeRow(i)} className="hover:text-rose-600">✕</button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <RowInput id={`row-${i}-tr`} lang={e.tr} heading={row.type === 'heading'} value={row.tr} onChange={(val) => setRow(i, { tr: val })} />
                <RowInput id={`row-${i}-en`} lang={e.en} heading={row.type === 'heading'} value={row.en} onChange={(val) => setRow(i, { en: val })} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-900/[.05] dark:hover:bg-white/[.06]">{e.cancel}</button>
        <button type="button" onClick={save} disabled={saving} className="rounded-full bg-slate-900 dark:bg-white px-5 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-60 transition">
          {saving ? e.saving : e.save}
        </button>
      </div>
    </div>
  );
}

function BilingualField({ id, label, e, value, onChange, textarea }) {
  return (
    <div className="mt-4">
      <span className={labelCls}>{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        {['tr', 'en'].map((lang) => (
          <div key={lang}>
            <label htmlFor={`${id}-${lang}`} className="sr-only">{`${label} (${e[lang]})`}</label>
            {textarea ? (
              <textarea id={`${id}-${lang}`} rows={2} className={inputCls} value={value[lang]} onChange={(ev) => onChange({ ...value, [lang]: ev.target.value })} placeholder={e[lang]} />
            ) : (
              <input id={`${id}-${lang}`} className={inputCls} value={value[lang]} onChange={(ev) => onChange({ ...value, [lang]: ev.target.value })} placeholder={e[lang]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RowInput({ id, lang, heading, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">{lang}</label>
      {heading ? (
        <input id={id} className={inputCls} value={value} onChange={(ev) => onChange(ev.target.value)} placeholder={lang} />
      ) : (
        <textarea id={id} rows={3} className={inputCls} value={value} onChange={(ev) => onChange(ev.target.value)} placeholder={lang} />
      )}
    </div>
  );
}
