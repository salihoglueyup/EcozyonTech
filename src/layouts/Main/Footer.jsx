import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EcoLogo } from '@/shared/ui/primitives';
import { NAV_ITEMS } from '@/core/config/site';
import { useApp } from '@/app/providers/AppProvider';

export default function Footer() {
  const { t, lang } = useApp();
  return (
    <footer className="relative pt-16 pb-10 mt-8 border-t border-slate-900/[.08]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <EcoLogo />
            <p className="mt-4 max-w-sm text-[14px] text-slate-600 leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] px-3 py-1.5 text-[12px] text-slate-700 hover:text-slate-900">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M3.5 5h2v8h-2zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 4.5 2Zm3 3h2v1.2c.3-.5 1.1-1.4 2.6-1.4 1.8 0 2.4 1 2.4 2.7V13h-2V9.4c0-1.1-.3-1.7-1.2-1.7s-1.5.6-1.5 1.6V13h-2V5Z" /></svg>
                LinkedIn
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] px-3 py-1.5 text-[12px] text-slate-700 hover:text-slate-900">X</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] px-3 py-1.5 text-[12px] text-slate-700 hover:text-slate-900">GitHub</a>
            </div>
          </div>
          <div className="col-span-6 md:col-span-4 lg:col-span-2">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">{t.footer.nav}</div>
            <ul className="space-y-2">
              {NAV_ITEMS.map((it) => (
                <li key={it.path}>
                  <Link to={it.path} className="text-[13px] text-slate-700 hover:text-slate-900">
                    {it.nav[lang] || it.nav.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 md:col-span-4 lg:col-span-2">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">{t.footer.legal}</div>
            <ul className="space-y-2">
              {t.footer.links.legalItems.map((it) => <li key={it}><a href="#" className="text-[13px] text-slate-700 hover:text-slate-900">{it}</a></li>)}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">
              {lang === 'tr' ? 'Bültene abone ol' : 'Subscribe to newsletter'}
            </div>
            <NewsletterForm lang={lang} />
            <div className="mt-4 text-[11.5px] text-slate-500 leading-relaxed">
              {lang === 'tr' ? 'Ürün güncellemeleri ve sürdürülebilirlik analizleri. Spam yok.' : 'Product updates and sustainability briefings. No spam.'}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-900/[.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[11.5px] text-slate-500">{t.footer.rights}</div>
          <div className="text-[11px] text-slate-400 font-mono">v1.0.0 · build 2026.05</div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm({ lang }) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company_website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p role="status" className="text-[12.5px] text-emerald-700 py-2">
        {lang === 'tr' ? '✓ Abone oldun, teşekkürler!' : '✓ Subscribed, thank you!'}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] p-1 pl-3.5 max-w-xs"
    >
      <label className="sr-only" htmlFor="footer-newsletter-email">
        {lang === 'tr' ? 'E-posta' : 'Email'}
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 bg-transparent outline-none text-[12.5px] text-slate-800 placeholder:text-slate-400"
      />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-full bg-slate-900 text-white text-[11.5px] font-medium px-3 py-1.5 hover:bg-slate-800 disabled:opacity-50"
      >
        {status === 'sending' ? '…' : status === 'error' ? '!' : '→'}
      </button>
    </form>
  );
}
