import { GRADIENTS } from '@/core/tokens';
import { Link } from 'react-router-dom';
import { ArrowRight, PageHeader, RelatedRoutes } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { COLUMNS, ROWS, coverageByColumn } from '@/core/data/compare';

const meta = routeByKey('compare');
const COVERAGE = coverageByColumn();

// A matrix cell: true → check, false → dash, string → text.
function Cell({ value, featured, lang, yesLabel, noLabel }) {
  if (value === true) {
    return (
      <svg role="img" className={`mx-auto h-4 w-4 ${featured ? 'text-emerald-500' : 'text-slate-400'}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-label={yesLabel}>
        <path d="M3.5 8.5 7 12l5.5-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (value === false) return <span className="text-slate-300 dark:text-slate-600" role="img" aria-label={noLabel}>—</span>;
  return <span className="text-[12px] text-slate-500 dark:text-slate-400">{value[lang]}</span>;
}

export default function ComparePage() {
  const { lang, t } = useApp();
  const c = t.compare;
  useDocumentMeta(meta.title[lang], c.intro);

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <PageHeader
          eyebrow={c.eyebrow}
          title={c.title}
          titleAccent={c.titleAccent}
          intro={c.intro}
          className="max-w-2xl mb-10"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sr-only">{c.eyebrow}</caption>
            <thead>
              <tr className="border-b border-slate-900/[.08] dark:border-white/[.1]">
                <th scope="col" className="py-3 pr-4 text-[12px] font-medium text-slate-500 dark:text-slate-400">{c.feature}</th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={`py-3 px-3 text-[13px] font-semibold text-center ${col.featured ? 'bg-emerald-500/[.06] dark:bg-emerald-400/[.06] rounded-t-xl text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    {col.label[lang]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature.en} className="border-b border-slate-900/[.05] dark:border-white/[.06] hover:bg-slate-900/[.02] dark:hover:bg-white/[.03] transition-colors">
                  <th scope="row" className="py-2.5 pr-4 text-[13px] font-normal text-slate-700 dark:text-slate-300">
                    {row.term ? (
                      <Link to={`/glossary#${row.term}`} title={c.termHint} className="border-b border-dotted border-slate-400 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        {row.feature[lang]}
                      </Link>
                    ) : (
                      row.feature[lang]
                    )}
                  </th>
                  {row.values.map((v, col) => (
                    <td key={col} className={`py-2.5 px-3 text-center ${COLUMNS[col].featured ? 'bg-emerald-500/[.04] dark:bg-emerald-400/[.04]' : ''}`}>
                      <Cell value={v} featured={COLUMNS[col].featured} lang={lang} yesLabel={c.legendYes} noLabel={c.legendNo} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-3 pr-4 text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400">{c.coverage}</th>
                {COVERAGE.map((n, col) => (
                  <td key={col} className={`py-3 px-3 text-center font-display text-[16px] tabular-nums ${COLUMNS[col].featured ? 'bg-emerald-500/[.06] dark:bg-emerald-400/[.06] rounded-b-xl text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {n}/{ROWS.length}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3.5 8.5 7 12l5.5-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {c.legendYes}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">—</span>
            {c.legendNo}
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-6 ring-1 ring-cyan-500/20" style={{ backgroundImage: GRADIENTS.panel }}>
          <div>
            <h2 className="font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100">{c.ctaTitle}</h2>
            <p className="mt-1 text-[13.5px] text-slate-600 dark:text-slate-400">{c.ctaText}</p>
          </div>
          <Link to="/pricing" className="eco-press inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition">
            {c.cta}
            <ArrowRight />
          </Link>
        </div>

        <RelatedRoutes title={t.related.nextStep} routeKeys={['roi', 'pricing']} lang={lang} />
      </div>
    </section>
  );
}
