import { Link, Navigate, useParams } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { POSTS, filterByTag, postTagBySlug, readingTime } from '@/core/data/posts';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';

export default function BlogTagPage() {
  const { tag: slug } = useParams();
  const { lang, t } = useApp();
  const tg = postTagBySlug(slug);
  useDocumentMeta(
    tg ? `${tg.label[lang]} — Blog — Ecozyon Tech` : 'Blog — Ecozyon Tech',
    tg ? t.blog.tagHeading.replace('{tag}', tg.label[lang]) : '',
  );
  if (!tg) return <Navigate to="/blog" replace />;

  const posts = filterByTag(POSTS, tg.id);

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <Breadcrumbs items={[{ label: 'Blog', to: '/blog' }, { label: tg.label[lang] }]} />

        <div className="mt-5 mb-8">
          <Tag color="emerald">// {t.blog.byTag}</Tag>
          <h1 className="mt-4 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.06] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {t.blog.tagHeading.replace('{tag}', tg.label[lang])}
          </h1>
        </div>

        <div className="space-y-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="eco-lift group block rounded-2xl eco-card p-5 lg:p-6 hover:ring-cyan-500/30 transition"
            >
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/[.12] text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/15 dark:ring-emerald-400/20 px-2 py-0.5 font-semibold">{p.tag[lang]}</span>
                <time className="text-slate-500 font-mono">{p.date}</time>
                <span className="text-slate-400 font-mono">· {readingTime(p, lang)} {t.blog.readMin}</span>
              </div>
              <h2 className="mt-2 font-display text-[19px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition">
                {p.title[lang]}
              </h2>
              <p className="mt-1.5 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{p.excerpt[lang]}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
