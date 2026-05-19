import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';

// ────────────────────────────────────────────────────────────────────────────
// USE CASES — Personas (tabbed)
// ────────────────────────────────────────────────────────────────────────────
export function UseCases({ t, lang }) {
  const u = t.useCases;
  const [active, setActive] = useState(0);
  const p = u.personas[active];

  return (
    <section id="usecases" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[760px] rounded-full blur-3xl opacity-40" style={{ background: `radial-gradient(ellipse, ${p.color}33, transparent 70%)` }} />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-10">
          <Tag color="cyan">// 04 · {u.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
            {u.title}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)" }}>{u.titleAccent}</span>
          </h2>
          <p className="mt-3 text-[15px] text-slate-600 max-w-2xl leading-relaxed">{u.sub}</p>
        </div>

        {/* Persona tab pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {u.personas.map((per, i) => {
            const isActive = i === active;
            return (
              <button
                key={per.id}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 border transition-all ${
                  isActive
                    ? "bg-white text-slate-900 border-transparent shadow-[0_12px_32px_-18px_rgba(15,23,42,.35)]"
                    : "bg-white/40 backdrop-blur-md text-slate-600 border-white/60 hover:bg-white/70"
                }`}
                style={isActive ? { boxShadow: `0 12px 32px -18px ${per.color}66, 0 0 0 1px ${per.color}33 inset` } : {}}
              >
                <span
                  className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-white font-semibold text-[14px] ${isActive ? "" : "opacity-70"}`}
                  style={{ background: `linear-gradient(135deg, ${per.color}, ${per.color}cc)` }}
                >
                  <PersonaIcon id={per.id} />
                </span>
                <div className="text-left">
                  <div className={`text-[13.5px] font-semibold ${isActive ? "" : "text-slate-700"}`}>{per.label}</div>
                  <div className="text-[11px] text-slate-500 leading-tight max-w-[200px] truncate">{per.tagline}</div>
                </div>
                {isActive && <span className="ml-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: per.color }} />}
              </button>
            );
          })}
        </div>

        {/* Active persona content panel */}
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/65 backdrop-blur-2xl ring-1 ring-slate-900/[.05] shadow-[0_24px_70px_-40px_rgba(15,23,42,.3)]">
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: `radial-gradient(circle at 100% 0%, ${p.color}22, transparent 50%)` }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
            {/* Left: copy + features */}
            <div className="p-7 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-900/[.05]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1"
                  style={{ color: p.color, backgroundColor: `${p.color}14`, borderColor: `${p.color}30` }}>
                  <span className="h-1 w-1 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.label}
                </span>
                <span className="text-[10.5px] uppercase tracking-[.14em] text-slate-500 font-semibold">
                  {lang === "tr" ? "Kim için" : "Built for"}
                </span>
              </div>

              <h3 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-tight text-slate-900">
                {p.tagline}
              </h3>
              <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">{p.who}</p>

              <ul className="mt-6 space-y-2.5">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-md flex-none" style={{ backgroundColor: `${p.color}1f` }}>
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke={p.color} strokeWidth="2"><path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
                  style={{ background: `linear-gradient(120deg, ${p.color}, ${p.color}cc)`, boxShadow: `0 12px 32px -16px ${p.color}aa` }}
                >
                  {p.cta}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
                </Link>
                <div className="text-[12.5px] text-slate-600 font-mono">{p.price}</div>
              </div>
            </div>

            {/* Right: mock UI specific to persona */}
            <div className="relative p-7 lg:p-10 bg-gradient-to-br from-slate-50/40 to-white/20">
              <PersonaMock persona={p} lang={lang} />
            </div>
          </div>

          {/* Persona metric strip */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-900/[.05] border-t border-slate-900/[.05]">
            {p.metrics.map((m, i) => (
              <div key={i} className="px-6 py-4">
                <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">{m.label}</div>
                <div className="mt-1 font-display text-[24px] tracking-tight" style={{ color: p.color }}>{m.val}</div>
              </div>
            ))}
            <div className="px-6 py-4">
              <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">{lang === "tr" ? "Fiyat" : "Pricing"}</div>
              <div className="mt-1 font-mono text-[14px] text-slate-900">{p.price}</div>
            </div>
            <div className="px-6 py-4 hidden lg:block">
              <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">{lang === "tr" ? "Lansman" : "Launch"}</div>
              <div className="mt-1 font-mono text-[14px] text-slate-900">{p.id === "individual" ? "Q2 2026" : p.id === "team" ? "Q3 2026" : "Q4 2026"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonaIcon({ id }) {
  if (id === "individual") return <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="7" r="3" /><path d="M3 17c.8-3.5 3.5-5 7-5s6.2 1.5 7 5" strokeLinecap="round" /></svg>;
  if (id === "team") return <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="8" r="2.5" /><circle cx="14" cy="9" r="2" /><path d="M2 16c.4-2.4 2.5-3.5 5-3.5s4.6 1.1 5 3.5M11 16c.3-1.8 1.7-2.5 3-2.5s2.5.7 3 2.5" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="14" height="11" rx="1.5" /><path d="M7 16v-3M13 16v-3M3 9h14" /></svg>;
}

// Mock UI specific to each persona (right panel of UseCases card)
function PersonaMock({ persona, lang }) {
  if (persona.id === "individual") {
    return <IndividualMock color={persona.color} lang={lang} />;
  }
  if (persona.id === "team") {
    return <TeamMock color={persona.color} lang={lang} />;
  }
  return <EnterpriseMock color={persona.color} lang={lang} />;
}

function IndividualMock({ color, lang }) {
  return (
    <div className="relative">
      <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 mb-3">
        {lang === "tr" ? "Kişisel uygulama" : "Personal app"}
      </div>
      <div className="relative mx-auto max-w-[280px] rounded-[36px] border border-slate-900/[.08] bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,.3)] overflow-hidden">
        {/* phone notch */}
        <div className="h-6 bg-slate-900 relative">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-black" />
        </div>
        <div className="p-4 bg-gradient-to-b from-white to-cyan-50/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10.5px] text-slate-500">{lang === "tr" ? "Selam Emre" : "Hi Emre"}</div>
              <div className="text-[15px] font-display tracking-tight text-slate-900">{lang === "tr" ? "Bugünkü hedef" : "Today's goal"}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500" />
          </div>

          {/* Ring */}
          <div className="mt-4 grid place-items-center">
            <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
              <circle cx="60" cy="60" r="48" stroke="#F1F5F9" strokeWidth="10" fill="none" />
              <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="301" strokeDashoffset="120" />
              <text x="60" y="60" textAnchor="middle" transform="rotate(90 60 60)" fontSize="18" fontWeight="700" fill="#0F172A">2.4 kg</text>
              <text x="60" y="74" textAnchor="middle" transform="rotate(90 60 60)" fontSize="9" fill="#64748B">/ 5 kg</text>
            </svg>
          </div>

          {/* Suggestion */}
          <div className="mt-3 rounded-xl p-3 text-[11px]" style={{ backgroundColor: `${color}10` }}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-700">🚲 {lang === "tr" ? "Öğle gezisi" : "Lunch ride"}</div>
              <span className="font-mono text-[10px]" style={{ color }}>-1.4 kg</span>
            </div>
            <div className="text-slate-500 mt-0.5">{lang === "tr" ? "AI bugünkü için öneriyor" : "AI recommends for today"}</div>
          </div>

          {/* Bottom nav */}
          <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[9px] text-slate-500">
            {["Home", "Stats", "Friends", "More"].map((l, i) => (
              <div key={l} className={`py-1.5 rounded-md ${i === 0 ? "bg-slate-900 text-white" : ""}`}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMock({ color, lang }) {
  const team = [
    { name: "Zeynep D.", kg: 84, pct: 100 },
    { name: "Mert C.",   kg: 76, pct: 90 },
    { name: "Emre Y.",   kg: 68, pct: 81, me: true },
    { name: "Ali K.",    kg: 59, pct: 70 },
    { name: "Defne A.",  kg: 52, pct: 62 },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">
          {lang === "tr" ? "Bu hafta liderboard" : "This week's leaderboard"}
        </div>
        <div className="text-[10.5px] text-emerald-700 font-mono">● live</div>
      </div>
      <div className="rounded-2xl border border-slate-900/[.06] bg-white p-4 space-y-2.5">
        {team.map((m, i) => (
          <div key={i} className={`flex items-center gap-3 ${m.me ? "ring-1 ring-emerald-500/30 rounded-lg px-2 py-1 -mx-2 bg-emerald-50/40" : ""}`}>
            <div className="w-5 text-[11px] text-slate-500 font-mono">{i + 1}</div>
            <div className="h-7 w-7 rounded-full grid place-items-center text-[10px] font-semibold text-white" style={{ background: `linear-gradient(135deg, ${["#0EA5E9", "#10B981", "#7C3AED", "#F59E0B", "#E11D48"][i]}, ${["#0EA5E9", "#10B981", "#7C3AED", "#F59E0B", "#E11D48"][i]}cc)` }}>
              {m.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-medium text-slate-800">{m.name}{m.me && <span className="ml-1.5 text-[9px] font-mono text-emerald-700">YOU</span>}</div>
              <div className="relative h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, #0EA5E9, ${color})` }} />
              </div>
            </div>
            <div className="text-[11px] font-mono tabular-nums text-slate-700">{m.kg} kg</div>
          </div>
        ))}
      </div>

      {/* Challenge banner */}
      <div className="mt-3 rounded-2xl border border-slate-900/[.06] p-3 flex items-center justify-between" style={{ backgroundColor: `${color}10` }}>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>{lang === "tr" ? "Aktif challenge" : "Active challenge"}</div>
          <div className="text-[13px] font-medium text-slate-800 mt-0.5">{lang === "tr" ? "Bisiklet haftası" : "Bike week"}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-mono text-slate-600">3d 12h {lang === "tr" ? "kaldı" : "left"}</div>
          <div className="text-[10px] text-slate-500">{lang === "tr" ? "12/15 katılımcı" : "12/15 participants"}</div>
        </div>
      </div>
    </div>
  );
}

function EnterpriseMock({ color, lang }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">
          {lang === "tr" ? "ESG raporu (Q1 2026)" : "ESG report (Q1 2026)"}
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] rounded-full px-2 py-0.5 ring-1" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
          GHG · Scope 1-2-3
        </div>
      </div>
      <div className="rounded-2xl border border-slate-900/[.06] bg-white p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Scope 1", val: "412 t", color: "#0EA5E9" },
            { label: "Scope 2", val: "896 t", color: "#10B981" },
            { label: "Scope 3", val: "1.5 kt", color: "#7C3AED" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3" style={{ backgroundColor: `${s.color}10` }}>
              <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: s.color }}>{s.label}</div>
              <div className="mt-1 font-display text-[18px] tracking-tight text-slate-900">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Mock report rows */}
        <div className="mt-4 space-y-2">
          {[
            { label: "GRI 305-1 Direct emissions", status: "✓", color: "#10B981" },
            { label: "GRI 305-2 Indirect (energy)", status: "✓", color: "#10B981" },
            { label: "GRI 305-3 Other indirect", status: "47% complete", color: "#F59E0B" },
            { label: "GRI 305-4 Intensity ratio", status: "✓", color: "#10B981" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between text-[11.5px] py-1.5 border-b border-slate-900/[.04] last:border-0">
              <span className="text-slate-700">{r.label}</span>
              <span className="font-mono text-[10.5px]" style={{ color: r.color }}>{r.status}</span>
            </div>
          ))}
        </div>

        {/* Download */}
        <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[11.5px] font-medium border border-slate-900/[.08] text-slate-700 hover:bg-slate-50">
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 2v8m-3-3 3 3 3-3M3 12h8" strokeLinecap="round" /></svg>
          {lang === "tr" ? "PDF + CSV indir" : "Download PDF + CSV"}
        </button>
      </div>
    </div>
  );
}
