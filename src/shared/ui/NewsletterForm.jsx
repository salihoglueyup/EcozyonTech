import { useId, useState } from 'react';
import { ECO_I18N } from '@/core/i18n/dictionary';
import { track } from '@/core/lib/telemetry';

// Newsletter subscribe form, posting to /api/newsletter with honeypot +
// rate-limit handling. Shared between the footer and the end of blog posts,
// so the input id is generated (useId) to stay unique across instances.
export default function NewsletterForm({ lang, placeholder }) {
  // Get t locally so the form can show the same rate-limit copy as Contact.
  const tDict = ECO_I18N[lang] || ECO_I18N.tr;
  const fieldId = useId();
  const msgId = useId();
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
        track('newsletter_signup', { source: 'newsletter' });
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
      className={`flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[.06] border p-1 pl-3.5 max-w-xs transition-colors ${
        status === 'error' || status === 'limited'
          ? 'border-rose-500/40 animate-[shake_.32s_ease]'
          : 'border-slate-900/[.08] dark:border-white/[.1]'
      }`}
    >
      <label className="sr-only" htmlFor={fieldId}>
        {lang === 'tr' ? 'E-posta' : 'Email'}
      </label>
      <input
        id={fieldId}
        type="email"
        required
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
        placeholder={placeholder}
        aria-invalid={status === 'error' || status === 'limited'}
        aria-describedby={status === 'limited' ? msgId : undefined}
        className="flex-1 bg-transparent outline-none text-[12.5px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
      <p id={msgId} role="status" aria-live="polite" className="mt-2 text-[11.5px] text-rose-600 max-w-xs">
        {tDict.contact.rateLimited.replace('{s}', retryAfterSec)}
      </p>
    )}
    </div>
  );
}
