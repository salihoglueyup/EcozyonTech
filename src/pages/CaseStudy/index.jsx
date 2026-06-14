import { GRADIENTS } from '@/core/tokens';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { caseBySlug, relatedCases } from '@/core/data/cases';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';

export default function CaseStudyPage() {
  const { slug } = useParams();
  const { lang, t } = useApp();
  const item = caseBySlug(slug);
  // Unknown slug (only reachable via a bad client URL — prerender only emits
  // real slugs): send back to the index rather than showing an empty shell.
  useDocumentMeta(
    item ? `${item.client[lang]} — Ecozyon Tech` : 'Ecozyon Tech',
    item ? item.summary[lang] : '',
  );
  if (!item) return <Navigate to="/cases" replace />;

  const c = t.cases;
  const related = relatedCases(slug);

  return (
    <article className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <Breadcrumbs items={[{ label: lang === 'tr' ? 'Vaka Çalışmaları' : 'Case Studies', to: '/cases' }, { label: item.client[lang] }]} />

        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11.5px]">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold" style={{ backgroundColor: `${item.accent}1f`, color: item.accent }}>{item.city}</span>
          <span className="inline-flex items-center rounded-full bg-slate-900/[.05] dark:bg-white/[.06] text-slate-600 dark:text-slate-300 px-2.5 py-0.5 font-medium">{item.sector[lang]}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 dark:text-slate-400 tabular-nums">{item.year}</span>
        </div>

        <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          {item.client[lang]}
        </h1>
        <p className="mt-3 text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary[lang]}</p>

        {/* Result metric tiles */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {item.results.map((r) => (
            <div key={r.label.en} className="rounded-2xl eco-card p-4 text-center">
              <div className="font-display text-[clamp(1.4rem,4vw,2rem)] leading-none tracking-tight tabular-nums" style={{ color: item.accent }}>
                {r.value}
                {r.unit[lang] && <span className="ml-0.5 text-[11px] font-medium text-slate-400">{r.unit[lang]}</span>}
              </div>
              <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{r.label[lang]}</div>
            </div>
          ))}
        </div>

        {/* Challenge + approach */}
        <div className="mt-10 space-y-8">
          {[
            { heading: c.challenge, body: item.challenge[lang] },
            { heading: c.approach, body: item.approach[lang] },
          ].map((sec) => (
            <section key={sec.heading}>
              <h2 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{sec.heading}</h2>
              <div className="space-y-4">
                {sec.body.map((p, i) => (
                  <p key={i} className="text-[15px] text-slate-700 dark:text-slate-300 leading-[1.75]">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Quote */}
        <figure className="mt-10 rounded-3xl eco-card p-7 lg:p-8">
          <blockquote className="font-display text-[19px] leading-[1.5] tracking-tight text-slate-800 dark:text-slate-100">
            “{item.quote.text[lang]}”
          </blockquote>
          <figcaption className="mt-4 text-[13px] text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.quote.author}</span>
            {' · '}
            {item.quote.role[lang]}
          </figcaption>
        </figure>

        {/* Footer: map link + CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-900/[.07] dark:border-white/[.08] pt-7">
          <Link to="/impact" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c1.6 1.7 2.5 3.8 2.5 6S9.6 12.3 8 14C6.4 12.3 5.5 10.2 5.5 8S6.4 3.7 8 2Z" /></svg>
            {c.onMap}
          </Link>
          <Link
            to="/contact?from=cases"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
            style={{ backgroundImage: GRADIENTS.cta }}
          >
            {c.cta}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
          </Link>
        </div>

        {/* Related case studies */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-4">{c.related}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/cases/${r.slug}`}
                  className="eco-lift group rounded-2xl eco-card p-5 hover:ring-cyan-500/30 transition"
                >
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold" style={{ backgroundColor: `${r.accent}1f`, color: r.accent }}>{r.city}</span>
                    <span className="text-slate-500 dark:text-slate-400">{r.sector[lang]}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[16px] tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{r.client[lang]}</h3>
                  <p className="mt-1 text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{r.summary[lang]}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
