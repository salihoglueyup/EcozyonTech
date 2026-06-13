import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { Tabs } from '@/shared/ui/Tabs';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Reveal, useReveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { CITIES } from '@/core/data/cities';
import { METRICS, rankCities } from '@/core/lib/leaderboard';

const meta = routeByKey('leaderboard');
const MEDAL = ['#F59E0B', '#94A3B8', '#B45309']; // gold / silver / bronze

export default function LeaderboardPage() {
  const { lang, t } = useApp();
  const g = t.leaderboard;
  const [metric, setMetric] = useState('co2');
  const [ref, seen] = useReveal(0.05);
  useDocumentMeta(meta.title[lang], g.intro);

  const ranked = rankCities(CITIES, { metric, limit: 12 });
  const max = ranked.length ? ranked[0].value : 1;
  const tabs = METRICS.map((m) => ({ id: m, label: g.metrics[m] }));

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Tag color="cyan">// {g.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {g.title}
            <span className="eco-gradient-text">
              {g.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{g.intro}</p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400">{g.metricLabel}</span>
          <Tabs tabs={tabs} value={metric} onChange={setMetric} size="sm" />
        </div>

        <ol ref={ref} className="space-y-2">
          {ranked.map((row, i) => {
            const pct = Math.max(4, (row.value / max) * 100);
            const top = row.rank <= 3;
            return (
              <li key={row.city.name}>
                <Reveal delay={Math.min(i, 8) * 40}>
                  <div className="relative flex items-center gap-4 rounded-xl eco-card px-4 py-3 overflow-hidden">
                    {/* value bar */}
                    <span className="absolute inset-y-0 left-0 opacity-[.08]" style={{ width: `${pct}%`, backgroundColor: row.city.partner ? '#0EA5E9' : '#10B981' }} aria-hidden="true" />
                    <span
                      className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold tabular-nums"
                      style={top ? { backgroundColor: `${MEDAL[row.rank - 1]}22`, color: MEDAL[row.rank - 1] } : {}}
                    >
                      <span className={top ? '' : 'text-slate-400'}>{row.rank}</span>
                    </span>
                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100 truncate">{row.city.name}</span>
                        {row.city.partner && <span className="rounded-full bg-cyan-500/12 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide">{g.partner}</span>}
                      </div>
                      <span className="text-[11.5px] text-slate-400">{row.city.country}</span>
                    </div>
                    <div className="relative text-right shrink-0">
                      <div className="font-display text-[17px] leading-none tabular-nums text-slate-900 dark:text-slate-100">
                        <AnimatedNumber value={row.value} play={seen} />
                      </div>
                      <div className="mt-0.5 text-[10.5px] text-slate-400">{g.units[metric]}</div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 text-[13px] text-slate-600 dark:text-slate-400">
          {lang === 'tr' ? 'Tüm ağı haritada keşfet: ' : 'Explore the full network on the map: '}
          <Link to="/impact" className="text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-emerald-500 decoration-2">
            {g.onMap}
          </Link>
        </div>
      </div>
    </section>
  );
}
