import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { POSTS } from '@/core/data/posts';
import { CASES } from '@/core/data/cases';
import { featuredHelp } from '@/core/data/help';
import { networkGrowth } from '@/core/data/cities';
import { Sparkline } from '@/shared/ui/charts';

const meta = routeByKey('resources');
// Curated quick-link destinations (each is a real route; title comes from the
// route's nav label, description from the dictionary).
const EXPLORE = ['impact', 'pricing', 'changelog', 'status', 'press', 'careers'];
// Cumulative network growth (users) — a small trend on the impact quick-link.
const NETWORK_TREND = networkGrowth('users');

// Small forward-arrow used on cards/links.
function Arrow() {
  return (
    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 7h8m-3-3 3 3-3 3" />
    </svg>
  );
}

function SectionHead({ title, allTo, allLabel }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{title}</h2>
      <Link to={allTo} className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
        {allLabel}
        <Arrow />
      </Link>
    </div>
  );
}

export default function ResourcesPage() {
  const { lang, t } = useApp();
  const r = t.resources;
  useDocumentMeta(meta.title[lang], r.intro);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const latestPosts = POSTS.slice(0, 3);
  const featuredCases = CASES.slice(0, 2);
  const popularHelp = featuredHelp().slice(0, 4);

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="cyan">// {r.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {r.title}
            <span className="eco-gradient-text">
              {r.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{r.intro}</p>
        </div>

        {/* Quick links */}
        <h2 className="mb-4 text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{r.explore}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((key, i) => {
            const route = routeByKey(key);
            return (
              <Reveal key={key} delay={i * 50}>
                <Link to={route.path} className="group flex h-full flex-col rounded-2xl eco-card p-5 hover:ring-cyan-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[16px] tracking-tight text-slate-900 dark:text-slate-100">{route.nav[lang]}</span>
                    <span className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"><Arrow /></span>
                  </div>
                  <p className="mt-2 flex-1 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{r.links[key]}</p>
                  {key === 'impact' && (
                    <Sparkline data={NETWORK_TREND} color="#0EA5E9" width={120} height={22} dot={false} className="mt-3 h-5 w-full" />
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Latest posts */}
        <div className="mt-14">
          <SectionHead title={r.blog} allTo="/blog" allLabel={r.blogAll} />
          <div className="grid gap-4 sm:grid-cols-3">
            {latestPosts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 50}>
                <Link to={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-2xl eco-card p-5 hover:ring-cyan-500/30 transition">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 font-semibold">{p.tag[lang]}</span>
                    <span className="text-slate-400 tabular-nums">{fmtDate(p.date)}</span>
                  </div>
                  <h3 className="mt-2.5 font-display text-[15.5px] leading-snug tracking-tight text-slate-900 dark:text-slate-100">{p.title[lang]}</h3>
                  <p className="mt-1.5 flex-1 text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{p.excerpt[lang]}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Featured cases */}
        <div className="mt-14">
          <SectionHead title={r.cases} allTo="/cases" allLabel={r.casesAll} />
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredCases.map((c, i) => {
              const headline = c.results[0];
              return (
                <Reveal key={c.slug} delay={i * 50}>
                  <Link to={`/cases/${c.slug}`} className="group flex h-full flex-col rounded-2xl eco-card p-6 hover:ring-cyan-500/30 transition">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold" style={{ backgroundColor: `${c.accent}1f`, color: c.accent }}>{c.city}</span>
                      <span className="text-slate-500 dark:text-slate-400">{c.sector[lang]}</span>
                    </div>
                    <h3 className="mt-2.5 font-display text-[17px] tracking-tight text-slate-900 dark:text-slate-100">{c.client[lang]}</h3>
                    <p className="mt-1.5 flex-1 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{c.summary[lang]}</p>
                    <div className="mt-3 font-display text-[22px] leading-none tracking-tight tabular-nums" style={{ color: c.accent }}>
                      {headline.value}
                      {headline.unit[lang] && <span className="ml-1 text-[11px] font-medium text-slate-400">{headline.unit[lang]}</span>}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{headline.label[lang]}</div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Popular help */}
        <div className="mt-14">
          <SectionHead title={r.help} allTo="/help" allLabel={r.helpAll} />
          <div className="grid gap-3 sm:grid-cols-2">
            {popularHelp.map((e, i) => (
              <Reveal key={e.id} delay={i * 50}>
                <Link to={`/help#${e.id}`} className="group flex items-center justify-between gap-3 rounded-xl eco-card p-4 hover:ring-cyan-500/30 transition">
                  <span className="text-[13.5px] font-medium text-slate-800 dark:text-slate-200">{e.q[lang]}</span>
                  <span className="shrink-0 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"><Arrow /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
