import { GRADIENTS } from '@/core/tokens';
import { Link } from 'react-router-dom';
import { ArrowRight, PageHeader, RelatedRoutes } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useToast } from '@/shared/ui/Toast';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { COVERAGE, BRAND_FACTS, BRAND_COLORS } from '@/core/data/press';
import { useAllPosts } from '@/core/hooks/useAllPosts';
import { TiltCard } from '@/shared/ui/TiltCard';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { Marquee } from '@/shared/ui/Marquee';
import { useState, useEffect } from 'react';

const meta = routeByKey('press');

function useCountUpPlay() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    // Basic delayed play for hero stats, in a real scenario we'd use intersection observer
    const timer = setTimeout(() => setPlay(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return play;
}

export default function PressPage() {
  const { lang, t } = useApp();
  const p = t.press;
  const toast = useToast();
  useDocumentMeta(meta.title[lang], p.intro);
  const playStats = useCountUpPlay();

  const [allPosts] = useAllPosts();
  // Filter press releases
  const pressReleases = allPosts.filter(post => post.tag.en === 'Press Release');
  const latestPress = pressReleases[0];
  const otherPress = pressReleases.slice(1);

  const copyColor = async (hex) => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(hex);
      toast({ message: p.copied.replace('{hex}', hex), type: 'success' });
    } catch {
      toast({ message: p.copyError, type: 'error' });
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast({ message: lang === 'tr' ? 'Medya Kiti başarıyla indirildi.' : 'Media Kit downloaded successfully.', type: 'success' });
    }, 1500);
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <PageHeader
          eyebrow={p.eyebrow}
          title={p.title}
          titleAccent={p.titleAccent}
          intro={p.intro}
          className="max-w-3xl mb-12"
        />

        {/* Bento Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-20">
          {/* Main Featured News */}
          {latestPress && (
            <Reveal className="lg:col-span-2 relative h-full">
              <TiltCard tiltMaxAngleX={5} tiltMaxAngleY={5} className="h-full">
                <Link to={`/blog/${latestPress.slug}`} className="block h-full rounded-3xl eco-card overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-8 lg:p-10 flex flex-col h-full justify-between relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[12px] font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
                      </div>
                      <h3 className="font-display text-[28px] lg:text-[36px] tracking-tight text-slate-900 dark:text-slate-100 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {latestPress.title[lang]}
                      </h3>
                      <p className="mt-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                        {latestPress.excerpt[lang]}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <div className="text-[13px] font-mono text-slate-500">{fmtDate(latestPress.date)}</div>
                      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-900 dark:text-slate-100 group-hover:translate-x-1 transition-transform">
                        {lang === 'tr' ? 'Bülteni Oku' : 'Read Release'} <ArrowRight />
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          )}

          <div className="flex flex-col gap-5">
            {/* Stats Bento */}
            <Reveal delay={100} className="flex-1">
              <div className="rounded-3xl eco-card p-6 h-full flex flex-col justify-center text-center ring-1 ring-emerald-500/10 bg-gradient-to-b from-transparent to-emerald-500/5">
                <div className="text-[11px] uppercase tracking-[.2em] font-semibold text-slate-400 mb-2">
                  {lang === 'tr' ? 'Aktif Şehir' : 'Active Cities'}
                </div>
                <div className="font-display text-[48px] tracking-tight text-emerald-600 dark:text-emerald-400 leading-none mb-4">
                  <AnimatedNumber value={59} play={playStats} />
                </div>
                <div className="text-[11px] uppercase tracking-[.2em] font-semibold text-slate-400 mb-2 mt-4">
                  {lang === 'tr' ? 'Kuruluş' : 'Founded'}
                </div>
                <div className="font-display text-[48px] tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                  <AnimatedNumber value={2026} play={playStats} />
                </div>
              </div>
            </Reveal>

            {/* Quick Contact Bento */}
            <Reveal delay={200}>
              <div className="rounded-3xl p-6 ring-1 ring-cyan-500/20 text-white" style={{ backgroundImage: GRADIENTS.panel }}>
                <h3 className="font-display text-[18px] tracking-tight mb-2">{p.contactTitle}</h3>
                <p className="text-[13px] text-white/80 leading-relaxed mb-4">{p.contactText}</p>
                <Link
                  to="/contact?from=press"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition"
                >
                  {p.contactCta} <ArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Other Press Releases */}
        {otherPress.length > 0 && (
          <div className="mb-20 max-w-4xl">
            <h2 className="mb-6 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{lang === 'tr' ? 'Önceki Bültenler' : 'Previous Releases'}</h2>
            <div className="space-y-4">
              {otherPress.map((rel, i) => (
                <Reveal key={rel.slug} delay={i * 60}>
                  <Link to={`/blog/${rel.slug}`} className="block rounded-2xl eco-card p-6 hover:ring-cyan-500/30 transition group">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <h3 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {rel.title[lang]}
                      </h3>
                      <div className="text-[12px] font-mono shrink-0 text-slate-400">{fmtDate(rel.date)}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Coverage - Infinite Marquee */}
        <div className="mb-20 overflow-hidden relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="mx-auto max-w-6xl px-6 mb-6">
            <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{p.coverage}</h2>
          </div>
          <div className="flex items-center group/marquee">
            <Marquee durationSec={30} pauseOnHover={true} gapClassName="gap-6 lg:gap-8 mx-3 lg:mx-4">
              {COVERAGE.map((c) => (
                <div key={c.id} className="w-[300px] lg:w-[380px] shrink-0 p-6 rounded-2xl eco-card group-hover/marquee:opacity-40 hover:!opacity-100 hover:ring-2 hover:ring-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
                  <div className="font-display text-[16px] tracking-tight text-slate-900 dark:text-slate-100 mb-1">{c.outlet}</div>
                  <div className="text-[11.5px] tabular-nums text-slate-400 mb-4">{fmtDate(c.date)}</div>
                  <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed italic whitespace-normal">
                    {c.quote[lang]}
                  </p>
                </div>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Media kit */}
        <h2 className="mt-14 mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{p.mediaKit}</h2>
        <div className="grid gap-5 sm:grid-cols-3 max-w-5xl">
          <Reveal className="sm:col-span-1">
            <dl className="h-full rounded-3xl eco-card p-6 lg:p-8 divide-y divide-slate-900/[.06] dark:divide-white/[.06]">
              {BRAND_FACTS.map((f) => (
                <div key={f.id} className="py-3.5 first:pt-0 last:pb-0">
                  <dt className="text-[12px] text-slate-500 dark:text-slate-400 mb-1">{f.label[lang]}</dt>
                  <dd className="text-[14px] font-medium text-slate-900 dark:text-slate-100">{f.value[lang]}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          
          <Reveal delay={60} className="sm:col-span-2">
            <div className="h-full rounded-3xl eco-card p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="text-[14px] font-medium text-slate-900 dark:text-slate-100 mb-4">{p.brandColors}</div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {BRAND_COLORS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => copyColor(col.hex)}
                      title={p.copyHint}
                      aria-label={`${p.copyAria?.replace('{name}', col.name) || `Copy ${col.name}`} — ${col.hex}`}
                      className="group flex items-center gap-3 rounded-full bg-slate-900/[.03] dark:bg-white/[.04] p-1.5 pr-4 hover:bg-slate-900/[.06] dark:hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 transition-all cursor-none"
                    >
                      <span className="h-6 w-6 rounded-full shadow-sm" style={{ backgroundColor: col.hex }} aria-hidden="true" />
                      <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-300">
                        {col.name} <span className="opacity-50 ml-1">{col.hex}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900/[.06] dark:border-white/[.06]">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full sm:w-auto relative overflow-hidden group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 py-3 text-[13.5px] font-medium text-white dark:text-slate-900 hover:opacity-90 transition disabled:opacity-80"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {lang === 'tr' ? 'İndiriliyor...' : 'Downloading...'}
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        {lang === 'tr' ? 'Tüm Medya Kitini İndir (.zip)' : 'Download Full Press Kit (.zip)'}
                      </>
                    )}
                  </span>
                  {isDownloading && (
                    <div className="absolute inset-0 bg-cyan-500/20 origin-left animate-[countdown_1.5s_linear_forwards]" />
                  )}
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related routes */}
        <div className="mt-20">
          <RelatedRoutes
            title={t.related.related}
            routeKeys={['about', 'impact', 'blog']}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}
