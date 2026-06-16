import { PageHeader, StatusBadge } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { Sparkline, Donut } from '@/shared/ui/charts';
import {
  COMPONENTS,
  INCIDENTS,
  statusMeta,
  overallStatus,
  uptimeAverage,
  OVERALL_HEADLINE,
} from '@/core/data/status';

const meta = routeByKey('status');

// Small status dot + label, reused for the banner, components and incidents.
function StatusPill({ status, lang }) {
  const m = statusMeta(status);
  return <StatusBadge accent={m.accent} label={m.label[lang]} pulse={status === 'operational'} />;
}

export default function StatusPage() {
  const { lang, t } = useApp();
  const s = t.status;
  useDocumentMeta(meta.title[lang], s.intro);

  const overall = overallStatus(COMPONENTS);
  const overallM = statusMeta(overall);
  const avg = uptimeAverage(COMPONENTS);
  const updated = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const fmtTime = (iso) =>
    new Date(iso).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <PageHeader
          eyebrow={s.eyebrow}
          title={s.title}
          titleAccent={s.titleAccent}
          intro={s.intro}
          className="mb-10"
        />

        {/* Overall banner */}
        <Reveal>
          <div
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 lg:p-6 ring-1"
            style={{ backgroundColor: `${overallM.accent}12`, borderColor: `${overallM.accent}33` }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" style={{ backgroundColor: overallM.accent }} aria-hidden="true" />
                <span className="relative inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: overallM.accent }} aria-hidden="true" />
              </span>
              <span className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100">
                {OVERALL_HEADLINE[overall][lang]}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Donut value={avg} size={48} stroke={5} color={overallM.accent} label={`${s.uptimeLabel}: ${avg}%`} />
              <div className="text-right">
                <div className="font-display text-[22px] tabular-nums leading-none text-slate-900 dark:text-slate-100">{avg}%</div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{s.uptimeLabel}</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Components */}
        <h2 className="mt-12 mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{s.components}</h2>
        <ul className="space-y-2.5">
          {COMPONENTS.map((c, i) => (
            <li key={c.id}>
              <Reveal delay={i * 50}>
                <div className="flex items-center justify-between gap-4 rounded-xl eco-card p-4 lg:px-5">
                  <div>
                    <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-100">{c.name[lang]}</div>
                    <div className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">{c.desc[lang]}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <Sparkline
                      data={c.series}
                      color={statusMeta(c.status).accent}
                      width={96}
                      height={28}
                      className="hidden sm:block h-7 w-24"
                    />
                    <div className="flex flex-col items-end gap-1">
                      <StatusPill status={c.status} lang={lang} />
                      <span className="text-[11.5px] tabular-nums text-slate-400">{c.uptime}%</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Incidents */}
        <h2 className="mt-12 mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{s.incidents}</h2>
        <div className="mb-5 text-right text-[11.5px] text-slate-400">
          {s.updated}: {updated}
        </div>
        {INCIDENTS.length === 0 ? (
          <p className="rounded-xl eco-card p-6 text-[13.5px] text-slate-500 dark:text-slate-400">{s.noIncidents}</p>
        ) : (
          <ol className="relative border-l border-slate-900/[.1] dark:border-white/[.12] ml-2">
            {INCIDENTS.map((inc, idx) => {
              const m = statusMeta(inc.severity);
              return (
                <li key={inc.id} className="relative pl-8 pb-10 last:pb-0">
                  <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900" style={{ backgroundColor: m.accent }} aria-hidden="true" />
                  <Reveal delay={idx * 50}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display text-[16px] tracking-tight text-slate-900 dark:text-slate-100">{inc.title[lang]}</span>
                      <span className="rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide" style={{ backgroundColor: `${m.accent}1f`, color: m.accent }}>
                        {m.label[lang]}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${inc.resolved ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                        {inc.resolved ? s.resolved : s.ongoing}
                      </span>
                      <span className="text-[12px] text-slate-400 tabular-nums">{fmtDate(inc.date)}</span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {inc.updates.map((u, i) => (
                        <li key={i} className="flex gap-3 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-slate-400">{fmtTime(u.at)}</span>
                          <span>{u.text[lang]}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
