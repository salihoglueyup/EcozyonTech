import { Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { integrationBySlug, statusMeta } from '@/core/data/integrations';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';

export default function IntegrationPage() {
  const { slug } = useParams();
  const { lang, t } = useApp();
  const item = integrationBySlug(slug);
  useDocumentMeta(
    item ? `${item.name} — Ecozyon Tech` : 'Ecozyon Tech',
    item ? item.tagline[lang] : '',
  );
  if (!item) return <Navigate to="/integrations" replace />;

  const g = t.integrations;
  const sm = statusMeta(item.status);

  return (
    <article className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <Breadcrumbs items={[{ label: lang === 'tr' ? 'Entegrasyonlar' : 'Integrations', to: '/integrations' }, { label: item.name }]} />

        <div className="mt-6 flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl font-display text-[24px] font-semibold text-white" style={{ backgroundColor: item.accent }} aria-hidden="true">
            {item.name.slice(0, 1)}
          </span>
          <div>
            <h1 className="font-display text-[clamp(1.7rem,4vw,2.6rem)] leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-100">{item.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-[12px]">
              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: sm.accent }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sm.accent }} />
                {sm.label[lang]}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">{item.category[lang]}</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">{item.tagline[lang]}</p>

        <div className="mt-6 space-y-4">
          {item.description[lang].map((p, i) => (
            <p key={i} className="text-[15px] text-slate-700 dark:text-slate-300 leading-[1.75]">{p}</p>
          ))}
        </div>

        <h2 className="mt-10 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{g.features}</h2>
        <ul className="grid gap-2.5 sm:grid-cols-3">
          {item.features[lang].map((f) => (
            <li key={f} className="rounded-xl eco-card p-3.5 text-[13px] text-slate-700 dark:text-slate-300">{f}</li>
          ))}
        </ul>

        <div className="mt-10 border-t border-slate-900/[.07] dark:border-white/[.08] pt-7">
          <Link
            to="/contact?from=integrations"
            className="eco-press inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white"
            style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
          >
            {g.cta}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
