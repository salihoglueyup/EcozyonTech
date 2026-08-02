import { useState, useEffect } from 'react';
import { useApp } from '@/app/providers/AppProvider';
import { useToast } from '@/shared/ui/Toast';

const inputCls = 'w-full rounded-lg bg-white/70 dark:bg-white/[.05] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3 py-2 text-[13.5px] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-cyan-500/50';
const labelCls = 'block text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-1';

const blankJob = () => ({
  id: null,
  slug: '',
  status: 'draft',
  team: { tr: '', en: '' },
  type: { tr: '', en: '' },
  location: { tr: '', en: '' },
  level: { tr: '', en: '' },
  title: { tr: '', en: '' },
  desc: { tr: '', en: '' },
  responsibilities: { tr: [''], en: [''] },
  requirements: { tr: [''], en: [''] },
});

export function JobEditor({ a, initial, onCancel, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(initial || blankJob());
  const [saving, setSaving] = useState(false);

  const set = (patch) => setForm(f => ({ ...f, ...patch }));
  
  const save = async () => {
    setSaving(true);
    try {
      const url = form.id ? `/api/admin/jobs/${form.id}` : '/api/admin/jobs';
      const res = await fetch(url, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      toast({ message: 'Başarıyla kaydedildi.', type: 'success' });
      onSaved();
    } catch {
      toast({ message: 'Kaydedilirken hata oluştu.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl eco-card p-6">
      <h2 className="mb-5 font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">İlan {form.id ? 'Düzenle' : 'Oluştur'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Slug</label>
          <input className={inputCls} value={form.slug} onChange={e => set({ slug: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Durum</label>
          <select className={inputCls} value={form.status} onChange={e => set({ status: e.target.value })}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>
      <BilingualField label="Başlık" value={form.title} onChange={v => set({ title: v })} />
      <BilingualField label="Açıklama" value={form.desc} onChange={v => set({ desc: v })} textarea />
      <div className="grid gap-4 sm:grid-cols-2">
        <BilingualField label="Takım" value={form.team} onChange={v => set({ team: v })} />
        <BilingualField label="Tip" value={form.type} onChange={v => set({ type: v })} />
        <BilingualField label="Konum" value={form.location} onChange={v => set({ location: v })} />
        <BilingualField label="Seviye" value={form.level} onChange={v => set({ level: v })} />
      </div>
      
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-900/[.05] dark:hover:bg-white/[.06]">İptal</button>
        <button type="button" onClick={save} disabled={saving} className="rounded-full bg-slate-900 dark:bg-white px-5 py-2 text-[13px] font-medium text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-60 transition">
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}

function BilingualField({ label, value, onChange, textarea }) {
  return (
    <div className="mt-4">
      <span className={labelCls}>{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        {['tr', 'en'].map(l => (
          <div key={l}>
            {textarea ? (
              <textarea rows={2} className={inputCls} value={value[l]} onChange={e => onChange({...value, [l]: e.target.value})} placeholder={l.toUpperCase()} />
            ) : (
              <input className={inputCls} value={value[l]} onChange={e => onChange({...value, [l]: e.target.value})} placeholder={l.toUpperCase()} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
