// Content registry — the single place every searchable content collection
// declares how it maps to a search doc (id, title, hint, body, to). buildSearchDocs
// iterates this instead of taking one parameter per type, so adding a new
// content type means registering it here once — not editing search.js plus the
// ⌘K palette, the /search page and the 404. `pick` is a lang-bound accessor
// injected by the consumer; `lang` is passed for array-valued bodies.
import { POSTS, blockText } from '@/core/data/posts';
import { HELP } from '@/core/data/help';
import { CASES } from '@/core/data/cases';
import { CHANGELOG } from '@/core/data/changelog';
import { JOBS } from '@/core/data/jobs';
import { INTEGRATIONS } from '@/core/data/integrations';
import { GLOSSARY } from '@/core/data/glossary';

export const COLLECTIONS = [
  {
    type: 'post',
    items: POSTS,
    toDoc: (p, pick, lang) => ({
      id: `post:${p.slug}`,
      title: pick(p.title),
      hint: pick(p.tag),
      body: [pick(p.excerpt), ...((p.body?.[lang] || []).map(blockText))].join(' '),
      to: `/blog/${p.slug}`,
    }),
  },
  {
    type: 'help',
    items: HELP,
    toDoc: (h, pick) => ({
      id: `help:${h.id}`,
      title: pick(h.q),
      hint: pick(h.category),
      body: pick(h.a),
      to: `/help#${h.id}`,
    }),
  },
  {
    type: 'term',
    items: GLOSSARY,
    toDoc: (term, pick) => ({
      id: `term:${term.id}`,
      title: pick(term.term),
      hint: pick(term.category),
      body: pick(term.definition),
      to: `/glossary#${term.id}`,
    }),
  },
  {
    type: 'case',
    items: CASES,
    toDoc: (c, pick, lang) => ({
      id: `case:${c.slug}`,
      title: pick(c.client),
      hint: c.city,
      body: `${pick(c.sector)} ${[pick(c.summary), ...((c.challenge?.[lang]) || []), ...((c.approach?.[lang]) || [])].join(' ')}`,
      to: `/cases/${c.slug}`,
    }),
  },
  {
    type: 'integration',
    items: INTEGRATIONS,
    toDoc: (i, pick, lang) => ({
      id: `integration:${i.slug}`,
      title: i.name,
      hint: pick(i.category),
      body: [pick(i.tagline), ...((i.description?.[lang]) || []), ...((i.features?.[lang]) || [])].join(' '),
      to: `/integrations/${i.slug}`,
    }),
  },
  {
    type: 'changelog',
    items: CHANGELOG,
    toDoc: (rel, pick) => ({
      id: `changelog:${rel.version}`,
      title: `v${rel.version} — ${pick(rel.title)}`,
      hint: `v${rel.version}`,
      body: (rel.changes || []).map((ch) => pick(ch.text)).join(' '),
      to: '/changelog',
    }),
  },
  {
    type: 'job',
    items: JOBS,
    toDoc: (j, pick, lang) => ({
      id: `job:${j.id}`,
      title: pick(j.title),
      hint: pick(j.team),
      body: [...((j.responsibilities?.[lang]) || []), ...((j.requirements?.[lang]) || []), pick(j.location)].join(' '),
      to: `/careers?job=${j.id}`,
    }),
  },
];
