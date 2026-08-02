import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GlowOrb } from '@/shared/ui/primitives';
import { GridPattern } from '@/shared/ui/GridPattern';
import { MouseTrail } from '@/shared/ui/MouseTrail';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey, SITE } from '@/core/config/site';
import { CITIES } from '@/core/data/cities';
import { BentoForm, BentoEmail, BentoLocation, BentoSocial, BentoStats, BentoTimeline } from '@/features/contact';

const meta = routeByKey('contact');

export const STATS = {
  cities: CITIES.length,
  countries: new Set(CITIES.map((c) => c.country)).size,
  users: CITIES.reduce((s, c) => s + c.users, 0),
  co2: CITIES.reduce((s, c) => s + c.co2, 0),
};

function getGreeting(lang) {
  const hour = new Date().getHours();
  const isTr = lang === 'tr';
  if (hour < 5) return isTr ? 'Gece kuşları için buradayız.' : 'Here for the night owls.';
  if (hour < 12) return isTr ? 'Günaydın.' : 'Good morning.';
  if (hour < 18) return isTr ? 'İyi günler.' : 'Good afternoon.';
  return isTr ? 'İyi akşamlar.' : 'Good evening.';
}

export default function ContactPage() {
  const { t, lang } = useApp();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting(lang));
  }, [lang]);

  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? "Ecozyon Tech ile iletişime geçin — pilot, demo ve iş birliği için."
      : 'Get in touch with Ecozyon Tech — for pilots, demos and partnerships.',
  );

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#04080f] overflow-hidden selection:bg-cyan-500/30 pb-24">
      <MouseTrail />
      {/* Immersive Background Atmosphere */}
      <GridPattern className="absolute inset-0 opacity-20 dark:opacity-[0.07] mix-blend-overlay dark:mix-blend-screen pointer-events-none z-0" />
      <GlowOrb color="#0ea5e9" size={900} blur={160} x="-10%" y="20%" className="absolute opacity-30 dark:opacity-20 animate-[float_10s_ease-in-out_infinite] pointer-events-none z-0" />
      <GlowOrb color="#10b981" size={800} blur={150} x="30%" y="-10%" className="absolute opacity-20 dark:opacity-[0.15] animate-[float_12s_ease-in-out_infinite_reverse] pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t.contact.eyebrow}
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-300">
            <span className="block text-[clamp(1.5rem,3vw,2.5rem)] text-slate-500 dark:text-slate-400 mb-2">{greeting}</span>
            {lang === 'tr' ? 'Nasıl yardımcı olabiliriz?' : 'How can we help?'}
          </h1>
          <p className="mt-6 text-[18px] lg:text-[20px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t.contact.intro}
          </p>
        </Reveal>
      </div>

      {/* Bento Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
        
        {/* Form: Spans 2 cols, 2 rows */}
        <div className="md:col-span-2 lg:col-span-2 row-span-2">
          <Reveal delay={100} className="h-full">
            <BentoForm t={t} lang={lang} />
          </Reveal>
        </div>

        {/* Email Direct: Spans 1 col, 1 row */}
        <div className="md:col-span-1 lg:col-span-1 row-span-1">
          <Reveal delay={200} className="h-full">
            <BentoEmail t={t} lang={lang} />
          </Reveal>
        </div>

        {/* Location: Spans 1 col, 1 row */}
        <div className="md:col-span-1 lg:col-span-1 row-span-1">
          <Reveal delay={300} className="h-full">
            <BentoLocation t={t} lang={lang} />
          </Reveal>
        </div>

        {/* Live Stats: Spans 2 cols, 1 row */}
        <div className="md:col-span-2 lg:col-span-2 row-span-1">
          <Reveal delay={400} className="h-full">
            <BentoStats t={t} lang={lang} />
          </Reveal>
        </div>

        {/* Next Steps Timeline: Spans 2 cols, 1 row */}
        <div className="md:col-span-2 lg:col-span-2 row-span-1">
          <Reveal delay={500} className="h-full">
            <BentoTimeline t={t} lang={lang} />
          </Reveal>
        </div>

        {/* Socials: Spans 2 cols, 1 row */}
        <div className="md:col-span-1 lg:col-span-2 row-span-1">
          <Reveal delay={600} className="h-full">
            <BentoSocial t={t} lang={lang} />
          </Reveal>
        </div>

      </div>
    </div>
  );
}
