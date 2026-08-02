import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, PageHeader, StatusBadge } from '@/shared/ui/primitives';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/Toast';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { slugify } from '@/core/data/posts';
import { JobEditor } from './JobEditor';

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
      <div className="mx-auto max-w-6xl px-6">
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
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(fd))
              });
              if (res.ok) window.location.reload();
              else alert('Hatalı giriş');
            }} 
            className="space-y-4 max-w-sm"
          >
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">E-posta</label>
              <input name="email" type="email" required className="w-full rounded-lg bg-white/70 dark:bg-white/[.05] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3 py-2 text-[13.5px] text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">Şifre</label>
              <input name="password" type="password" required className="w-full rounded-lg bg-white/70 dark:bg-white/[.05] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3 py-2 text-[13.5px] text-slate-900 dark:text-white" />
            </div>
            <button type="submit" className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
              {a.signInBtn} <ArrowRight />
            </button>
          </form>
        )}

        {status === 'in' && <Dashboard a={a} login={login} onLogout={logout} />}
      </div>
    </section>
  );
}

// ── Dashboard: list ↔ editor ────────────────────────────────────────────────
function Dashboard({ a, login, onLogout }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [posts, setPosts] = useState(null); 
  const [contacts, setContacts] = useState(null);
  const [careers, setCareers] = useState(null);
  const [newsletter, setNewsletter] = useState(null);
  const [jobs, setJobs] = useState(null);
  
  const [view, setView] = useState({ mode: 'list', form: null });
  const [pendingDelete, setPendingDelete] = useState(null);

  const refreshData = () => {
    if (typeof fetch === 'undefined') return;
    fetch('/api/admin/posts').then(r => r.ok ? r.json() : {}).then(d => setPosts(d.posts || [])).catch(() => setPosts([]));
    fetch('/api/admin/contacts').then(r => r.ok ? r.json() : {}).then(d => setContacts(d.contacts || [])).catch(() => setContacts([]));
    fetch('/api/admin/careers').then(r => r.ok ? r.json() : {}).then(d => setCareers(d.careers || [])).catch(() => setCareers([]));
    fetch('/api/admin/newsletter').then(r => r.ok ? r.json() : {}).then(d => setNewsletter(d.subscribers || [])).catch(() => setNewsletter([]));
    fetch('/api/admin/jobs').then(r => r.ok ? r.json() : {}).then(d => setJobs(d.jobs || [])).catch(() => setJobs([]));
  };

  useEffect(() => { refreshData(); }, []);

  const confirmDelete = async () => {
    const { id, type } = pendingDelete;
    setPendingDelete(null);
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast({ message: 'Başarıyla silindi.', type: 'success' });
      refreshData();
    } catch {
      toast({ message: 'Silinirken bir hata oluştu.', type: 'error' });
    }
  };

  const markAsRead = async (id, type) => {
    try {
      await fetch(`/api/admin/${type}/${id}`, { method: 'PUT' });
      refreshData();
    } catch {}
  };

  const updateStatus = async (id, type, status) => {
    try {
      await fetch(`/api/admin/${type}/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      refreshData();
    } catch {}
  };

  const handleReply = async (id, email) => {
    const message = prompt(`Reply to ${email}:`);
    if (!message) return;
    try {
      await fetch(`/api/admin/contacts/${id}/reply`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message })
      });
      alert('Reply sent successfully!');
      refreshData();
    } catch {
      alert('Failed to send reply.');
    }
  };

  const handleBroadcast = async () => {
    const subject = prompt('Kampanya Konusu (Subject):');
    if (!subject) return;
    const message = prompt('Kampanya Mesajı (Text):');
    if (!message) return;
    
    if (!confirm('Bu mesaj TÜM abonelere gönderilecektir. Emin misiniz?')) return;

    try {
      const res = await fetch('/api/admin/newsletter/broadcast', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message })
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Başarıyla ${data.count} aboneye gönderildi! ${data.demo ? '(Demo Mod)' : ''}`);
      } else {
        alert('Gönderim başarısız: ' + data.error);
      }
    } catch {
      alert('Ağ hatası oluştu.');
    }
  };

  const pressReleases = (posts || []).filter(p => p.tag?.en === 'Press Release');
  const normalPosts = (posts || []).filter(p => p.tag?.en !== 'Press Release');

  const handleDelete = (id, type) => setPendingDelete({ id, type });

  const renderContent = () => {
    if (view.mode === 'editor') {
      return (
        <PostEditor
          a={a}
          initial={view.form}
          onCancel={() => setView({ mode: 'list', form: null })}
          onSaved={() => { setView({ mode: 'list', form: null }); refreshData(); }}
        />
      );
    }
    if (view.mode === 'job-editor') {
      return (
        <JobEditor
          a={a}
          initial={view.form}
          onCancel={() => setView({ mode: 'list', form: null })}
          onSaved={() => { setView({ mode: 'list', form: null }); refreshData(); }}
        />
      );
    }

    if (activeTab === 'overview') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Gelen Mesajlar" count={contacts?.length ?? '-'} icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" active={contacts?.some(c => c.status === 'unread')} />
          <StatCard title="Kariyer Başvuruları" count={careers?.length ?? '-'} icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" active={careers?.some(c => c.status === 'unread')} />
          <StatCard title="E-Bülten Aboneleri" count={newsletter?.length ?? '-'} icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          <StatCard title="Blog & Basın" count={posts?.length ?? '-'} icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </div>
      );
    }

    if (activeTab === 'posts' || activeTab === 'press') {
      const isPress = activeTab === 'press';
      const items = isPress ? pressReleases : normalPosts;
      const tHeading = isPress ? 'Basın Bültenleri' : 'Blog & Haberler';
      const defaultForm = blankForm();
      if (isPress) defaultForm.tag = { tr: 'Basın Bülteni', en: 'Press Release' };

      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{tHeading}</h2>
            <button type="button" onClick={() => setView({ mode: 'editor', form: defaultForm })} className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
              Yeni Ekle
            </button>
          </div>
          <ul className="space-y-2">
            {items.map(p => (
              <li key={p.id ?? p.slug} className="flex items-center gap-4 rounded-2xl eco-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100">{p.title?.tr || p.slug}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-slate-400 font-mono">
                    <span>{p.date}</span>
                    <StatusBadge accent={p.status === 'published' ? '#10B981' : '#F59E0B'} label={p.status === 'published' ? 'Yayında' : 'Taslak'} className="text-[11px]" dotClassName="h-1.5 w-1.5" />
                  </div>
                </div>
                  <div className="flex gap-4">
                    <a href={isPress ? `/press/${p.slug}?preview=true` : `/blog/${p.slug}?preview=true`} target="_blank" rel="noreferrer" className="text-[12.5px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Önizle</a>
                    <button type="button" onClick={() => setView({ mode: 'editor', form: formFromPost(p) })} className="text-[12.5px] text-cyan-700 dark:text-cyan-400 hover:underline">Düzenle</button>
                    {p.id && <button type="button" onClick={() => handleDelete(p.id, 'posts')} className="text-[12.5px] text-rose-500 hover:underline">Sil</button>}
                  </div>
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (activeTab === 'jobsList') {
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">Açık Pozisyonlar</h2>
            <button type="button" onClick={() => setView({ mode: 'job-editor', form: null })} className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
              Yeni Ekle
            </button>
          </div>
          <ul className="space-y-2">
            {jobs?.map(j => (
              <li key={j.id ?? j.slug} className="flex items-center gap-4 rounded-2xl eco-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100">{j.title?.tr || j.slug}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-slate-400 font-mono">
                    <StatusBadge accent={j.status === 'published' ? '#10B981' : '#F59E0B'} label={j.status === 'published' ? 'Yayında' : 'Taslak'} className="text-[11px]" dotClassName="h-1.5 w-1.5" />
                  </div>
                </div>
                <button type="button" onClick={() => setView({ mode: 'job-editor', form: j })} className="text-[12.5px] text-cyan-700 dark:text-cyan-400 hover:underline">Düzenle</button>
                <button type="button" onClick={() => handleDelete(j.id, 'jobs')} className="text-[12.5px] text-rose-600 dark:text-rose-400 hover:underline">Sil</button>
              </li>
            ))}
          </ul>
        </>
      );
    }

    if (activeTab === 'contacts') {
      return (
        <div className="space-y-4">
          <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100 mb-4">Gelen Mesajlar</h2>
          {contacts?.map(c => (
            <div key={c.id} className={`rounded-2xl eco-card p-5 border-l-4 ${c.status === 'unread' ? 'border-l-emerald-500' : 'border-l-slate-200 dark:border-l-slate-800'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-display text-[16px] text-slate-900 dark:text-white flex items-center gap-2">
                    {c.name} <span className="text-sm font-normal text-slate-500">({c.company})</span>
                    {c.status === 'unread' && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Yeni</span>}
                    {c.status === 'in_progress' && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">İşlemde</span>}
                    {c.status === 'resolved' && <span className="text-[10px] bg-cyan-500 text-white px-2 py-0.5 rounded-full">Çözüldü</span>}
                  </h3>
                  <a href={`mailto:${c.email}`} className="text-[13px] text-emerald-600 dark:text-emerald-400 hover:underline">{c.email}</a>
                </div>
                <div className="text-right flex gap-3 text-[12px] items-center">
                  <select 
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, 'contacts', e.target.value)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded outline-none text-slate-600 dark:text-slate-300 px-2 py-1"
                  >
                    <option value="unread">Okunmadı</option>
                    <option value="read">Okundu</option>
                    <option value="in_progress">İşlemde</option>
                    <option value="resolved">Çözüldü</option>
                  </select>
                  <button onClick={() => handleReply(c.id, c.email)} className="text-cyan-500 hover:text-cyan-400">Yanıtla</button>
                  <button onClick={() => handleDelete(c.id, 'contacts')} className="text-rose-500 hover:underline">Sil</button>
                </div>
              </div>
              <div className="mt-2 text-[12px] uppercase tracking-widest text-slate-400 font-semibold">{c.purpose}</div>
              <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{c.message}</div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'careers') {
      return (
        <div className="space-y-4">
          <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100 mb-4">Kariyer Başvuruları</h2>
          {careers?.map(c => (
            <div key={c.id} className={`rounded-2xl eco-card p-5 border-l-4 ${c.status === 'unread' ? 'border-l-cyan-500' : 'border-l-slate-200 dark:border-l-slate-800'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-display text-[16px] text-slate-900 dark:text-white flex items-center gap-2">
                    {c.name}
                    {c.status === 'unread' && <span className="text-[10px] bg-cyan-500 text-white px-2 py-0.5 rounded-full">Yeni</span>}
                    {c.status === 'reviewing' && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">İnceleniyor</span>}
                    {c.status === 'interview' && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full">Mülakat</span>}
                    {c.status === 'hired' && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">İşe Alındı</span>}
                    {c.status === 'rejected' && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">Reddedildi</span>}
                  </h3>
                  <a href={`mailto:${c.email}`} className="text-[13px] text-cyan-600 dark:text-cyan-400 hover:underline">{c.email}</a>
                </div>
                <div className="text-right flex gap-3 text-[12px] items-center">
                  <select 
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, 'careers', e.target.value)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded outline-none text-slate-600 dark:text-slate-300 px-2 py-1"
                  >
                    <option value="unread">Okunmadı</option>
                    <option value="reviewing">İnceleniyor</option>
                    <option value="interview">Mülakat</option>
                    <option value="hired">İşe Alındı</option>
                    <option value="rejected">Reddedildi</option>
                  </select>
                  <button onClick={() => handleDelete(c.id, 'careers')} className="text-rose-500 hover:underline">Sil</button>
                </div>
              </div>
              <div className="mt-2 text-[12px] uppercase tracking-widest text-slate-400 font-semibold">Pozisyon: {c.role}</div>
              <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{c.note}</div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'newsletter') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">E-Bülten Aboneleri</h2>
            <button onClick={handleBroadcast} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] px-4 py-2 rounded-full font-medium transition-colors">
              Kampanya (Toplu E-posta) Gönder
            </button>
          </div>
          <ul className="space-y-2">
            {newsletter?.map(n => (
              <li key={n.id} className="flex justify-between items-center rounded-2xl eco-card p-4">
                <div className="font-mono text-[13px] text-slate-900 dark:text-slate-100">{n.email}</div>
                <div className="flex items-center gap-4">
                  <div className="text-[11px] text-slate-400">{new Date(n.created_at).toLocaleDateString()}</div>
                  <button onClick={() => handleDelete(n.id, 'newsletter')} className="text-[12.5px] text-rose-500 hover:underline">Sil</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-56 shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div className="text-[12px] font-semibold text-slate-500">ADMIN PANELİ</div>
          <button onClick={onLogout} className="text-[12px] text-rose-500 hover:underline">Çıkış</button>
        </div>
        <nav className="space-y-1">
          <TabButton id="overview" label="Genel Bakış" icon="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" current={activeTab} set={setActiveTab} />
          <TabButton id="posts" label="Blog & Haberler" icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" current={activeTab} set={setActiveTab} />
          <TabButton id="press" label="Basın Bültenleri" icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L14.5 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-1z" current={activeTab} set={setActiveTab} />
          <TabButton id="contacts" label="Gelen Mesajlar" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" current={activeTab} set={setActiveTab} badge={contacts?.some(c => c.status === 'unread')} />
          <TabButton id="careers" label="Kariyer Başvuruları" icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" current={activeTab} set={setActiveTab} badge={careers?.some(c => c.status === 'unread')} />
          <TabButton id="jobsList" label="Açık Pozisyonlar" icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" current={activeTab} set={setActiveTab} />
          <TabButton id="newsletter" label="E-Bülten Aboneleri" icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" current={activeTab} set={setActiveTab} />
        </nav>
      </div>

      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>

      {pendingDelete && (
        <Modal onClose={() => setPendingDelete(null)} label="Silmeyi Onayla" className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 ring-1 ring-slate-900/[.08] dark:ring-white/[.1] shadow-xl">
          <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">Silmeyi Onayla</h2>
          <p className="mt-2 text-[13.5px] text-slate-600 dark:text-slate-400">Bu öğeyi silmek istediğinize emin misiniz? Geri alınamaz.</p>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => setPendingDelete(null)} className="rounded-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-900/[.05] dark:hover:bg-white/[.06]">İptal</button>
            <button type="button" onClick={confirmDelete} className="rounded-full bg-rose-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-rose-700 transition">Sil</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TabButton({ id, label, icon, current, set, badge }) {
  const active = current === id;
  return (
    <button
      onClick={() => set(id)}
      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
        active 
          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        {label}
      </div>
      {badge && <span className="w-2 h-2 rounded-full bg-rose-500" />}
    </button>
  );
}

function StatCard({ title, count, icon, active }) {
  return (
    <div className="rounded-2xl eco-card p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11.5px] uppercase tracking-wide font-semibold text-slate-500 mb-1">{title}</div>
          <div className="font-display text-[28px] tracking-tight text-slate-900 dark:text-white">{count}</div>
        </div>
        <div className={`p-2 rounded-xl ${active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
      {active && <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-xl bg-emerald-500" />}
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
  const { lang } = useApp();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  // Auto-derive the slug from the EN title until the editor touches it by hand.
  // Editing an existing post starts "touched" so we never clobber its slug.
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => {
    if (slugTouched) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => ({ ...f, slug: slugify(f.title.en) }));
  }, [form.title.en, slugTouched]);

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
      // Surface the social-publish result (silently dropped before): on publish
      // the API returns published.social = [{provider,posted,demo,error}].
      const li = data.published?.social?.find((s) => s.provider === 'linkedin');
      if (li?.posted) toast({ message: a.toast.linkedinPosted, type: 'success' });
      else if (li?.demo) toast({ message: a.toast.linkedinDemo, type: 'info' });
      else if (li) toast({ message: a.toast.linkedinError, type: 'error' });
      onSaved();
    } catch {
      toast({ message: a.toast.saveError, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;
  // Light client-side gate that complements the server's 422: every required
  // bilingual field present + at least one non-empty body row.
  const canSave = Boolean(
    form.title.tr && form.title.en &&
      form.excerpt.tr && form.excerpt.en &&
      form.tag.tr && form.tag.en &&
      form.author.name.trim() &&
      form.rows.some((r) => (r.tr || '').trim() || (r.en || '').trim()),
  );

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
          <input id="f-slug" className={inputCls} value={form.slug} onChange={(ev) => { set({ slug: ev.target.value }); setSlugTouched(true); }} placeholder={e.slugHint} />
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

      {preview && (
        <div className="mt-6 rounded-xl ring-1 ring-cyan-500/20 bg-cyan-500/[.03] p-5">
          <div className="mb-3 text-[11px] uppercase tracking-wide font-semibold text-cyan-700 dark:text-cyan-400">{e.preview}</div>
          <h3 className="font-display text-[22px] tracking-tight text-slate-900 dark:text-slate-100">{form.title[lang] || '—'}</h3>
          {form.excerpt[lang] && <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">{form.excerpt[lang]}</p>}
          <div className="mt-4 space-y-4">
            {bodyFromRows(form.rows)[lang].map((b, i) =>
              typeof b === 'object' && b ? (
                <h2 key={i} id={b.id} className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{b.h}</h2>
              ) : (
                <p key={i} className="text-[15px] text-slate-700 dark:text-slate-300 leading-[1.7]">{b}</p>
              ),
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          aria-pressed={preview}
          className="rounded-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 ring-1 ring-slate-900/[.1] dark:ring-white/[.1] hover:ring-cyan-500/30 transition"
        >
          {e.preview}
        </button>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-900/[.05] dark:hover:bg-white/[.06]">{e.cancel}</button>
          <button type="button" onClick={save} disabled={saving || !canSave} className="rounded-full bg-slate-900 dark:bg-white px-5 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-60 transition">
            {saving ? e.saving : e.save}
          </button>
        </div>
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
