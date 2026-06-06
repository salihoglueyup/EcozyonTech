import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Reveal } from '@/shared/ui/useReveal';
import { CITIES } from '@/core/data/cities';
import { CASES, caseBySlug } from '@/core/data/cases';

// The flagship case spotlighted on the home page (falls back to the first).
const FEATURED = caseBySlug('istanbul-metropolitan') || CASES[0];

// Network totals derived once from the city dataset, so the home trust band
// and the impact map always tell the same story.
const STATS = {
  users: CITIES.reduce((s, c) => s + c.users, 0),
  cities: CITIES.length,
  co2: CITIES.reduce((s, c) => s + c.co2, 0),
  partners: CITIES.filter((c) => c.partner).length,
};

// One-shot IntersectionObserver → flips true when the node scrolls into view.
function useInView(threshold = 0.3) {
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold });
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, seen];
}

// Stat band under the hero — animated network totals from CITIES.
export function TrustBand({ t }) {
  const [ref, seen] = useInView();
  const h = t.home;
  const tiles = [
    { value: STATS.users, label: h.trustUsers, accent: '#0EA5E9' },
    { value: STATS.cities, label: h.trustCities, accent: '#10B981' },
    { value: STATS.co2, label: h.trustCo2, accent: '#F59E0B' },
    { value: STATS.partners, label: h.trustPartners, accent: '#7C3AED' },
  ];
  return (
    <section ref={ref} className="relative py-10 lg:py-14 border-y border-slate-900/[.06] dark:border-white/[.06]">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-[10.5px] uppercase tracking-[.16em] font-semibold text-slate-400 mb-6 text-center lg:text-left">
            {h.trustEyebrow}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tiles.map((tile) => (
              <div key={tile.label} className="text-center lg:text-left">
                <AnimatedNumber
                  value={tile.value}
                  play={seen}
                  className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-none tracking-tight tabular-nums"
                  style={{ color: tile.accent }}
                />
                <div className="mt-1.5 text-[12px] text-slate-500 dark:text-slate-400">{tile.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Spotlight on the flagship case study, bridging home → /cases.
export function FeaturedCase({ t, lang }) {
  const h = t.home;
  const c = FEATURED;
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="rounded-3xl eco-card p-7 lg:p-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{h.featuredEyebrow}</div>
              <div className="flex items-center gap-2 text-[11.5px] mb-3">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold" style={{ backgroundColor: `${c.accent}1f`, color: c.accent }}>{c.city}</span>
                <span className="text-slate-500 dark:text-slate-400">{c.sector[lang]}</span>
              </div>
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100">{c.client[lang]}</h2>
              <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">{c.summary[lang]}</p>
              <blockquote className="mt-5 border-l-2 pl-4 text-[14px] italic text-slate-600 dark:text-slate-400 leading-relaxed" style={{ borderColor: c.accent }}>
                “{c.quote.text[lang]}”
              </blockquote>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/cases/${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
                  style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
                >
                  {h.featuredCta}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
                </Link>
                <Link to="/cases" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] hover:ring-cyan-500/30">
                  {h.featuredAll}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {c.results.map((r) => (
                <div key={r.label.en} className="rounded-2xl bg-white/60 dark:bg-white/[.04] ring-1 ring-slate-900/[.06] dark:ring-white/[.06] p-4 text-center">
                  <div className="font-display text-[clamp(1.3rem,3.5vw,1.9rem)] leading-none tracking-tight tabular-nums" style={{ color: c.accent }}>
                    {r.value}
                    {r.unit[lang] && <span className="ml-0.5 text-[10.5px] font-medium text-slate-400">{r.unit[lang]}</span>}
                  </div>
                  <div className="mt-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">{r.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
