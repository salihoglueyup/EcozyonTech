import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { POSTS } from '@/core/data/posts';

const meta = routeByKey('blog');

export default function BlogPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  useDocumentMeta(
    meta.title[lang],
    tr
      ? 'Sürdürülebilirlik, donanım ve davranış değişimi üzerine yazılar.'
      : 'Writing on sustainability, hardware and behavior change.',
  );

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="emerald">// {tr ? 'Blog' : 'Blog'}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
            {tr ? 'Notlar & ' : 'Notes & '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {tr ? 'içgörüler' : 'insights'}
            </span>
          </h1>
        </div>

        <div className="space-y-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group block rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.05] p-6 lg:p-7 hover:ring-cyan-500/30 transition"
            >
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/15 px-2 py-0.5 font-semibold">
                  {p.tag[lang]}
                </span>
                <time className="text-slate-500 font-mono">{p.date}</time>
              </div>
              <h2 className="mt-3 font-display text-[20px] lg:text-[22px] tracking-tight text-slate-900 leading-snug group-hover:text-cyan-700 transition">
                {p.title[lang]}
              </h2>
              <p className="mt-2 text-[14px] text-slate-600 leading-relaxed">{p.excerpt[lang]}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-800">
                {tr ? 'Devamını oku' : 'Read more'}
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h6m-2-2 2 2-2 2" /></svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
