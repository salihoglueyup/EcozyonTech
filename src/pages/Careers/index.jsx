import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { useFocusTrap } from '@/shared/ui/useFocusTrap';
import { useToast } from '@/shared/ui/Toast';
import { routeByKey, SITE } from '@/core/config/site';
import { JOBS, jobTeams, filterByTeam, searchJobs, jobById } from '@/core/data/jobs';

const meta = routeByKey('careers');
const TEAMS = jobTeams(JOBS);

export default function CareersPage() {
  const { lang, t } = useApp();
  const tr = lang === 'tr';
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [openJob, setOpenJob] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [query, setQuery] = useState('');

  const scoped = filterByTeam(JOBS, activeTeam);
  const visible = searchJobs(scoped, query, lang);

  // Keep ?job= in sync with the open modal so a role is deep-linkable.
  // Opening pushes a history entry (shareable/back-navigable); closing
  // replaces it so the back button doesn't just reopen the modal.
  const setJobParam = useCallback(
    (id) => {
      const next = new URLSearchParams(params);
      if (id) next.set('job', id);
      else next.delete('job');
      setParams(next, { replace: !id });
    },
    [params, setParams],
  );

  const openRole = useCallback((job) => { setOpenJob(job); setJobParam(job.id); }, [setJobParam]);
  const closeRole = useCallback(() => { setOpenJob(null); setJobParam(null); }, [setJobParam]);

  // URL is the source of truth for the open role: a shared ?job= link, the
  // back button, or a ⌘K jump to /careers?job= all reconcile here. Reading the
  // param post-mount keeps the prerendered HTML free of modal state.
  const jobParam = params.get('job');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenJob(jobById(jobParam) || null);
  }, [jobParam]);

  const shareRole = useCallback(
    async (job) => {
      if (typeof window === 'undefined') return;
      try {
        await navigator.clipboard.writeText(`${SITE.url}/careers?job=${job.id}`);
        toast({ message: t.careers.linkCopied, type: 'success' });
      } catch {
        toast({ message: t.careers.shareError, type: 'error' });
      }
    },
    [toast, t],
  );
  useDocumentMeta(
    meta.title[lang],
    tr
      ? 'Ecozyon Tech ekibine katıl — mühendis arıyoruz.'
      : 'Join the Ecozyon Tech team — we are hiring engineers.',
  );

  const perks = tr
    ? ['Uzaktan-öncelikli', 'Donanım + yazılım', 'Öğrenme bütçesi', 'Etki odaklı misyon']
    : ['Remote-first', 'Hardware + software', 'Learning budget', 'Impact-driven mission'];

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-10">
          <Tag color="cyan">// {tr ? 'Kariyer' : 'Careers'}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {tr ? 'Daha akıllı, ' : 'Build a smarter, '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {tr ? 'temiz bir gelecek kur' : 'cleaner future'}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {tr
              ? '14 kişilik bir ekibiz — İstanbul, Berlin ve uzaktan. Donanımdan AI’a etki yaratan işler yapıyoruz.'
              : 'A team of 14 — Istanbul, Berlin and remote. We do impactful work from hardware to AI.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {perks.map((p) => (
              <span key={p} className="rounded-full bg-slate-900/[.05] px-2.5 py-1 text-[12px] text-slate-700 dark:text-slate-300 font-medium">{p}</span>
            ))}
          </div>
        </div>

        <div className="mb-5 relative max-w-sm">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.careers.searchP}
            aria-label={t.careers.searchLabel}
            className="w-full rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] pl-10 pr-4 py-2.5 text-[13px] text-slate-800 dark:text-slate-200 outline-none focus:ring-cyan-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t.careers.filterLabel}>
          {[{ id: null, label: { tr: t.careers.filterAll, en: t.careers.filterAll } }, ...TEAMS].map((tm) => {
            const on = activeTeam === tm.id;
            return (
              <button
                key={tm.id ?? 'all'}
                type="button"
                onClick={() => setActiveTeam(tm.id)}
                aria-pressed={on}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ring-1 transition ${
                  on
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-slate-900 dark:ring-white'
                    : 'bg-white/70 dark:bg-white/[.06] text-slate-700 dark:text-slate-300 ring-slate-900/[.08] dark:ring-white/[.1] hover:ring-cyan-500/30'
                }`}
              >
                {tm.label[lang]}
              </button>
            );
          })}
        </div>

        <div className="mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400" aria-live="polite">
          {t.careers.openRoles.replace('{n}', visible.length)}
        </div>

        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="rounded-2xl eco-card p-8 text-center text-[13.5px] text-slate-500 dark:text-slate-400">
              {t.careers.noResults}
            </div>
          )}
          {visible.map((j) => (
            <div key={j.id} className="rounded-2xl eco-card p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-500/15 px-2 py-0.5 font-semibold">{j.team[lang]}</span>
                  <span className="text-slate-500 dark:text-slate-400">{j.type[lang]}</span>
                </div>
                <h2 className="mt-2 font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100">{j.title[lang]}</h2>
                <p className="mt-1 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{j.desc[lang]}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => shareRole(j)}
                  aria-label={t.careers.share}
                  title={t.careers.share}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:ring-cyan-500/30 transition"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="12" cy="3.5" r="1.8" /><circle cx="4" cy="8" r="1.8" /><circle cx="12" cy="12.5" r="1.8" />
                    <path d="M5.6 7.1 10.4 4.4M5.6 8.9l4.8 2.7" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => openRole(j)}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
                  style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
                >
                  {t.careers.apply}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-[13px] text-slate-600 dark:text-slate-400">
          {tr ? 'Uygun rol göremedin mi? ' : "Don't see a fit? "}
          <Link to="/contact" className="text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-emerald-500 decoration-2">
            {tr ? 'Yine de yaz' : 'Reach out anyway'}
          </Link>
        </div>
      </div>

      {openJob && <ApplyModal job={openJob} lang={lang} t={t} onClose={closeRole} onShare={() => shareRole(openJob)} />}
    </section>
  );
}

function ApplyModal({ job, lang, t, onClose, onShare }) {
  const c = t.careers;
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, true);
  const titleId = useId();
  const descId = useId();
  const role = job.title[lang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | limited
  const [retryAfterSec, setRetryAfterSec] = useState(0);

  // Escape closes the dialog; focus restoration is handled by useFocusTrap.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, note, role: job.title.en, company_website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
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

  const invalid = status === 'error' || status === 'limited';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl border border-white/70 dark:border-white/[.08] bg-white dark:bg-slate-900 p-6 lg:p-7 shadow-[0_40px_120px_-40px_rgba(15,23,42,.5)] animate-[fadeUp_.28s_ease-out]"
      >
        <div className="absolute right-4 top-4 flex items-center gap-1">
          <button
            type="button"
            onClick={onShare}
            aria-label={c.share}
            title={c.share}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-900/[.06] hover:text-slate-900 dark:hover:text-slate-100"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="3.5" r="1.8" /><circle cx="4" cy="8" r="1.8" /><circle cx="12" cy="12.5" r="1.8" />
              <path d="M5.6 7.1 10.4 4.4M5.6 8.9l4.8 2.7" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.close}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-900/[.06] hover:text-slate-900 dark:hover:text-slate-100"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" strokeLinecap="round" /></svg>
          </button>
        </div>

        <h2 id={titleId} className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100 pr-16">
          {role}
        </h2>

        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11.5px]">
          <span className="inline-flex items-center rounded-full bg-cyan-50 dark:bg-cyan-500/[.12] text-cyan-700 dark:text-cyan-400 ring-1 ring-cyan-500/15 px-2.5 py-0.5 font-semibold">{job.team[lang]}</span>
          <span className="inline-flex items-center rounded-full bg-slate-900/[.05] dark:bg-white/[.06] text-slate-600 dark:text-slate-300 px-2.5 py-0.5 font-medium">{job.level[lang]}</span>
          <span className="inline-flex items-center rounded-full bg-slate-900/[.05] dark:bg-white/[.06] text-slate-600 dark:text-slate-300 px-2.5 py-0.5 font-medium">{job.location[lang]}</span>
        </div>

        <p className="mt-3 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{job.desc[lang]}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { heading: c.responsibilities, items: job.responsibilities[lang], color: '#0EA5E9' },
            { heading: c.requirements, items: job.requirements[lang], color: '#10B981' },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-2">{col.heading}</h3>
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] text-slate-700 dark:text-slate-300 leading-snug">
                    <span className="mt-1.5 h-1 w-1 rounded-full flex-none" style={{ backgroundColor: col.color }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-slate-900/[.07] dark:border-white/[.08] pt-5">
          <h3 className="font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100">
            {c.applyTitle.replace('{role}', role)}
          </h3>
        </div>

        {status === 'success' ? (
          <div id={descId} role="status" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-50 ring-1 ring-emerald-500/20 text-emerald-700 px-4 py-3 text-[13.5px] font-medium">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}>
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2 6.4l2.8 2.6L10 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            {c.sent}
          </div>
        ) : (
          <>
            <p id={descId} className="mt-1.5 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{c.applyIntro}</p>
            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <div>
                <label htmlFor="apply-name" className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">{c.nameLabel}</label>
                <input
                  id="apply-name" type="text" required value={name}
                  onChange={(e) => { setName(e.target.value); if (invalid) setStatus('idle'); }}
                  placeholder={c.nameP}
                  className="w-full rounded-xl bg-white dark:bg-white/[.04] border border-slate-900/[.12] dark:border-white/[.1] px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/50 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label htmlFor="apply-email" className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">{c.emailLabel}</label>
                <input
                  id="apply-email" type="email" required value={email}
                  onChange={(e) => { setEmail(e.target.value); if (invalid) setStatus('idle'); }}
                  placeholder={c.emailP}
                  aria-invalid={invalid}
                  aria-describedby={status === 'limited' ? 'apply-msg' : undefined}
                  className={`w-full rounded-xl bg-white dark:bg-white/[.04] border px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 ${invalid ? 'border-rose-500/50' : 'border-slate-900/[.12] dark:border-white/[.1] focus:border-cyan-500/50'}`}
                />
              </div>
              <div>
                <label htmlFor="apply-note" className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">{c.noteLabel}</label>
                <textarea
                  id="apply-note" rows={3} value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={c.noteP}
                  className="w-full resize-none rounded-xl bg-white dark:bg-white/[.04] border border-slate-900/[.12] dark:border-white/[.1] px-3.5 py-2.5 text-[13.5px] text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500/50 placeholder:text-slate-400"
                />
              </div>
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white disabled:opacity-60"
                style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
              >
                {status === 'sending' ? c.sending : c.submit}
              </button>

              {status === 'error' && (
                <p role="alert" className="text-[12.5px] text-rose-600">{c.sendError}</p>
              )}
              {status === 'limited' && (
                <p id="apply-msg" role="status" aria-live="polite" className="text-[12.5px] text-rose-600">
                  {t.contact.rateLimited.replace('{s}', retryAfterSec)}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
