import { GRADIENTS } from '@/core/tokens';
import { ArrowRight } from '@/shared/ui/primitives';
import { Link } from 'react-router-dom';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Sparkline } from '@/shared/ui/charts';
import { Reveal } from '@/shared/ui/useReveal';
import { useInView } from '@/shared/ui/useInView';
import { CITIES, networkGrowth } from '@/core/data/cities';
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

// Per-metric cumulative growth series (2024→2026) for the trust-band sparklines.
const TRENDS = {
  users: networkGrowth('users'),
  cities: networkGrowth('cities'),
  co2: networkGrowth('co2'),
  partners: networkGrowth('partners'),
};

// Stat band under the hero — animated network totals from CITIES.
export function TrustBand({ t }) {
  const [ref, seen] = useInView();
  const h = t.home;
  const tiles = [
    { value: STATS.users, label: h.trustUsers, accent: '#0EA5E9', trend: TRENDS.users },
    { value: STATS.cities, label: h.trustCities, accent: '#10B981', trend: TRENDS.cities },
    { value: STATS.co2, label: h.trustCo2, accent: '#F59E0B', trend: TRENDS.co2 },
    { value: STATS.partners, label: h.trustPartners, accent: '#7C3AED', trend: TRENDS.partners },
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
                <Sparkline data={tile.trend} color={tile.accent} width={120} height={20} dot={false} play={seen} className="mt-2 h-5 w-24 mx-auto lg:mx-0" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Three-up "why Ecozyon" value props. Icons are paired to t.home.why by
// index, so copy stays in the dictionary and only the glyph lives here.
const WHY_ICONS = [
  // on-device chip
  <g key="chip"><rect x="4.5" y="4.5" width="11" height="11" rx="2" /><path d="M8 1.5v3M12 1.5v3M8 15.5v3M12 15.5v3M1.5 8h3M1.5 12h3M15.5 8h3M15.5 12h3" strokeLinecap="round" /></g>,
  // community / trophy
  <g key="cup"><path d="M6 3h8v3a4 4 0 0 1-8 0z" /><path d="M6 4H3.5v1A2.5 2.5 0 0 0 6 7.5M14 4h2.5v1A2.5 2.5 0 0 1 14 7.5M8 11h4M7 16h6M9.5 11v3.5h1V11" strokeLinecap="round" strokeLinejoin="round" /></g>,
  // shield / auditable
  <g key="shield"><path d="M10 1.8 16 4v5c0 4-2.6 6.6-6 8.2C6.6 15.6 4 13 4 9V4z" strokeLinejoin="round" /><path d="m7.2 9.4 2 2 3.6-3.8" strokeLinecap="round" strokeLinejoin="round" /></g>,
];

export function WhyEcozyon({ t }) {
  const h = t.home;
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl mb-12">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-cyan-600 dark:text-cyan-400 mb-3">{h.whyEyebrow}</div>
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-slate-900 dark:text-slate-100">{h.whyTitle}</h2>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {h.why.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="h-full rounded-2xl eco-card p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">{WHY_ICONS[i]}</svg>
                </span>
                <h3 className="mt-4 font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Closing call-to-action band — gradient panel with primary/secondary links.
export function CtaBand({ t }) {
  const h = t.home;
  return (
    <section className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-12 lg:px-14 lg:py-16 text-center"
            style={{ backgroundImage: GRADIENTS.cta }}
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 0, transparent 40%), radial-gradient(circle at 80% 80%, #fff 0, transparent 40%)' }} aria-hidden="true" />
            <div className="relative">
              <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.06] tracking-[-0.02em] text-white max-w-2xl mx-auto">{h.ctaTitle}</h2>
              <p className="mt-4 text-[15px] text-white/85 max-w-xl mx-auto leading-relaxed">{h.ctaText}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-slate-900 hover:bg-white/90 transition">
                  {h.ctaPrimary}
                  <ArrowRight strokeWidth={1.8} />
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-[14px] font-semibold text-white ring-1 ring-white/40 hover:bg-white/25 transition">
                  {h.ctaSecondary}
                </Link>
              </div>
            </div>
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
                  style={{ backgroundImage: GRADIENTS.cta }}
                >
                  {h.featuredCta}
                  <ArrowRight />
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
