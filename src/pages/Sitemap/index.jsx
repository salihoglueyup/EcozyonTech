import { Link } from 'react-router-dom';
import { PageHeader } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey, FOOTER_GROUPS, routesInGroup } from '@/core/config/site';
import { SpotlightCard } from '@/shared/ui/SpotlightCard';
import { POSTS } from '@/core/data/posts';
import { CASES } from '@/core/data/cases';
import { INTEGRATIONS } from '@/core/data/integrations';

const meta = routeByKey('sitemap');

function LinkList({ items }) {
  return (
    <ul className="space-y-3 mt-4">
      {items.map((it) => (
        <li key={it.to}>
          <Link to={it.to} className="group flex items-center justify-between text-[13.5px] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            <span>{it.label}</span>
            <svg className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7.5 6 10l5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  const { lang, t } = useApp();
  const s = t.sitemap;
  useDocumentMeta(meta.title[lang], s.intro);

  // Derived from the single IA grouping in config (no places filter = every
  // route in the group, including home/search which only the sitemap lists).
  const pageGroups = FOOTER_GROUPS.map((g) => ({
    id: g.id,
    title: s[g.id],
    items: routesInGroup(g.id).map((r) => ({ to: r.path, label: r.nav[lang] || r.nav.en })),
  }));

  const dynamicGroups = [
    { id: 'posts', title: s.posts, items: POSTS.map((p) => ({ to: `/blog/${p.slug}`, label: p.title[lang] })) },
    { id: 'cases', title: s.cases, items: CASES.map((c) => ({ to: `/cases/${c.slug}`, label: c.client[lang] })) },
    { id: 'integrationsGroup', title: s.integrationsGroup, items: INTEGRATIONS.map((i) => ({ to: `/integrations/${i.slug}`, label: i.name })) },
  ];

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-4xl px-6">
        <PageHeader
          eyebrow={s.eyebrow}
          title={s.title}
          titleAccent={s.titleAccent}
          intro={s.intro}
          className="mb-10"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pageGroups.map((g) => (
            <SpotlightCard key={g.id} className="p-6">
              <h2 className="flex items-center gap-2 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 border-b border-slate-900/[.06] dark:border-white/[.06] pb-3 mb-3">
                {g.title}
                <span className="ml-auto rounded-full bg-slate-900/[.05] dark:bg-white/[.06] px-2 py-0.5 text-[9px] tabular-nums text-slate-500 dark:text-slate-400">{g.items.length}</span>
              </h2>
              <LinkList items={g.items} />
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {dynamicGroups.map((g) => (
            <SpotlightCard key={g.id} className="p-6">
              <h2 className="flex items-center gap-2 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 border-b border-slate-900/[.06] dark:border-white/[.06] pb-3 mb-3">
                {g.title}
                <span className="ml-auto rounded-full bg-slate-900/[.05] dark:bg-white/[.06] px-2 py-0.5 text-[9px] tabular-nums text-slate-500 dark:text-slate-400">{g.items.length}</span>
              </h2>
              <LinkList items={g.items} />
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
