// Pure, side-effect-free content search across every content type (pages,
// blog posts, help answers, case studies, changelog releases, open roles).
// The ⌘K palette owns the UI; everything here is deterministic and unit-tested.
//
// Flow: buildSearchDocs(...) flattens the data into weighted text docs once,
// then searchDocs(docs, query) ranks them for a query (multi-term AND, with
// title matches weighted above body matches). Diacritic/case-insensitive.

// Fold a string for matching: lowercase + strip combining diacritics so
// "İstanbul" / "istanbul" / "Istanbul" all compare equal. Deterministic.
export const fold = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Text of a blog body block (string blocks, or heading objects {h, id}).
const blockText = (b) => (typeof b === 'string' ? b : b?.h || '');

// Field weights — a hit in the title counts far more than one in the body.
const W_TITLE = 6;
const W_HINT = 3;
const W_BODY = 1;

// Build the flat doc list. Each doc: { id, type, title, hint, to, title_f,
// hint_f, body_f } where *_f are pre-folded haystacks (so search does no
// repeated folding). `lang` selects the active language strings.
export function buildSearchDocs({ routes = [], posts = [], help = [], cases = [], changelog = [], jobs = [], integrations = [], lang = 'tr' } = {}) {
  const pick = (o) => (o ? o[lang] ?? o.en ?? '' : '');
  const docs = [];

  for (const r of routes) {
    if (r.path === '*' || r.path.includes(':')) continue;
    docs.push(makeDoc({ id: `page:${r.path}`, type: 'page', title: pick(r.nav) || r.path, hint: '', body: '', to: r.path }));
  }

  for (const p of posts) {
    const body = [pick(p.excerpt), ...((p.body?.[lang] || []).map(blockText))].join(' ');
    docs.push(makeDoc({ id: `post:${p.slug}`, type: 'post', title: pick(p.title), hint: pick(p.tag), body, to: `/blog/${p.slug}` }));
  }

  for (const h of help) {
    docs.push(makeDoc({ id: `help:${h.id}`, type: 'help', title: pick(h.q), hint: pick(h.category), body: pick(h.a), to: `/help#${h.id}` }));
  }

  for (const c of cases) {
    const body = [
      pick(c.summary),
      ...((c.challenge?.[lang]) || []),
      ...((c.approach?.[lang]) || []),
    ].join(' ');
    docs.push(makeDoc({ id: `case:${c.slug}`, type: 'case', title: pick(c.client), hint: c.city, body: `${pick(c.sector)} ${body}`, to: `/cases/${c.slug}` }));
  }

  for (const rel of changelog) {
    const body = (rel.changes || []).map((ch) => pick(ch.text)).join(' ');
    docs.push(makeDoc({ id: `changelog:${rel.version}`, type: 'changelog', title: `v${rel.version} — ${pick(rel.title)}`, hint: `v${rel.version}`, body, to: '/changelog' }));
  }

  for (const j of jobs) {
    const body = [...((j.responsibilities?.[lang]) || []), ...((j.requirements?.[lang]) || []), pick(j.location)].join(' ');
    docs.push(makeDoc({ id: `job:${j.id}`, type: 'job', title: pick(j.title), hint: pick(j.team), body, to: `/careers?job=${j.id}` }));
  }

  for (const i of integrations) {
    const body = [pick(i.tagline), ...((i.description?.[lang]) || []), ...((i.features?.[lang]) || [])].join(' ');
    docs.push(makeDoc({ id: `integration:${i.slug}`, type: 'integration', title: i.name, hint: pick(i.category), body, to: `/integrations/${i.slug}` }));
  }

  return docs;
}

function makeDoc({ id, type, title, hint, body, to }) {
  return { id, type, title, hint, to, title_f: fold(title), hint_f: fold(hint), body_f: fold(body) };
}

// Score a single doc against the folded query terms. Returns 0 when any term
// is missing entirely (AND semantics), otherwise the summed field weight of
// the best location each term was found, plus a small bonus when the title
// starts with the whole query.
export function scoreDoc(doc, terms, query_f) {
  let score = 0;
  for (const term of terms) {
    let best = 0;
    if (doc.title_f.includes(term)) best = W_TITLE;
    else if (doc.hint_f.includes(term)) best = W_HINT;
    else if (doc.body_f.includes(term)) best = W_BODY;
    if (best === 0) return 0; // term not found anywhere → drop the doc
    score += best;
  }
  if (query_f && doc.title_f.startsWith(query_f)) score += 4;
  return score;
}

// Tie-break ordering between types when scores match (pages first, jobs last).
const TYPE_RANK = { page: 0, post: 1, help: 2, case: 3, integration: 4, changelog: 5, job: 6 };

// Rank docs for a query. Empty query → []. Returns the matching docs sorted by
// score (desc), then type rank, then title, each carrying its `score`.
export function searchDocs(docs, query, { limit = 40 } = {}) {
  const query_f = fold(query).trim();
  if (!query_f) return [];
  const terms = query_f.split(/\s+/).filter(Boolean);
  const out = [];
  for (const doc of docs) {
    const score = scoreDoc(doc, terms, query_f);
    if (score > 0) out.push({ ...doc, score });
  }
  out.sort(
    (a, b) =>
      b.score - a.score ||
      (TYPE_RANK[a.type] ?? 9) - (TYPE_RANK[b.type] ?? 9) ||
      a.title.localeCompare(b.title),
  );
  return out.slice(0, limit);
}
