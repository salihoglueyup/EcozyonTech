import { GRADIENTS } from '@/core/tokens';
import React, { useState, useEffect } from 'react';
import { SectionHeader, QuoteMark, InitialsAvatar } from '@/shared/ui/primitives';
import { Reveal, RevealGroup, Parallax } from '@/shared/ui/useReveal';
import { TiltCard } from '@/shared/ui/TiltCard';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { useInView } from '@/shared/ui/useInView';
import { WorldGlobe } from '@/shared/3d/WorldGlobe';
import { Link } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { Modal } from '@/shared/ui/Modal';
import { SpotlightCard } from '@/shared/ui/SpotlightCard';

export function AboutBento({ t, lang }) {
  const { theme } = useApp();
  const b = t.about.bento;
  const [statsRef, statsSeen] = useInView(0.1);

  return (
    <section id="about" className="relative py-20 lg:py-28">
      <Parallax speed={0.18} className="absolute inset-0 -z-10 pointer-events-none opacity-60"
        style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(16,185,129,.10), transparent 50%)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl mb-10">
          <SectionHeader
            as="h1"
            color="emerald"
            eyebrow={`06 · ${t.about.eyebrow}`}
            title={t.about.title}
            titleAccent={t.about.titleAccent}
            sub={t.about.sub}
          />
        </Reveal>

        {/* Manifesto Section */}
        <div className="mt-16 lg:mt-24 mb-20">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-8 lg:p-12 shadow-2xl">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle at 0% 0%, rgba(14,165,233,.3), transparent 50%), radial-gradient(circle at 100% 100%, rgba(16,185,129,.25), transparent 50%)",
            }} />
            <div className="relative z-10 max-w-4xl">
              <QuoteMark className="h-8 w-8 text-emerald-400/80 mb-8" />
              <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] tracking-tight mb-6">
                "{b.quote.text}"
              </p>
              <div className="text-[13px] text-emerald-400 font-semibold tracking-wider uppercase mb-12">
                — {b.quote.author}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/10">
                <div>
                  <div className="text-[11px] uppercase tracking-[.15em] font-semibold text-cyan-400 mb-3">{b.mission.tag}</div>
                  <p className="text-[16px] text-slate-300 leading-relaxed">{b.mission.text}</p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[.15em] font-semibold text-cyan-400 mb-3">{b.vision.tag}</div>
                  <p className="text-[16px] text-slate-300 leading-relaxed">{b.vision.text}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats Banner */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <Reveal delay={100}>
            <SpotlightCard className="eco-card h-full rounded-2xl p-6 text-center flex flex-col justify-center">
              <div className="font-display text-4xl lg:text-5xl text-emerald-600 dark:text-emerald-400 mb-2">
                <AnimatedNumber value={Number(b.stat1.value)} play={statsSeen} />
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">{b.stat1.label}</div>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={200}>
            <SpotlightCard className="eco-card h-full rounded-2xl p-6 text-center flex flex-col justify-center">
              <div className="font-display text-4xl lg:text-5xl text-cyan-600 dark:text-cyan-400 mb-2">
                <AnimatedNumber value={Number(b.stat2.value)} play={statsSeen} />
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">{b.stat2.label}</div>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={300}>
            <SpotlightCard className="eco-card h-full rounded-2xl p-6 flex flex-col items-center justify-center">
             <div className="flex -space-x-3 mb-3">
              {t.about.team.members.slice(0, 3).map((m, i) => (
                m.image || m.avatar ? (
                  <img
                    key={i}
                    src={m.image || m.avatar}
                    alt={m.name}
                    className="h-12 w-12 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-sm"
                  />
                ) : (
                  <InitialsAvatar
                    key={i}
                    initials={m.initials}
                    background={["linear-gradient(135deg,#0EA5E9,#10B981)", "linear-gradient(135deg,#10B981,#7C3AED)", "linear-gradient(135deg,#7C3AED,#F59E0B)"][i]}
                    className="h-12 w-12 ring-4 ring-white dark:ring-slate-900 text-[13px] font-semibold shadow-sm"
                  />
                )
              ))}
             </div>
             <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">3 {lang === "tr" ? "Kurucu Ortak" : "Founders"}</div>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={400}>
            <SpotlightCard className="eco-card h-full rounded-2xl p-6 text-center flex flex-col justify-center items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">AI & Hardware</div>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Values Cards */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <div className="text-[11px] uppercase tracking-[.15em] font-semibold text-emerald-600 dark:text-emerald-400 mb-2">{b.values.tag}</div>
            <h3 className="font-display text-2xl lg:text-3xl text-slate-900 dark:text-white">{lang === "tr" ? "Prensiplerimiz" : "Principles we stand by"}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {b.values.items.map((v, i) => (
              <Reveal key={i} delay={i * 100}>
                <SpotlightCard className="h-full eco-card rounded-2xl p-6 flex flex-col justify-start">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-4">
                     {i === 0 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                     {i === 1 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
                     {i === 2 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                     {i === 3 && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                  </div>
                  <h4 className="font-display text-[17px] font-semibold text-slate-900 dark:text-slate-100 mb-2">{v.label}</h4>
                  <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Partners & Careers Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-24">
          <Reveal className="eco-card rounded-[2rem] p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
             </div>
             <div className="text-[11px] uppercase tracking-[.15em] font-semibold text-cyan-600 dark:text-cyan-400 mb-4">{b.partners.tag}</div>
             <p className="text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed max-w-md relative z-10">{b.partners.text}</p>
          </Reveal>
          
          <Link to="/careers" className="group eco-card rounded-[2rem] p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden bg-emerald-50/50 dark:bg-emerald-900/10 hover:ring-2 hover:ring-emerald-500/30 transition-all">
             <div className="text-[11px] uppercase tracking-[.15em] font-semibold text-emerald-600 dark:text-emerald-400 mb-4">{b.careers.tag}</div>
             <h3 className="font-display text-2xl lg:text-3xl text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
               {b.careers.title} <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
             </h3>
             <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">{b.careers.text}</p>
          </Link>
        </div>

        <TeamGrid t={t} lang={lang} />
        <Timeline timeline={t.about.timeline} theme={theme} />
        <CultureGallery t={t} />
      </div>
    </section>
  );
}

function Timeline({ timeline, theme }) {
  const [activeYear, setActiveYear] = useState(2024);

  if (!timeline) return null;
  return (
    <div className="mt-20 lg:mt-28 flex flex-col lg:flex-row gap-12 lg:gap-8 items-start relative">
      <div className="lg:w-1/2 relative z-10 w-full">
        <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-2">// {timeline.eyebrow}</div>
        <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100 mb-12">
          {timeline.title}
        </h2>
        <ol className="relative border-l border-slate-900/[.10] dark:border-white/[.10] ml-3 space-y-16 lg:space-y-32 pb-32">
          {timeline.items.map((it, i) => (
            <TimelineItem 
              key={i} 
              item={it} 
              onActive={() => setActiveYear(Number(it.year))} 
            />
          ))}
        </ol>
      </div>

      {/* Sticky Globe on the right */}
      <div className="hidden lg:block lg:w-1/2 sticky top-32 h-[500px] w-full">
        <WorldGlobe 
          timeYear={activeYear}
          layers={{ arcs: activeYear >= 2026, heat: true, solar: true }}
          showTerminator={false}
          compact={false}
          theme={theme}
        />
      </div>
    </div>
  );
}

function TimelineItem({ item, onActive }) {
  const [ref, inView] = useInView(0.6);
  
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <li ref={ref} className={`relative pl-8 transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
      <span
        className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-[#0f172a] transition-all duration-700 ${inView ? 'scale-125' : 'scale-100'}`}
        style={{ 
          backgroundImage: inView ? GRADIENTS.cta : 'none', 
          backgroundColor: inView ? 'transparent' : '#cbd5e1' 
        }}
        aria-hidden="true"
      />
      <div className="font-mono text-[12px] text-slate-500 dark:text-slate-400">{item.year}</div>
      <div className="mt-0.5 font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{item.title}</div>
      <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">{item.text}</p>
    </li>
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

function TeamGrid({ t, lang }) {
  const team = t.about.team;
  const [activeMember, setActiveMember] = useState(null);

  if (!team) return null;
  return (
    <div className="mt-14 lg:mt-16">
      <Reveal>
        <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-2">// {team.eyebrow}</div>
        <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100 mb-8">
          {team.title}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <RevealGroup step={100}>
        {team.members.map((m, i) => (
          <Reveal key={m.initials}>
            <TiltCard tiltMaxAngleX={10} tiltMaxAngleY={10} className="h-full">
              <button 
                onClick={() => setActiveMember(m)}
                className="w-full text-left h-full rounded-3xl eco-card p-6 lg:p-8 flex flex-col items-center group hover:ring-cyan-500/30 transition hover:-translate-y-1 duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {m.image || m.avatar ? (
                  <img src={m.image || m.avatar} alt={m.name} className="h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-transparent group-hover:ring-cyan-500/50 transition-all duration-300" />
                ) : (
                  <InitialsAvatar
                    initials={m.initials}
                    background={TEAM_GRADIENTS[i % TEAM_GRADIENTS.length]}
                    className="h-24 w-24 font-display text-[26px] tracking-tight shadow-xl ring-4 ring-transparent group-hover:ring-cyan-500/50 transition-all duration-300"
                  />
                )}
                <div className="mt-6 text-center">
                  <h3 className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{m.name}</h3>
                  <div className="mt-1.5 text-[14px] font-medium text-emerald-600 dark:text-emerald-400">{m.role}</div>
                  <div className="mt-3 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px] mx-auto">{m.focus}</div>
                </div>
              </button>
            </TiltCard>
          </Reveal>
        ))}
        </RevealGroup>
      </div>
      <TeamMemberModal member={activeMember} onClose={() => setActiveMember(null)} lang={lang} />
    </div>
  );
}

function TeamMemberModal({ member, onClose, lang }) {
  if (!member) return null;
  const isTr = lang === 'tr';
  return (
    <Modal onClose={onClose} className="bg-white dark:bg-[#0b1120] w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden relative" lockScroll={true}>
      {/* Digital Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <button onClick={onClose} className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="relative z-10 flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar p-6 md:p-10">
        
        {/* Header: Photo + Name/Role */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <div className="shrink-0 relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl ring-2 ring-cyan-500/20">
            {member.image || member.avatar ? (
              <img src={member.image || member.avatar} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <InitialsAvatar initials={member.initials} background="linear-gradient(135deg,#0EA5E9,#10B981)" className="absolute inset-0 w-full h-full font-display text-[48px] flex items-center justify-center" />
            )}
          </div>
          
          <div className="flex flex-col text-center md:text-left pt-2">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold tracking-[.14em] uppercase mb-3 w-max mx-auto md:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {member.role}
            </div>
            <h3 className="font-display text-[32px] md:text-[40px] tracking-tight text-slate-900 dark:text-white leading-none">{member.name}</h3>
            
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-[13px] font-medium text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 transition bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 px-4 py-2 rounded-xl w-max mx-auto md:mx-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                {isTr ? "LinkedIn ile Bağlan" : "Connect on LinkedIn"}
              </a>
            )}
          </div>
        </div>

        {/* Content columns */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <h4 className="text-[11px] uppercase tracking-[.14em] font-bold text-slate-400 dark:text-slate-500 mb-3">// {isTr ? "Biyografi" : "Biography"}</h4>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {member.bio}
              </p>
            </div>

            {member.achievements && member.achievements.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-[.14em] font-bold text-slate-400 dark:text-slate-500 mb-4">// {isTr ? "Başarılar & Ödüller" : "Achievements & Awards"}</h4>
                <ul className="space-y-3">
                  {member.achievements.map((ach, i) => (
                    <li key={i} className="flex gap-3 text-[14px] text-slate-700 dark:text-slate-200 bg-cyan-50/50 dark:bg-cyan-900/10 p-3 rounded-xl border border-cyan-100 dark:border-cyan-800/30">
                      <span className="text-cyan-500 mt-0.5">✧</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {member.skills && member.skills.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-[.14em] font-bold text-slate-400 dark:text-slate-500 mb-3">// {isTr ? "Uzmanlık Alanları" : "Areas of Expertise"}</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((s, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-white dark:bg-slate-800/80 px-3 py-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.experience && member.experience.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-[.14em] font-bold text-slate-400 dark:text-slate-500 mb-4">// {isTr ? "Öne Çıkan Deneyimler" : "Key Experiences"}</h4>
                <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2 space-y-6">
                  {member.experience.map((ex, i) => (
                    <div key={i} className="relative pl-6">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#0b1120]"></span>
                      <div className="text-[14.5px] font-semibold text-slate-900 dark:text-slate-100">{ex.role}</div>
                      <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{ex.company}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CultureGallery({ t }) {
  const c = t.about.culture;
  if (!c) return null;
  return (
    <div className="mt-20 lg:mt-32">
      <Reveal>
        <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-2">// {c.eyebrow}</div>
        <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100 mb-8 max-w-2xl">
          {c.title}
        </h2>
        <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          {c.text}
        </p>
      </Reveal>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[220px]">
        {c.gallery?.map((item, i) => {
          const spanClasses = i === 0 ? "col-span-2 row-span-2" : (i === 3 ? "col-span-2 row-span-1" : "col-span-1 row-span-1");
          return (
            <Reveal key={i} delay={100 + (i * 100)} className={`${spanClasses} eco-card rounded-3xl overflow-hidden relative group`}>
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900">
                <img src={item.img} alt={item.alt} className="w-full h-full object-cover opacity-60 dark:opacity-50 group-hover:opacity-100 dark:group-hover:opacity-80 transition-all duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white font-display tracking-tight text-[15px] drop-shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                {item.alt}
              </div>
            </Reveal>
          );
        })}
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
    <Reveal className={`eco-card rounded-3xl p-5 lg:p-6 ${className || ""}`}>
      <div className={`text-[10.5px] uppercase tracking-[.14em] font-semibold ${colorMap[color]} mb-2`}>// {tag}</div>
      {children}
    </Reveal>
  );
}