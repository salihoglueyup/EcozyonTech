import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { decodeCalc } from '@/core/lib/calcShare';
import { estimateAnnualCO2, formatCO2 } from '@/core/lib/co2';

const DRAFT_KEY = 'ecozyon.contactDraft';

// Session storage, guarded — null when unavailable (SSR, sandboxed iframe).
function draftStore() {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

// ── Contact — inline madlib form ───────────────────────────────────────────
export function Contact({ t, lang }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState(t.contact.purposes[0]);
  const [purposeOpen, setPurposeOpen] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | limited
  const [retryAfterSec, setRetryAfterSec] = useState(0);
  const idleTimerRef = useRef(null);
  const firstWriteRef = useRef(true);
  const [searchParams] = useSearchParams();

  // Clear the pending success → idle timer on unmount.
  useEffect(() => () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  // Restore an in-progress draft once after mount, so a refresh or accidental
  // navigation doesn't lose typed text. sessionStorage is client-only, so
  // prerendered HTML and the first client render stay clean.
  useEffect(() => {
    const store = draftStore();
    if (!store) return;
    try {
      const raw = store.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      /* eslint-disable react-hooks/set-state-in-effect */
      if (d.name) setName(d.name);
      if (d.company) setCompany(d.company);
      if (d.email) setEmail(d.email);
      if (d.message) setMessage(d.message);
      if (d.purpose && t.contact.purposes.includes(d.purpose)) setPurpose(d.purpose);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      /* corrupt draft — ignore */
    }
    // Restore once on mount; the picker options are stable per language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arriving from the calculator's "discuss this result" CTA: prefill a
  // localized message with the estimated footprint and preselect the "info"
  // purpose. Runs after the draft restore above, so an explicit intent from
  // the calculator wins over a stale draft.
  useEffect(() => {
    if (searchParams.get('from') !== 'calculator') return;
    const vals = decodeCalc(searchParams);
    if (!vals) return;
    const total = formatCO2(estimateAnnualCO2(vals).total);
    /* eslint-disable react-hooks/set-state-in-effect */
    setMessage(t.contact.fromCalc.replace('{co2}', total));
    setPurpose(t.contact.purposes[2] ?? t.contact.purposes[0]);
    /* eslint-enable react-hooks/set-state-in-effect */
    // Read the deep link once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arriving from a pricing plan's "get started" CTA: prefill a message naming
  // the chosen plan + billing period and preselect the partnership purpose.
  useEffect(() => {
    const plan = searchParams.get('plan');
    const planName = t.contact.planNames?.[plan];
    if (!planName) return;
    const billing = searchParams.get('billing') === 'annual' ? t.contact.planAnnual : t.contact.planMonthly;
    /* eslint-disable react-hooks/set-state-in-effect */
    setMessage(t.contact.fromPlan.replace('{plan}', planName).replace('{billing}', billing));
    setPurpose(t.contact.purposes[0]);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave the draft as fields change; clear it once everything is empty
  // (which also covers the post-submit reset). The first run is skipped so a
  // not-yet-restored empty form never wipes a stored draft.
  useEffect(() => {
    if (firstWriteRef.current) {
      firstWriteRef.current = false;
      return;
    }
    const store = draftStore();
    if (!store) return;
    try {
      if (!name && !company && !email && !message) {
        store.removeItem(DRAFT_KEY);
      } else {
        store.setItem(DRAFT_KEY, JSON.stringify({ name, company, email, message, purpose }));
      }
    } catch {
      /* storage full/unavailable — keep in-memory only */
    }
  }, [name, company, email, message, purpose]);

  const validEmail = /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(email);
  const canSubmit = name && company && validEmail && status !== "sending";
  const sending = status === "sending";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !company || !validEmail || sending) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, message, purpose, company_website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        setName(""); setCompany(""); setEmail(""); setMessage("");
        idleTimerRef.current = setTimeout(() => setStatus("idle"), 6000);
      } else if (res.status === 429) {
        setRetryAfterSec(Math.ceil((data.retryAfterMs || 60_000) / 1000));
        setStatus("limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[680px] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(ellipse, rgba(14,165,233,.18), transparent 70%)" }} />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
          <Tag color="emerald">// 07 · {t.contact.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {t.contact.title}
          </h2>
          </Reveal>
        </div>

        <div className="relative mt-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* LEFT: madlib form */}
          <form
            onSubmit={onSubmit}
            className="relative rounded-3xl eco-card shadow-[0_30px_90px_-50px_rgba(15,23,42,.35)] p-7 lg:p-10"
          >
            <div className="font-display text-[clamp(1.3rem,2.4vw,1.85rem)] leading-[1.45] tracking-tight text-slate-800 dark:text-slate-200">
              <span>{t.contact.intro}</span>{" "}
              <InlineInput value={name} onChange={setName} placeholder={t.contact.nameP} minW={120} />
              <span>{t.contact.from}</span>
              <InlineInput value={company} onChange={setCompany} placeholder={t.contact.companyP} minW={170} />
              <span>{t.contact.reason}</span>
              <PurposePicker
                value={purpose} setValue={setPurpose}
                open={purposeOpen} setOpen={setPurposeOpen}
                options={t.contact.purposes}
              />
              <span>{t.contact.amac}</span>
            </div>

            {/* Honeypot — hidden from humans, catches bots */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
              <label>
                Company website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            {/* Email + message fields */}
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldGroup label={t.contact.emailLabel} required>
                <input
                  type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.contact.emailP}
                  aria-invalid={email !== '' && !validEmail}
                  aria-describedby={email !== '' && !validEmail ? 'contact-email-error' : undefined}
                  className="w-full bg-transparent outline-none text-[14px] text-slate-900 placeholder:text-slate-400"
                />
                {email && !validEmail && (
                  <span id="contact-email-error" className="absolute left-0 top-full mt-1 text-[10.5px] text-amber-700 font-medium">
                    {t.contact.emailInvalid}
                  </span>
                )}
              </FieldGroup>
              <FieldGroup label={t.contact.msgLabel}>
                <input
                  type="text"
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.msgP}
                  className="w-full bg-transparent outline-none text-[14px] text-slate-900 placeholder:text-slate-400"
                />
              </FieldGroup>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-[12.5px] text-slate-500 dark:text-slate-400">
                {t.contact.emailFallback}{" "}
                <a href="mailto:hello@ecozyon.tech" className="text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-emerald-500 decoration-2 hover:decoration-cyan-500">hello@ecozyon.tech</a>
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white shadow-[0_10px_30px_-12px_rgba(14,165,233,.6)] transition ${!canSubmit ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.99]"}`}
                style={{ backgroundImage: "linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)" }}
              >
                {sending
                  ? t.contact.sending
                  : status === "success"
                    ? t.contact.sent
                    : t.contact.submit}
                {!sending && status !== "success" && (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
                )}
              </button>
            </div>

            <p
              role="status"
              aria-live="polite"
              className={`mt-3 text-[12.5px] min-h-[1.1em] ${
                status === "error" || status === "limited" ? "text-rose-600" : "text-emerald-700"
              }`}
            >
              {status === "success" && t.contact.sentLong}
              {status === "error" && t.contact.sendError}
              {status === "limited" && t.contact.rateLimited.replace('{s}', retryAfterSec)}
            </p>
          </form>

          {/* RIGHT: what happens next timeline */}
          <aside className="rounded-3xl border border-white/70 dark:border-white/[.08] bg-gradient-to-br from-emerald-50/60 via-white/70 to-cyan-50/40 dark:from-emerald-500/[.06] dark:via-slate-900/50 dark:to-cyan-500/[.04] backdrop-blur-xl ring-1 ring-slate-900/[.05] dark:ring-white/[.06] p-7 lg:p-8">
            <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-emerald-700">{t.contact.nextTitle}</div>
            <h3 className="mt-2 font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              {lang === "tr" ? "24 saat — demo — pilot" : "24 hours — demo — pilot"}
            </h3>

            <ol className="mt-5 relative">
              <span className="absolute left-[14px] top-3 bottom-3 w-px bg-slate-900/[.08]" />
              {t.contact.nextSteps.map((step, i) => (
                <li key={i} className="relative pl-10 pb-5 last:pb-0">
                  <span className="absolute left-0 top-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-white font-mono text-[10px] font-bold"
                    style={{ background: `linear-gradient(135deg, ${["#0EA5E9","#10B981","#7C3AED"][i]}, ${["#0EA5E9","#10B981","#7C3AED"][i]}cc)` }}>
                    0{i + 1}
                  </span>
                  <div className="text-[13.5px] font-medium text-slate-900 dark:text-slate-100">{step.t}</div>
                  <div className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">{step.d}</div>
                </li>
              ))}
            </ol>

            <div className="mt-5 pt-4 border-t border-slate-900/[.06] dark:border-white/[.06] flex items-center gap-3 text-[11.5px] text-slate-500 dark:text-slate-400">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="8" cy="8" r="6" /><path d="M8 5v3.5l2.5 1.5" strokeLinecap="round" /></svg>
              {lang === "tr" ? "Ortalama yanıt: 8 saat" : "Avg. response: 8h"}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FieldGroup({ label, required, children }) {
  return (
    <label className="relative block rounded-2xl bg-white/80 dark:bg-white/[.06] border border-slate-900/[.08] dark:border-white/[.1] px-3.5 py-2.5 focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/15 transition">
      <div className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 font-semibold flex items-center gap-1">
        {label}
        {required && <span className="text-cyan-600">*</span>}
      </div>
      <div className="mt-0.5">
        {children}
      </div>
    </label>
  );
}

function InlineInput({ value, onChange, placeholder, minW }) {
  return (
    <span className="relative inline-block align-baseline">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ minWidth: minW, width: `${Math.max(minW, value.length * 14 + 30)}px` }}
        className="inline-block bg-transparent border-b-2 border-dashed border-slate-300 dark:border-slate-600 focus:border-cyan-500 outline-none px-1 pb-0.5 font-display text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
      />
    </span>
  );
}

function PurposePicker({ value, setValue, open, setOpen, options }) {
  const wrapRef = useRef(null);
  const optionRefs = useRef([]);
  const triggerRef = useRef(null);

  // Move DOM focus to the currently-selected option whenever the menu opens.
  useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, options.indexOf(value));
    queueMicrotask(() => optionRefs.current[idx]?.focus());
  }, [open, options, value]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, setOpen]);

  const onListKeyDown = (e) => {
    const focused = optionRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const next = focused < 0 ? 0 : (focused + 1) % options.length;
      optionRefs.current[next]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      const prev = focused <= 0 ? options.length - 1 : focused - 1;
      optionRefs.current[prev]?.focus();
      e.preventDefault();
    } else if (e.key === 'Home') {
      optionRefs.current[0]?.focus();
      e.preventDefault();
    } else if (e.key === 'End') {
      optionRefs.current[options.length - 1]?.focus();
      e.preventDefault();
    }
  };

  return (
    <span ref={wrapRef} className="relative inline-block align-baseline">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-3.5 py-0.5 font-display text-[0.85em] hover:bg-emerald-100 transition ring-1 ring-emerald-500/15"
      >
        {value}
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5l3 3 3-3" /></svg>
      </button>
      {open && (
        <div
          role="listbox"
          onKeyDown={onListKeyDown}
          className="absolute z-20 left-0 top-full mt-2 min-w-[180px] rounded-xl bg-white dark:bg-slate-800 border border-slate-900/[.08] dark:border-white/[.1] shadow-xl p-1.5"
        >
          {options.map((o, i) => (
            <button
              key={o}
              ref={(el) => { optionRefs.current[i] = el; }}
              type="button"
              role="option"
              aria-selected={o === value}
              onClick={() => { setValue(o); setOpen(false); triggerRef.current?.focus(); }}
              className={`block w-full text-left text-[13px] font-sans px-3 py-1.5 rounded-lg focus:outline-none focus:bg-emerald-50 dark:focus:bg-emerald-500/[.1] focus:text-emerald-700 dark:focus:text-emerald-400 ${o === value ? "bg-emerald-50 dark:bg-emerald-500/[.1] text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[.06]"}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}