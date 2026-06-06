import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { CHANGELOG, typeMeta } from '@/core/data/changelog';

const meta = routeByKey('changelog');

export default function ChangelogPage() {
  const { lang, t } = useApp();
  const c = t.changelog;
  useDocumentMeta(meta.title[lang], c.intro);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12">
          <Tag color="cyan">// {c.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {c.title}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {c.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{c.intro}</p>
        </div>

        <ol className="relative border-l border-slate-900/[.1] dark:border-white/[.12] ml-2">
          {CHANGELOG.map((release, idx) => (
            <li key={release.version} className="relative pl-8 pb-12 last:pb-0">
              <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900" style={{ backgroundColor: idx === 0 ? '#10B981' : '#94A3B8' }} aria-hidden="true" />
              <Reveal>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">v{release.version}</span>
                  {idx === 0 && (
                    <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10.5px] font-semibold">{c.latest}</span>
                  )}
                  <span className="text-[12.5px] text-slate-400 tabular-nums">{fmtDate(release.date)}</span>
                </div>
                <h2 className="mt-1 text-[15px] font-medium text-slate-700 dark:text-slate-300">{release.title[lang]}</h2>

                <ul className="mt-4 space-y-2.5">
                  {release.changes.map((change, i) => {
                    const m = typeMeta(change.type);
                    return (
                      <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span
                          className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: `${m.accent}1f`, color: m.accent }}
                        >
                          {m.label[lang]}
                        </span>
                        <span>{change.text[lang]}</span>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
