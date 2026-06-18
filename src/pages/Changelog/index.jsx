import { PageHeader, RelatedRoutes } from '@/shared/ui/primitives';
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
        <PageHeader
          eyebrow={c.eyebrow}
          title={c.title}
          titleAccent={c.titleAccent}
          intro={c.intro}
          className="mb-12"
        />

        <ol className="relative border-l border-slate-900/[.1] dark:border-white/[.12] ml-2">
          {CHANGELOG.map((release, idx) => (
            <li key={release.version} id={`v${release.version}`} className="relative pl-8 pb-12 last:pb-0 scroll-mt-28">
              <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900" style={{ backgroundColor: idx === 0 ? '#10B981' : '#94A3B8' }} aria-hidden="true" />
              <Reveal>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={`#v${release.version}`}
                    aria-label={c.anchorLabel.replace('{v}', `v${release.version}`)}
                    className="group/anchor inline-flex items-center gap-1.5 rounded-md font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100 tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                  >
                    v{release.version}
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 transition" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
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

        <RelatedRoutes title={t.related.related} routeKeys={['status', 'developers']} lang={lang} />
      </div>
    </section>
  );
}
