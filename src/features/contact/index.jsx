import React, { useState } from 'react';
import { Tag } from '@/shared/ui/primitives';

// ── Contact — inline madlib form ───────────────────────────────────────────
export function Contact({ t, lang }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState(t.contact.purposes[0]);
  const [purposeOpen, setPurposeOpen] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

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
        setTimeout(() => setStatus("idle"), 6000);
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
          <Tag color="emerald">// 07 · {t.contact.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em] text-slate-900">
            {t.contact.title}
          </h2>
        </div>

        <div className="relative mt-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* LEFT: madlib form */}
          <form
            onSubmit={onSubmit}
            className="relative rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.05] shadow-[0_30px_90px_-50px_rgba(15,23,42,.35)] p-7 lg:p-10"
          >
            <div className="font-display text-[clamp(1.3rem,2.4vw,1.85rem)] leading-[1.45] tracking-tight text-slate-800">
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
                  className="w-full bg-transparent outline-none text-[14px] text-slate-900 placeholder:text-slate-400"
                />
                {email && !validEmail && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] text-amber-600 font-mono">!</span>
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
              <div className="text-[12.5px] text-slate-500">
                {t.contact.emailFallback}{" "}
                <a href="mailto:hello@ecozyon.tech" className="text-slate-900 underline underline-offset-4 decoration-emerald-500 decoration-2 hover:decoration-cyan-500">hello@ecozyon.tech</a>
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white shadow-[0_10px_30px_-12px_rgba(14,165,233,.6)] transition ${!canSubmit ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.99]"}`}
                style={{ backgroundImage: "linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)" }}
              >
                {sending
                  ? (lang === "tr" ? "Gönderiliyor…" : "Sending…")
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
                status === "error" ? "text-rose-600" : "text-emerald-700"
              }`}
            >
              {status === "success" &&
                (lang === "tr"
                  ? "Teşekkürler! Mesajın alındı, 24 saat içinde döneceğiz."
                  : "Thanks! Your message was received — we'll reply within 24 hours.")}
              {status === "error" &&
                (lang === "tr"
                  ? "Gönderilemedi. Lütfen alanları kontrol edip tekrar dene."
                  : "Couldn't send. Please check the fields and try again.")}
            </p>
          </form>

          {/* RIGHT: what happens next timeline */}
          <aside className="rounded-3xl border border-white/70 bg-gradient-to-br from-emerald-50/60 via-white/70 to-cyan-50/40 backdrop-blur-xl ring-1 ring-slate-900/[.05] p-7 lg:p-8">
            <div className="text-[11px] uppercase tracking-[.14em] font-semibold text-emerald-700">{t.contact.nextTitle}</div>
            <h3 className="mt-2 font-display text-[20px] tracking-tight text-slate-900 leading-tight">
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
                  <div className="text-[13.5px] font-medium text-slate-900">{step.t}</div>
                  <div className="text-[12px] text-slate-600 leading-relaxed mt-0.5">{step.d}</div>
                </li>
              ))}
            </ol>

            <div className="mt-5 pt-4 border-t border-slate-900/[.06] flex items-center gap-3 text-[11.5px] text-slate-500">
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
    <label className="relative block rounded-2xl bg-white/80 border border-slate-900/[.08] px-3.5 py-2.5 focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/15 transition">
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
        className="inline-block bg-transparent border-b-2 border-dashed border-slate-300 focus:border-cyan-500 outline-none px-1 pb-0.5 font-display text-slate-900 placeholder:text-slate-400 transition-colors"
      />
    </span>
  );
}

function PurposePicker({ value, setValue, open, setOpen, options }) {
  return (
    <span className="relative inline-block align-baseline">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-3.5 py-0.5 font-display text-[0.85em] hover:bg-emerald-100 transition ring-1 ring-emerald-500/15"
      >
        {value}
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5l3 3 3-3" /></svg>
      </button>
      {open && (
        <div className="absolute z-20 left-0 top-full mt-2 min-w-[180px] rounded-xl bg-white border border-slate-900/[.08] shadow-xl p-1.5">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { setValue(o); setOpen(false); }}
              className={`block w-full text-left text-[13px] font-sans px-3 py-1.5 rounded-lg ${o === value ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
