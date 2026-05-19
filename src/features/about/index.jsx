import React from 'react';
import { Tag } from '@/shared/ui/primitives';

export function AboutBento({ t, lang }) {
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
