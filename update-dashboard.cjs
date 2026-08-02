const fs = require('fs');

const src = fs.readFileSync('src/pages/Admin/index.jsx', 'utf8');

// Replace max-w-4xl
let out = src.replace('max-w-4xl px-6', 'max-w-6xl px-6');

// Replace Dashboard function
const startTag = '// ── Dashboard: list ↔ editor';
const endTag = '// ── Editor form ──────────────────────────────────────────────────────────────';

const startIndex = out.indexOf(startTag);
const endIndex = out.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('Tags not found');
  process.exit(1);
}

const newDashboard = `// ── Dashboard: list ↔ editor ────────────────────────────────────────────────
function Dashboard({ a, login, onLogout }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [posts, setPosts] = useState(null); 
  const [contacts, setContacts] = useState(null);
  const [careers, setCareers] = useState(null);
  const [newsletter, setNewsletter] = useState(null);
  
  const [view, setView] = useState({ mode: 'list', form: null });
  const [pendingDelete, setPendingDelete] = useState(null);

  const refreshData = () => {
    if (typeof fetch === 'undefined') return;
    fetch('/api/admin/posts').then(r => r.ok ? r.json() : {}).then(d => setPosts(d.posts || [])).catch(() => setPosts([]));
    fetch('/api/admin/contacts').then(r => r.ok ? r.json() : {}).then(d => setContacts(d.contacts || [])).catch(() => setContacts([]));
    fetch('/api/admin/careers').then(r => r.ok ? r.json() : {}).then(d => setCareers(d.careers || [])).catch(() => setCareers([]));
    fetch('/api/admin/newsletter').then(r => r.ok ? r.json() : {}).then(d => setNewsletter(d.subscribers || [])).catch(() => setNewsletter([]));
  };

  useEffect(() => { refreshData(); }, []);

  const confirmDelete = async () => {
    const { id, type } = pendingDelete;
    setPendingDelete(null);
    try {
      const res = await fetch(\`/api/admin/\${type}/\${id}\`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast({ message: 'Başarıyla silindi.', type: 'success' });
      refreshData();
    } catch {
      toast({ message: 'Silinirken bir hata oluştu.', type: 'error' });
    }
  };

  const markAsRead = async (id, type) => {
    try {
      await fetch(\`/api/admin/\${type}/\${id}\`, { method: 'PUT' });
      refreshData();
    } catch {}
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
                <button type="button" onClick={() => setView({ mode: 'editor', form: formFromPost(p) })} className="text-[12.5px] text-cyan-700 dark:text-cyan-400 hover:underline">Düzenle</button>
                <button type="button" onClick={() => handleDelete(p.id, 'posts')} className="text-[12.5px] text-rose-600 dark:text-rose-400 hover:underline">Sil</button>
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
            <div key={c.id} className={\`rounded-2xl eco-card p-5 border-l-4 \${c.status === 'unread' ? 'border-l-emerald-500' : 'border-l-slate-200 dark:border-l-slate-800'}\`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-display text-[16px] text-slate-900 dark:text-white flex items-center gap-2">
                    {c.name} <span className="text-sm font-normal text-slate-500">({c.company})</span>
                    {c.status === 'unread' && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Yeni</span>}
                  </h3>
                  <a href={\`mailto:\${c.email}\`} className="text-[13px] text-emerald-600 dark:text-emerald-400 hover:underline">{c.email}</a>
                </div>
                <div className="text-right flex gap-3 text-[12px]">
                  {c.status === 'unread' && <button onClick={() => markAsRead(c.id, 'contacts')} className="text-slate-500 hover:text-emerald-500">Okundu işaretle</button>}
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
            <div key={c.id} className={\`rounded-2xl eco-card p-5 border-l-4 \${c.status === 'unread' ? 'border-l-cyan-500' : 'border-l-slate-200 dark:border-l-slate-800'}\`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-display text-[16px] text-slate-900 dark:text-white flex items-center gap-2">
                    {c.name}
                    {c.status === 'unread' && <span className="text-[10px] bg-cyan-500 text-white px-2 py-0.5 rounded-full">Yeni</span>}
                  </h3>
                  <a href={\`mailto:\${c.email}\`} className="text-[13px] text-cyan-600 dark:text-cyan-400 hover:underline">{c.email}</a>
                </div>
                <div className="text-right flex gap-3 text-[12px]">
                  {c.status === 'unread' && <button onClick={() => markAsRead(c.id, 'careers')} className="text-slate-500 hover:text-cyan-500">İncelendi işaretle</button>}
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
          <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100 mb-4">E-Bülten Aboneleri</h2>
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
      className={\`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all \${
        active 
          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }\`}
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
        <div className={\`p-2 rounded-xl \${active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}\`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
      {active && <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-xl bg-emerald-500" />}
    </div>
  );
}

// ── Editor form ──────────────────────────────────────────────────────────────`;

out = out.slice(0, startIndex) + newDashboard + out.slice(endIndex + endTag.length);

fs.writeFileSync('src/pages/Admin/index.jsx', out);
console.log('Replaced successfully');
