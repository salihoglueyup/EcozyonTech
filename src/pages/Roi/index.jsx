import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Donut, BarMini } from '@/shared/ui/charts';
import { useReveal } from '@/shared/ui/useReveal';
import { useToast } from '@/shared/ui/Toast';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { SECTORS, estimateRoi, roiProjection, recommendPlan } from '@/core/lib/roi';

const meta = routeByKey('roi');

export default function RoiPage() {
  const { lang, t } = useApp();
  const r = t.roi;
  const toast = useToast();
  useDocumentMeta(meta.title[lang], r.intro);

  const [team, setTeam] = useState(120);
  const [sector, setSector] = useState('tech');

  // Deep-link (?team=&sector=) read once post-mount so prerendered HTML stays
  // deterministic (server renders the defaults).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const ts = Number(p.get('team'));
    const sc = p.get('sector');
    /* eslint-disable react-hooks/set-state-in-effect -- one-time deep-link sync (server renders defaults) */
    if (Number.isFinite(ts) && ts > 0) setTeam(Math.min(2000, Math.max(1, Math.round(ts))));
    if (sc && SECTORS.some((s) => s.id === sc)) setSector(sc);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const est = estimateRoi({ teamSize: team, sector });
  const projection = roiProjection(est.co2Tons);
  const planId = recommendPlan(est.size);
  const [ref, seen] = useReveal();

  const share = async () => {
    if (typeof window === 'undefined') return;
    const { origin, pathname } = window.location;
    try {
      await navigator.clipboard.writeText(`${origin}${pathname}?team=${est.size}&sector=${sector}`);
      toast({ message: r.shareCopied, type: 'success' });
    } catch {
      toast({ message: r.shareError, type: 'error' });
    }
  };

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-3xl mb-10">
          <Tag color="cyan">// {r.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {r.title}
            <span className="eco-gradient-text">
              {r.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{r.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-2xl eco-card p-6">
            <label htmlFor="roi-team" className="flex items-center justify-between text-[13px] font-medium text-slate-700 dark:text-slate-300">
              <span>{r.teamLabel}</span>
              <span className="font-display text-[18px] tabular-nums text-slate-900 dark:text-slate-100">{est.size} <span className="text-[12px] font-normal text-slate-400">{r.teamUnit}</span></span>
            </label>
            <input
              id="roi-team"
              type="range"
              min="1"
              max="2000"
              step="1"
              value={team}
              onChange={(e) => setTeam(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-500"
            />

            <label htmlFor="roi-sector" className="mt-6 block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">{r.sectorLabel}</label>
            <select
              id="roi-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-xl bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.1] dark:ring-white/[.1] px-3.5 py-2.5 text-[13.5px] text-slate-900 dark:text-slate-100 outline-none focus:ring-cyan-500/40 transition"
            >
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>{s.label[lang]}</option>
              ))}
            </select>

            <button type="button" onClick={share} className="eco-press mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 ring-1 ring-slate-900/[.12] dark:ring-white/[.14] hover:ring-cyan-500/40 transition">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5.5 6 8m5 2.5L6 8m0 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm9-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" /></svg>
              {r.share}
            </button>
          </div>

          {/* Results */}
          <div ref={ref} className="rounded-2xl eco-card p-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400">{r.co2Label}</div>
                <div className="mt-1 font-display text-[30px] leading-none tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
                  <AnimatedNumber value={est.co2Tons} play={seen} />
                  <span className="ml-1 text-[13px] font-medium text-slate-400">t</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400">{r.savingsLabel}</div>
                <div className="mt-1 font-display text-[30px] leading-none tracking-tight tabular-nums text-cyan-600 dark:text-cyan-400">
                  $<AnimatedNumber value={est.costSavings} play={seen} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Donut value={est.adoptionPct} size={64} stroke={6} color="#0EA5E9" label={`${r.adoptionLabel} ${est.adoptionPct}%`}>
                {est.adoptionPct}%
              </Donut>
              <div>
                <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-300">{r.adoptionLabel}</div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 tabular-nums">{est.activeUsers} {r.activeLabel}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400">{r.projectionLabel}</div>
              <BarMini data={projection} color="#10B981" width={240} height={44} className="h-11 w-full" label={r.projectionLabel} />
            </div>
          </div>
        </div>

        <p className="mt-4 text-[11.5px] text-slate-400 leading-relaxed">{r.note}</p>

        {/* Plan recommendation */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-6 ring-1 ring-cyan-500/20" style={{ backgroundImage: 'linear-gradient(120deg,rgba(14,165,233,.08),rgba(16,185,129,.08))' }}>
          <div>
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400">{r.recommendTitle}</div>
            <div className="mt-1 text-[14px] text-slate-700 dark:text-slate-300">
              {r.recommendText} <span className="font-semibold text-slate-900 dark:text-slate-100">{t.contact.planNames[planId]}</span>
            </div>
          </div>
          <Link
            to={`/pricing?plan=${planId}`}
            className="eco-press inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            {r.recommendCta}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
