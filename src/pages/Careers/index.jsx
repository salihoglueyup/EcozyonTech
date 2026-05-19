import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { JOBS } from '@/core/data/jobs';

const meta = routeByKey('careers');

export default function CareersPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  useDocumentMeta(
    meta.title[lang],
    tr
      ? 'Ecozyon Tech ekibine katıl — mühendis arıyoruz.'
      : 'Join the Ecozyon Tech team — we are hiring engineers.',
  );

  const perks = tr
    ? ['Uzaktan-öncelikli', 'Donanım + yazılım', 'Öğrenme bütçesi', 'Etki odaklı misyon']
    : ['Remote-first', 'Hardware + software', 'Learning budget', 'Impact-driven mission'];

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-10">
          <Tag color="cyan">// {tr ? 'Kariyer' : 'Careers'}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
            {tr ? 'Daha akıllı, ' : 'Build a smarter, '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {tr ? 'temiz bir gelecek kur' : 'cleaner future'}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 max-w-2xl leading-relaxed">
            {tr
              ? '14 kişilik bir ekibiz — İstanbul, Berlin ve uzaktan. Donanımdan AI’a etki yaratan işler yapıyoruz.'
              : 'A team of 14 — Istanbul, Berlin and remote. We do impactful work from hardware to AI.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {perks.map((p) => (
              <span key={p} className="rounded-full bg-slate-900/[.05] px-2.5 py-1 text-[12px] text-slate-700 font-medium">{p}</span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {JOBS.map((j) => (
            <div key={j.id} className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.05] p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-500/15 px-2 py-0.5 font-semibold">{j.team[lang]}</span>
                  <span className="text-slate-500">{j.type[lang]}</span>
                </div>
                <h2 className="mt-2 font-display text-[19px] tracking-tight text-slate-900">{j.title[lang]}</h2>
                <p className="mt-1 text-[13.5px] text-slate-600 leading-relaxed">{j.desc[lang]}</p>
              </div>
              <a
                href={`mailto:hello@ecozyon.tech?subject=${encodeURIComponent(j.title.en)}`}
                className="self-start inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white shrink-0"
                style={{ backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' }}
              >
                {tr ? 'Başvur' : 'Apply'}
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 text-[13px] text-slate-600">
          {tr ? 'Uygun rol göremedin mi? ' : "Don't see a fit? "}
          <Link to="/contact" className="text-slate-900 underline underline-offset-4 decoration-emerald-500 decoration-2">
            {tr ? 'Yine de yaz' : 'Reach out anyway'}
          </Link>
        </div>
      </div>
    </section>
  );
}
