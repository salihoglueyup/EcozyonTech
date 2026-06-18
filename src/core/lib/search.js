// Pure, side-effect-free content search across every content type (pages,
// blog posts, help answers, case studies, changelog releases, open roles).
// The ⌘K palette owns the UI; everything here is deterministic and unit-tested.
//
// Flow: buildSearchDocs(...) flattens the data into weighted text docs once,
// then searchDocs(docs, query) ranks them for a query (multi-term AND, with
// title matches weighted above body matches). Diacritic/case-insensitive.
import { COLLECTIONS } from '@/core/content/registry';

// Fold a string for matching: lowercase + strip combining diacritics so
// "İstanbul" / "istanbul" / "Istanbul" all compare equal. Deterministic.
export const fold = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Field weights — a hit in the title counts far more than one in the body.
const W_TITLE = 6;
const W_HINT = 3;
const W_BODY = 1;

// Build the flat doc list from the routes (pages) + the content registry. Each
// registered collection self-describes its mapping, so this never needs editing
// when a content type is added. `collections` is injectable for tests; it
// defaults to the real registry. Each doc gains pre-folded *_f haystacks.
export function buildSearchDocs({ routes = [], collections = COLLECTIONS, lang = 'tr' } = {}) {
  const pick = (o) => (o ? o[lang] ?? o.en ?? '' : '');
  const docs = [];

  for (const r of routes) {
    if (r.path === '*' || r.path.includes(':')) continue;
    docs.push(makeDoc({ id: `page:${r.path}`, type: 'page', title: pick(r.nav) || r.path, hint: '', body: '', to: r.path }));
  }

  for (const col of collections) {
    for (const item of col.items) {
      docs.push(makeDoc({ ...col.toDoc(item, pick, lang), type: col.type }));
    }
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

// Split `text` into segments flagged hit/miss against the query terms, for
// highlight rendering (the /search result titles wrap hits in <mark>). Uses the
// same `fold` as ranking (diacritic/case-insensitive) but keeps an offset map
// so the highlighted ranges land on the ORIGINAL characters. Pure + unit-tested.
export function highlightSegments(text, query) {
  const str = String(text ?? '');
  const query_f = fold(query).trim();
  if (!query_f || !str) return [{ text: str, hit: false }];
  const terms = query_f.split(/\s+/).filter(Boolean);
  if (!terms.length) return [{ text: str, hit: false }];

  // Folded haystack + a map from each folded-char index back to the original
  // index it came from (fold can drop/expand chars, so this stays exact).
  let folded = '';
  const map = [];
  for (let i = 0; i < str.length; i++) {
    const f = fold(str[i]);
    for (let k = 0; k < f.length; k++) map.push(i);
    folded += f;
  }

  const hits = new Array(str.length).fill(false);
  for (const term of terms) {
    let from = 0;
    let at;
    while ((at = folded.indexOf(term, from)) !== -1) {
      for (let i = map[at]; i <= map[at + term.length - 1]; i++) hits[i] = true;
      from = at + term.length;
    }
  }

  // Coalesce runs of the same hit-state into contiguous segments.
  const segments = [];
  let cur = '';
  let curHit = hits[0];
  for (let i = 0; i < str.length; i++) {
    if (hits[i] === curHit) cur += str[i];
    else {
      segments.push({ text: cur, hit: curHit });
      cur = str[i];
      curHit = hits[i];
    }
  }
  if (cur) segments.push({ text: cur, hit: curHit });
  return segments;
}

// Tie-break ordering between types when scores match (pages first, jobs last).
const TYPE_RANK = { page: 0, post: 1, help: 2, term: 3, case: 4, integration: 5, changelog: 6, job: 7 };

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
