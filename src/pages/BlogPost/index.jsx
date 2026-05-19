import { useParams, Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { postBySlug } from '@/core/data/posts';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { lang } = useApp();
  const tr = lang === 'tr';
  const post = postBySlug(slug);

  useDocumentMeta(
    post ? `${post.title[lang]} — Ecozyon Tech` : 'Yazı bulunamadı — Ecozyon Tech',
    post ? post.excerpt[lang] : undefined,
  );

  if (!post) {
    return (
      <section className="relative py-20 lg:py-28 pt-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] text-slate-900">
            {tr ? 'Bu yazı bulunamadı' : 'Post not found'}
          </h1>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-medium text-cyan-700">
            ← {tr ? 'Tüm yazılar' : 'All posts'}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-500 hover:text-slate-900 transition">
          ← {tr ? 'Tüm yazılar' : 'All posts'}
        </Link>
        <div className="mt-6 flex items-center gap-3 text-[11px]">
          <Tag color="emerald">{post.tag[lang]}</Tag>
          <time className="text-slate-500 font-mono">{post.date}</time>
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
      </div>
    </article>
  );
}
