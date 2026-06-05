import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { postBySlug, readingTime, relatedPosts, postNeighbors } from '@/core/data/posts';
import { SITE } from '@/core/config/site';
import { shareLinks } from '@/core/lib/share';
import { recordRecent } from '@/core/lib/recents';
import { isSaved, readSaved, toggleSavedSlug } from '@/core/lib/saved';
import { useToast } from '@/shared/ui/Toast';
import { Tooltip } from '@/shared/ui/Tooltip';
import { SectionNav } from '@/shared/ui/SectionNav';
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

  // Remember this post as recently viewed (client-only; storage-guarded).
  useEffect(() => {
    if (post) recordRecent(post.slug);
  }, [post]);

  // Unknown slug → render the real 404 page so users get a consistent
  // dead-end UX (the prerender step never emits HTML for unknown slugs,
  // so this only triggers on client navigation / SPA fallback).
  if (!post) return <NotFoundPage />;

  const related = relatedPosts(post);
  const { prev, next } = postNeighbors(post.slug);
  const blocks = post.body[lang];
  // Heading blocks ({ h, id }) double as the table-of-contents entries; the
  // SectionNav rail tracks scroll position and anchors to these ids.
  const headings = blocks
    .filter((b) => typeof b === 'object' && b)
    .map((b) => ({ id: b.id, label: b.h }));

  return (
    <article className="relative py-20 lg:py-28 pt-32">
      {headings.length > 0 && <SectionNav sections={headings} alwaysLabels />}
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition">
          ← {tr ? 'Tüm yazılar' : 'All posts'}
        </Link>
        <div className="mt-6 flex items-center gap-3 text-[11px]">
          <Tag color="emerald">{post.tag[lang]}</Tag>
          <time className="text-slate-500 dark:text-slate-400 font-mono">{post.date}</time>
          <span className="text-slate-400 font-mono">· {readingTime(post, lang)} {t.blog.readMin}</span>
        </div>
        <h1 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.06] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          {post.title[lang]}
        </h1>

        <ShareBar post={post} lang={lang} t={t} />

        <div className="mt-8 space-y-5">
          {blocks.map((b, i) =>
            typeof b === 'object' && b ? (
              <h2
                key={b.id}
                id={b.id}
                className="scroll-mt-28 pt-3 font-display text-[clamp(1.25rem,2.4vw,1.6rem)] tracking-[-0.01em] text-slate-900 dark:text-slate-100"
              >
                {b.h}
              </h2>
            ) : (
              <p key={i} className="text-[15.5px] text-slate-700 dark:text-slate-300 leading-[1.75]">
                {b}
              </p>
            ),
          )}
        </div>

        {(prev || next) && (
          <nav className="mt-14 pt-8 border-t border-slate-900/[.08] dark:border-white/[.1] flex items-stretch gap-3" aria-label={tr ? 'Yazı gezinmesi' : 'Post navigation'}>
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="group flex-1 rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.05] dark:ring-white/[.06] p-4 hover:ring-cyan-500/30 transition">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">← {t.blog.prevPost}</span>
                <span className="mt-1 block font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug group-hover:text-cyan-700 transition">{prev.title[lang]}</span>
              </Link>
            ) : <span className="flex-1" />}
            {next ? (
              <Link to={`/blog/${next.slug}`} className="group flex-1 rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.05] dark:ring-white/[.06] p-4 text-right hover:ring-cyan-500/30 transition">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.blog.nextPost} →</span>
                <span className="mt-1 block font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug group-hover:text-cyan-700 transition">{next.title[lang]}</span>
              </Link>
            ) : <span className="flex-1" />}
          </nav>
        )}

        {related.length > 0 && (
          <aside className="mt-16 pt-8 border-t border-slate-900/[.08] dark:border-white/[.1]">
            <h2 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700 mb-4">
              {t.blog.related}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group block rounded-2xl eco-card p-5 hover:ring-cyan-500/30 transition"
                >
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/15 px-2 py-0.5 font-semibold">
                      {r.tag[lang]}
                    </span>
                    <time className="text-slate-500 dark:text-slate-400 font-mono">{r.date}</time>
                  </div>
                  <h3 className="mt-2 font-display text-[16px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug group-hover:text-cyan-700 transition">
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

function ShareBar({ post, lang, t }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const toast = useToast();
  const url = `${SITE.url}/blog/${post.slug}`;
  const links = shareLinks(url, post.title[lang]);

  // Reflect saved state after mount (localStorage is client-only).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(isSaved(readSaved(), post.slug));
  }, [post.slug]);

  const toggleSave = () => {
    const nowSaved = toggleSavedSlug(post.slug).includes(post.slug);
    setSaved(nowSaved);
    toast({ message: nowSaved ? t.blog.savedOn : t.blog.savedOff, type: 'success' });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ message: t.blog.copied, type: 'success' });
    } catch {
      toast({ message: t.blog.copyError, type: 'error' });
    }
  };

  const iconBtn =
    'inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:ring-cyan-500/30 transition';

  return (
    <div className="mt-5 flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400 mr-1">{t.blog.share}</span>
      <Tooltip label="X">
        <a href={links.x} target="_blank" rel="noreferrer" aria-label="X" className={iconBtn}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M9.5 7l4-5h-1.2L9 6 6.4 2H3l4.2 6L3 14h1.2L8 9.4 10.8 14H14L9.5 7Zm-1 1.2-.5-.7L4.5 3h1.4l2.8 4 .5.7 3.7 5.3h-1.4L8.5 8.2Z" /></svg>
        </a>
      </Tooltip>
      <Tooltip label="LinkedIn">
        <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={iconBtn}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M3.5 5h2v8h-2zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 4.5 2Zm3 3h2v1.2c.3-.5 1.1-1.4 2.6-1.4 1.8 0 2.4 1 2.4 2.7V13h-2V9.4c0-1.1-.3-1.7-1.2-1.7s-1.5.6-1.5 1.6V13h-2V5Z" /></svg>
        </a>
      </Tooltip>
      <button
        type="button"
        onClick={copy}
        aria-label={t.blog.copyLink}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-white/[.04] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] px-3 h-8 text-[12px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:ring-cyan-500/30 transition"
      >
        {copied ? (
          <>
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 6.4l2.8 2.6L10 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {t.blog.copied}
          </>
        ) : (
          <>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6.5 9.5 9.5 6.5M7 4l.7-.7a2.5 2.5 0 0 1 3.5 3.5l-.7.7M9 12l-.7.7a2.5 2.5 0 0 1-3.5-3.5l.7-.7" strokeLinecap="round" /></svg>
            {t.blog.copyLink}
          </>
        )}
      </button>
      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? t.blog.unsave : t.blog.save}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[12px] ring-1 transition ${
          saved
            ? 'bg-cyan-500/10 ring-cyan-500/30 text-cyan-700 dark:text-cyan-400'
            : 'bg-white/70 dark:bg-white/[.04] ring-slate-900/[.08] dark:ring-white/[.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:ring-cyan-500/30'
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 2.5h8v11l-4-2.6-4 2.6z" strokeLinejoin="round" /></svg>
        {saved ? t.blog.savedLabel : t.blog.save}
      </button>
    </div>
  );
}
