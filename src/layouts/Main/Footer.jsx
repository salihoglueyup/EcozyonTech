import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EcoLogo } from '@/shared/ui/primitives';
import { FOOTER_ITEMS } from '@/core/config/site';
import { useApp } from '@/app/providers/AppProvider';
import { ECO_I18N } from '@/core/i18n/dictionary';

export default function Footer() {
  const { t, lang } = useApp();
  const newsletterP = t.contact.emailP;
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
              {FOOTER_ITEMS.filter((it) => it.key !== 'legal').map((it) => (
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
              <li>
                <Link to="/legal#privacy" className="text-[13px] text-slate-700 hover:text-slate-900">
                  {lang === 'tr' ? 'Gizlilik (KVKK)' : 'Privacy'}
                </Link>
              </li>
              <li>
                <Link to="/legal#terms" className="text-[13px] text-slate-700 hover:text-slate-900">
                  {lang === 'tr' ? 'Kullanım Şartları' : 'Terms'}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">
              {lang === 'tr' ? 'Bültene abone ol' : 'Subscribe to newsletter'}
            </div>
            <NewsletterForm lang={lang} placeholder={newsletterP} />
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

function NewsletterForm({ lang, placeholder }) {
  // Get t locally so the form can show the same rate-limit copy as Contact.
  const tDict = ECO_I18N[lang] || ECO_I18N.tr;
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | limited
  const [retryAfterSec, setRetryAfterSec] = useState(0);

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
      } else if (res.status === 429) {
        setRetryAfterSec(Math.ceil((data.retryAfterMs || 60_000) / 1000));
        setStatus('limited');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 ring-1 ring-emerald-500/20 text-emerald-700 px-3 py-1.5 text-[12.5px] font-medium animate-[fadeUp_.32s_ease-out]"
      >
        <span
          className="inline-flex items-center justify-center h-4 w-4 rounded-full text-white"
          style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M2 6.4l2.8 2.6L10 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {lang === 'tr' ? 'Abone oldun, teşekkürler!' : 'Subscribed, thank you!'}
      </div>
    );
  }

  return (
    <div>
    <form
      onSubmit={onSubmit}
      className={`flex items-center gap-2 rounded-full bg-white/70 border p-1 pl-3.5 max-w-xs transition-colors ${
        status === 'error' || status === 'limited'
          ? 'border-rose-500/40 animate-[shake_.32s_ease]'
          : 'border-slate-900/[.08]'
      }`}
    >
      <label className="sr-only" htmlFor="footer-newsletter-email">
        {lang === 'tr' ? 'E-posta' : 'Email'}
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
        placeholder={placeholder}
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
        aria-label={lang === 'tr' ? 'Abone ol' : 'Subscribe'}
        className={`rounded-full text-white text-[11.5px] font-medium px-3 py-1.5 disabled:opacity-60 transition-colors ${
          status === 'error' || status === 'limited' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-slate-900 hover:bg-slate-800'
        }`}
      >
        {status === 'sending' ? (
          <span className="inline-block h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden />
        ) : status === 'error' || status === 'limited' ? (
          '!'
        ) : (
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M3 7h8m-3-3 3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
    {status === 'limited' && (
      <p role="status" aria-live="polite" className="mt-2 text-[11.5px] text-rose-600 max-w-xs">
        {tDict.contact.rateLimited.replace('{s}', retryAfterSec)}
      </p>
    )}
    </div>
  );
}
