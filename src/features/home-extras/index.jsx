import { useEffect, useRef, useState } from 'react';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Reveal } from '@/shared/ui/useReveal';
import { CITIES } from '@/core/data/cities';

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
