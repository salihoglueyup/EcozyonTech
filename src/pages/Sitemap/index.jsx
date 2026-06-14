import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey, FOOTER_GROUPS, routesInGroup } from '@/core/config/site';
import { POSTS } from '@/core/data/posts';
import { CASES } from '@/core/data/cases';
import { INTEGRATIONS } from '@/core/data/integrations';

const meta = routeByKey('sitemap');

function LinkList({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li key={it.to}>
          <Link to={it.to} className="text-[13.5px] text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            {it.label}
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
        <div className="mb-10">
          <Tag color="cyan">// {s.eyebrow}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {s.title}
            <span className="eco-gradient-text">
              {s.titleAccent}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{s.intro}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pageGroups.map((g) => (
            <div key={g.id}>
              <h2 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{g.title}</h2>
              <LinkList items={g.items} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 border-t border-slate-900/[.06] dark:border-white/[.06] pt-10">
          {dynamicGroups.map((g) => (
            <div key={g.id}>
              <h2 className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-3">{g.title}</h2>
              <LinkList items={g.items} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
