import { Tag, EcoLogo } from './sections-a';

// Ecozyon Tech — sections D: About bento, Contact, Footer
import React, { useState } from 'react';

function AboutBento({ t, lang }) {
  const b = t.about.bento;
  return (
    <section id="about" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-60"
        style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(16,185,129,.10), transparent 50%)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-10">
          <Tag color="emerald">// 06 · {t.about.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
            {t.about.title}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)" }}>{t.about.titleAccent}</span>
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-2xl">{t.about.sub}</p>
        </div>

        <div className="grid grid-cols-12 gap-3 auto-rows-[150px]">
          {/* Quote — big */}
          <div className="col-span-12 lg:col-span-7 row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-7 lg:p-9 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: "radial-gradient(circle at 20% 20%, rgba(14,165,233,.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(16,185,129,.35), transparent 40%)",
            }} />
            <div className="relative">
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-cyan-400/80"><path fill="currentColor" d="M12 8c-4 1-7 4-7 9v7h8v-8H8c0-3 1.5-5 4-6V8Zm14 0c-4 1-7 4-7 9v7h8v-8h-5c0-3 1.5-5 4-6V8Z" /></svg>
              <p className="mt-5 font-display text-[clamp(1.4rem,2.5vw,2.1rem)] leading-tight tracking-[-0.01em] max-w-xl">{b.quote.text}</p>
              <div className="mt-4 text-[12.5px] text-slate-300">{b.quote.author}</div>
            </div>
            <div className="relative flex items-center gap-3 pt-6">
              {[
                { c: "#0EA5E9", initials: "ZD" },
                { c: "#10B981", initials: "AE" },
                { c: "#7C3AED", initials: "MK" },
                { c: "#F59E0B", initials: "+11" },
              ].map((a, i) => (
                <div key={i}
                  className="h-9 w-9 rounded-full ring-2 ring-slate-900 flex items-center justify-center text-[10.5px] font-semibold text-white"
                  style={{ backgroundColor: a.c, marginLeft: i ? -12 : 0 }}>
                  {a.initials}
                </div>
              ))}
              <div className="ml-3 text-[12px] text-slate-300 leading-tight">
                <div className="text-slate-100 font-medium">14 {lang === "tr" ? "kişilik ekip" : "people"}</div>
                <div>{lang === "tr" ? "İstanbul · Berlin · uzaktan" : "Istanbul · Berlin · remote"}</div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <BentoCell tag={b.mission.tag} color="cyan" className="col-span-12 md:col-span-6 lg:col-span-5 row-span-1">
            <p className="font-display text-[19px] leading-snug tracking-tight text-slate-900">{b.mission.text}</p>
          </BentoCell>

          {/* Vision */}
          <BentoCell tag={b.vision.tag} color="emerald" className="col-span-12 md:col-span-6 lg:col-span-5 row-span-1">
            <p className="font-display text-[19px] leading-snug tracking-tight text-slate-900">{b.vision.text}</p>
          </BentoCell>

          {/* Stat 1 */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-1 rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-5 flex flex-col justify-between">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">{b.stat1.label}</div>
            <div className="font-display text-[40px] tracking-[-0.03em] text-slate-900 leading-none">{b.stat1.value}</div>
          </div>

          {/* Stat 2 */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-1 rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-5 flex flex-col justify-between">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">{b.stat2.label}</div>
            <div className="font-display text-[40px] tracking-[-0.03em] text-slate-900 leading-none">{b.stat2.value}</div>
          </div>

          {/* Values */}
          <BentoCell tag={b.values.tag} color="slate" className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1">
            <div className="flex flex-wrap gap-1.5 mt-1">
              {b.values.items.map((v, i) => (
                <span key={i} className="rounded-full bg-slate-900/[.05] px-2.5 py-1 text-[12px] text-slate-700 font-medium">{v}</span>
              ))}
            </div>
          </BentoCell>

          {/* Partners */}
          <BentoCell tag={b.partners.tag} color="cyan" className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1">
            <p className="text-[13.5px] text-slate-700 leading-relaxed">{b.partners.text}</p>
          </BentoCell>
        </div>
      </div>
    </section>
  );
}

function BentoCell({ tag, color = "slate", className, children }) {
  const colorMap = {
    emerald: "text-emerald-700",
    cyan: "text-cyan-700",
    slate: "text-slate-500",
  };
  return (
    <div className={`rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-5 lg:p-6 ${className || ""}`}>
      <div className={`text-[10.5px] uppercase tracking-[.14em] font-semibold ${colorMap[color]} mb-2`}>// {tag}</div>
      {children}
    </div>
  );
}

// ── Contact — inline madlib form ───────────────────────────────────────────
function Contact({ t, lang }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState(t.contact.purposes[0]);
  const [purposeOpen, setPurposeOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const validEmail = /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(email);
  const canSubmit = name && company && validEmail;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
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
                {sent ? t.contact.sent : t.contact.submit}
                {!sent && <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>}
              </button>
            </div>
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

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer({ t, lang }) {
  return (
    <footer className="relative pt-16 pb-10 mt-8 border-t border-slate-900/[.08]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <EcoLogo />
            <p className="mt-4 max-w-sm text-[14px] text-slate-600 leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] px-3 py-1.5 text-[12px] text-slate-700 hover:text-slate-900">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M3.5 5h2v8h-2zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 4.5 2Zm3 3h2v1.2c.3-.5 1.1-1.4 2.6-1.4 1.8 0 2.4 1 2.4 2.7V13h-2V9.4c0-1.1-.3-1.7-1.2-1.7s-1.5.6-1.5 1.6V13h-2V5Z" /></svg>
                LinkedIn
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] px-3 py-1.5 text-[12px] text-slate-700 hover:text-slate-900">X</a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] px-3 py-1.5 text-[12px] text-slate-700 hover:text-slate-900">GitHub</a>
            </div>
          </div>
          <div className="col-span-6 md:col-span-4 lg:col-span-2">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">{t.footer.nav}</div>
            <ul className="space-y-2">
              {t.footer.links.navItems.map((it) => <li key={it}><a href="#" className="text-[13px] text-slate-700 hover:text-slate-900">{it}</a></li>)}
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
              {lang === "tr" ? "Bültene abone ol" : "Subscribe to newsletter"}
            </div>
            <form className="flex items-center gap-2 rounded-full bg-white/70 border border-slate-900/[.08] p-1 pl-3.5 max-w-xs">
              <input type="email" placeholder="you@company.com" className="flex-1 bg-transparent outline-none text-[12.5px] text-slate-800 placeholder:text-slate-400" />
              <button type="submit" className="rounded-full bg-slate-900 text-white text-[11.5px] font-medium px-3 py-1.5 hover:bg-slate-800">→</button>
            </form>
            <div className="mt-4 text-[11.5px] text-slate-500 leading-relaxed">
              {lang === "tr" ? "Ürün güncellemeleri ve sürdürülebilirlik analizleri. Spam yok." : "Product updates and sustainability briefings. No spam."}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-900/[.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[11.5px] text-slate-500">{t.footer.rights}</div>
          <div className="text-[11px] text-slate-400 font-mono">v0.9.2 · build 2026.05</div>
        </div>
      </div>
    </footer>
  );
}

export {  AboutBento, Contact, Footer  };
