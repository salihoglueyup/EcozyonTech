import React from 'react';
import { Marquee } from '@/shared/ui/Marquee';
import { SpotlightCard } from '@/shared/ui/SpotlightCard';

const LOGOS = [
  { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'AWS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
  { name: 'OpenAI', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
  { name: 'Vercel', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
  { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
];

export function TechMarquee() {
  return (
    <section className="relative py-12 lg:py-16 border-b border-slate-900/[.06] dark:border-white/[.06] overflow-hidden">
      <div className="text-center text-[10.5px] uppercase tracking-[.18em] font-semibold text-slate-500 mb-10">
        Powered by industry-leading technologies
      </div>
      
      <div className="relative flex w-full max-w-7xl mx-auto items-center">
        {/* Gradient fades for the edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-[#0b1220] z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-[#0b1220] z-10"></div>
        
        {/* The Marquee has 'group' to enable pause-on-hover if needed, but SpotlightCard brings its own interactivity */}
        <Marquee speed="40s" className="py-4 hover:[animation-play-state:paused]">
          {LOGOS.map((logo, idx) => (
            <div key={idx} className="mx-4 sm:mx-6 flex-shrink-0">
              <SpotlightCard className="flex items-center gap-4 p-4 pr-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-900/[.04] dark:border-white/[.06] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm">
                  <img src={logo.src} alt={logo.name} className="h-6 w-6 object-contain dark:invert-[0.8] dark:brightness-200" />
                </div>
                <span className="font-display font-medium text-slate-700 dark:text-slate-200 text-sm tracking-tight">{logo.name}</span>
              </SpotlightCard>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
