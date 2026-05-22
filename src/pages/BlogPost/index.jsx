import { useParams, Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { postBySlug, readingTime, relatedPosts } from '@/core/data/posts';
import NotFoundPage from '@/pages/NotFound';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { lang, t } = useApp();
  const tr = lang === 'tr';
  const post = postBySlug(slug);

  useDocumentMeta(
    post ? `${post.title[lang]} — Ecozyon Tech` : 'Yazı bulunamadı — Ecozyon Tech',
    post ? post.excerpt[lang] : undefined,
  );

  // Unknown slug → render the real 404 page so users get a consistent
  // dead-end UX (the prerender step never emits HTML for unknown slugs,
  // so this only triggers on client navigation / SPA fallback).
  if (!post) return <NotFoundPage />;

  const related = relatedPosts(post);

  return (
    <article className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-500 hover:text-slate-900 transition">
          ← {tr ? 'Tüm yazılar' : 'All posts'}
        </Link>
        <div className="mt-6 flex items-center gap-3 text-[11px]">
          <Tag color="emerald">{post.tag[lang]}</Tag>
          <time className="text-slate-500 font-mono">{post.date}</time>
          <span className="text-slate-400 font-mono">· {readingTime(post, lang)} {t.blog.readMin}</span>
        </div>
        <h1 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] tracking-[-0.02em] text-slate-900">
          {post.title[lang]}
        </h1>
        <div className="mt-8 space-y-5">
          {post.body[lang].map((para, i) => (
            <p key={i} className="text-[15.5px] text-slate-700 leading-[1.75]">
              {para}
            </p>
          ))}
        </div>

        {related.length > 0 && (
          <aside className="mt-16 pt-8 border-t border-slate-900/[.08]">
            <h2 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-4">
              {t.blog.related}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group block rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/[.05] p-5 hover:ring-cyan-500/30 transition"
                >
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/15 px-2 py-0.5 font-semibold">
                      {r.tag[lang]}
                    </span>
                    <time className="text-slate-500 font-mono">{r.date}</time>
                  </div>
                  <h3 className="mt-2 font-display text-[16px] tracking-tight text-slate-900 leading-snug group-hover:text-cyan-700 transition">
                    {r.title[lang]}
                  </h3>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
