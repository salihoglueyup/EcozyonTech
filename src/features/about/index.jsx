import { GRADIENTS } from '@/core/tokens';
import React from 'react';
import { SectionHeader, QuoteMark, InitialsAvatar } from '@/shared/ui/primitives';
import { Reveal, RevealGroup, Parallax } from '@/shared/ui/useReveal';

export function AboutBento({ t, lang }) {
  const b = t.about.bento;
  return (
    <section id="about" className="relative py-20 lg:py-28">
      <Parallax speed={0.18} className="absolute inset-0 -z-10 pointer-events-none opacity-60"
        style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(16,185,129,.10), transparent 50%)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-10">
          <SectionHeader
            color="emerald"
            eyebrow={`06 · ${t.about.eyebrow}`}
            title={t.about.title}
            titleAccent={t.about.titleAccent}
            sub={t.about.sub}
          />
        </div>

        <div className="grid grid-cols-12 gap-3 auto-rows-[150px]">
          {/* Quote — big */}
          <div className="col-span-12 lg:col-span-7 row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-7 lg:p-9 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: "radial-gradient(circle at 20% 20%, rgba(14,165,233,.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(16,185,129,.35), transparent 40%)",
            }} />
            <div className="relative">
              <QuoteMark className="h-7 w-7 text-cyan-400/80" />
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
                <InitialsAvatar
                  key={i}
                  initials={a.initials}
                  background={a.c}
                  className="h-9 w-9 ring-2 ring-slate-900 text-[10.5px] font-semibold"
                  style={{ marginLeft: i ? -12 : 0 }}
                />
              ))}
              <div className="ml-3 text-[12px] text-slate-300 leading-tight">
                <div className="text-slate-100 font-medium">14 {lang === "tr" ? "kişilik ekip" : "people"}</div>
                <div>{lang === "tr" ? "İstanbul · Berlin · uzaktan" : "Istanbul · Berlin · remote"}</div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <BentoCell tag={b.mission.tag} color="cyan" className="col-span-12 md:col-span-6 lg:col-span-5 row-span-1">
            <p className="font-display text-[19px] leading-snug tracking-tight text-slate-900 dark:text-slate-100">{b.mission.text}</p>
          </BentoCell>

          {/* Vision */}
          <BentoCell tag={b.vision.tag} color="emerald" className="col-span-12 md:col-span-6 lg:col-span-5 row-span-1">
            <p className="font-display text-[19px] leading-snug tracking-tight text-slate-900 dark:text-slate-100">{b.vision.text}</p>
          </BentoCell>

          {/* Stat 1 */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-1 rounded-3xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] backdrop-blur-xl ring-1 ring-slate-900/[.04] p-5 flex flex-col justify-between">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400">{b.stat1.label}</div>
            <div className="font-display text-[40px] tracking-[-0.03em] text-slate-900 dark:text-slate-100 leading-none">{b.stat1.value}</div>
          </div>

          {/* Stat 2 */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 row-span-1 rounded-3xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] backdrop-blur-xl ring-1 ring-slate-900/[.04] p-5 flex flex-col justify-between">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400">{b.stat2.label}</div>
            <div className="font-display text-[40px] tracking-[-0.03em] text-slate-900 dark:text-slate-100 leading-none">{b.stat2.value}</div>
          </div>

          {/* Values */}
          <BentoCell tag={b.values.tag} color="slate" className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1">
            <div className="flex flex-wrap gap-1.5 mt-1">
              {b.values.items.map((v, i) => (
                <span key={i} className="rounded-full bg-slate-900/[.05] px-2.5 py-1 text-[12px] text-slate-700 dark:text-slate-300 font-medium">{v}</span>
              ))}
            </div>
          </BentoCell>

          {/* Partners */}
          <BentoCell tag={b.partners.tag} color="cyan" className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1">
            <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">{b.partners.text}</p>
          </BentoCell>
        </div>

        <TeamGrid t={t} />
        <Timeline timeline={t.about.timeline} />
      </div>
    </section>
  );
}

function Timeline({ timeline }) {
  if (!timeline) return null;
  return (
    <div className="mt-16 lg:mt-20">
      <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-2">// {timeline.eyebrow}</div>
      <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100 mb-8">
        {timeline.title}
      </h3>
      <ol className="relative border-l border-slate-900/[.10] ml-3 space-y-8">
        {timeline.items.map((it, i) => (
          <li key={i} className="relative pl-8">
            <span
              className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white"
              style={{ backgroundImage: GRADIENTS.cta }}
              aria-hidden="true"
            />
            <div className="font-mono text-[12px] text-slate-500 dark:text-slate-400">{it.year}</div>
            <div className="mt-0.5 font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{it.title}</div>
            <p className="mt-1 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">{it.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const TEAM_GRADIENTS = [
  "linear-gradient(135deg,#0EA5E9,#10B981)",
  "linear-gradient(135deg,#10B981,#7C3AED)",
  "linear-gradient(135deg,#7C3AED,#F59E0B)",
  "linear-gradient(135deg,#F59E0B,#EC4899)",
  "linear-gradient(135deg,#EC4899,#0EA5E9)",
  "linear-gradient(135deg,#0EA5E9,#7C3AED)",
];

function TeamGrid({ t }) {
  const team = t.about.team;
  if (!team) return null;
  return (
    <div className="mt-14 lg:mt-16">
      <Reveal>
        <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-2">// {team.eyebrow}</div>
        <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100 mb-8">
          {team.title}
        </h3>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <RevealGroup step={80}>
        {team.members.map((m, i) => (
          <Reveal key={m.initials}>
            <div className="rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] backdrop-blur-xl ring-1 ring-slate-900/[.04] dark:ring-white/[.06] p-5 text-center group hover:ring-cyan-500/30 transition">
              <InitialsAvatar
                initials={m.initials}
                background={TEAM_GRADIENTS[i % TEAM_GRADIENTS.length]}
                className="mx-auto h-14 w-14 font-display text-[18px] tracking-tight shadow-lg"
              />
              <div className="mt-3 font-display text-[14px] tracking-tight text-slate-900 dark:text-slate-100">{m.name}</div>
              <div className="mt-0.5 text-[11.5px] text-slate-500 dark:text-slate-400">{m.role}</div>
              <div className="mt-2 text-[10.5px] text-slate-400 dark:text-slate-500 leading-snug">{m.focus}</div>
            </div>
          </Reveal>
        ))}
        </RevealGroup>
      </div>
    </div>
  );
}

function BentoCell({ tag, color = "slate", className, children }) {
  const colorMap = {
    emerald: "text-emerald-700",
    cyan: "text-cyan-700",
    slate: "text-slate-500 dark:text-slate-400",
  };
  return (
    <div className={`rounded-3xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] backdrop-blur-xl ring-1 ring-slate-900/[.04] p-5 lg:p-6 ${className || ""}`}>
      <div className={`text-[10.5px] uppercase tracking-[.14em] font-semibold ${colorMap[color]} mb-2`}>// {tag}</div>
      {children}
    </div>
  );
}