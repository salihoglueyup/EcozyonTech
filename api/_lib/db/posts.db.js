// DB-backed blog posts — the persistence layer for the CMS.
//
// DB-OPTIONAL by design: every query function guards on DATABASE_URL, so the
// build, the unit tests and `npm run dev` all work with *zero* secrets — when
// no database is configured the read functions return [] (the static
// `src/core/data/posts.js` POSTS remain the only source) and the write
// functions throw a typed `db_unconfigured`. This mirrors the demo-fallback
// philosophy of api/_lib/forms.js `deliver()`.
//
// Bilingual structured fields (title/excerpt/tag/author/body/terms) live in
// jsonb columns; slug/status/date stay scalar so we can filter + order in SQL.
// The post body keeps the existing block-array shape ([{h,id}, "paragraph", …])
// so DB posts render through the *exact* same BlogPost renderer with no escape
// hatch for raw HTML — safe under the strict `script-src 'self'` CSP.

const clamp = (v, max) => String(v ?? '').trim().slice(0, max);
import { readSession } from '../auth/session.js';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = new Set(['draft', 'published']);

// Turkish-aware ASCII fold, then collapse to a URL-safe slug. We map the
// Turkish-specific letters explicitly (dotless ı / ş / ğ don't all decompose
// under NFD) before stripping the remaining diacritics.
const TR_MAP = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i' };
export function slugify(s) {
  return String(s ?? '')
    .replace(/[çğıöşüİ]/g, (c) => TR_MAP[c] || c)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Pure shaping / validation (no DB — fully unit-tested) ────────────────────

/** Map a DB row → a post object identical in shape to a static POSTS entry. */
export function mapRow(row) {
  const date =
    typeof row.date === 'string'
      ? row.date.slice(0, 10)
      : row.date instanceof Date
        ? row.date.toISOString().slice(0, 10)
        : '';
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    date,
    author: row.author || { name: '', role: { tr: '', en: '' } },
    tag: row.tag || { tr: '', en: '' },
    terms: Array.isArray(row.terms) ? row.terms : [],
    title: row.title || { tr: '', en: '' },
    excerpt: row.excerpt || { tr: '', en: '' },
    body: row.body || { tr: [], en: [] },
  };
}

/** Newest-first, with DB posts taking precedence over a static post on slug clash. */
export function dedupBySlug(...lists) {
  const bySlug = new Map();
  for (const list of lists) {
    for (const p of list || []) {
      if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
    }
  }
  return [...bySlug.values()].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || '')),
  );
}

const biField = (v, max) => ({ tr: clamp(v?.tr, max), en: clamp(v?.en, max) });

// A body block is either a paragraph string or a heading `{ h, id }`. We clamp
// paragraphs and (re)derive a stable, language-agnostic anchor id from the
// heading text so TOC/anchors survive a language switch (same rule as posts.js).
function normalizeBody(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .map((b) => {
      if (typeof b === 'string') return clamp(b, 4000);
      const h = clamp(b?.h, 160);
      if (!h) return null;
      return { h, id: slugify(b?.id || h) || 'section' };
    })
    .filter((b) => b !== null && b !== '');
}

/**
 * Validate + normalize a post submission. Returns `{ ok:true, data }` or
 * `{ ok:false, errors }` — the same shape forms.js uses, so the admin UI can
 * render field errors the same way the contact form does.
 */
export function validatePost(input = {}) {
  const errors = {};

  const slug = slugify(input.slug || input.title?.en || input.title?.tr || '');
  if (!SLUG_RE.test(slug)) errors.slug = 'invalid';

  const status = clamp(input.status, 20) || 'draft';
  if (!STATUSES.has(status)) errors.status = 'invalid';

  const date = clamp(input.date, 10);
  if (!DATE_RE.test(date)) errors.date = 'invalid';

  const title = biField(input.title, 160);
  if (!title.tr || !title.en) errors.title = 'required';

  const excerpt = biField(input.excerpt, 400);
  if (!excerpt.tr || !excerpt.en) errors.excerpt = 'required';

  const tag = biField(input.tag, 40);
  if (!tag.tr || !tag.en) errors.tag = 'required';

  const author = {
    name: clamp(input.author?.name, 80),
    role: { tr: clamp(input.author?.role?.tr, 60), en: clamp(input.author?.role?.en, 60) },
  };
  if (!author.name) errors.author = 'required';

  const body = { tr: normalizeBody(input.body?.tr), en: normalizeBody(input.body?.en) };
  if (!body.tr.length || !body.en.length) errors.body = 'required';

  const terms = Array.isArray(input.terms)
    ? input.terms.map((x) => clamp(x, 60)).filter(Boolean).slice(0, 24)
    : [];

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { slug, status, date, title, excerpt, tag, author, terms, body } };
}

// ── DB I/O (guarded on DATABASE_URL; `sql` injectable for unit tests) ────────

export const isConfigured = (env = process.env) => Boolean(env.DATABASE_URL);

let _sql; // memoized neon tagged-template client (only created when configured)
async function getSql(env = process.env) {
  if (!isConfigured(env)) return null;
  if (!_sql) {
    const { neon } = await import('@neondatabase/serverless');
    _sql = neon(env.DATABASE_URL);
  }
  return _sql;
}

/** Resolve the sql client: an injected one (tests) wins over the real driver. */
async function resolveSql(env, injected) {
  return injected || (await getSql(env));
}

/** Create the posts table if missing. Idempotent; safe to call on cold start. */
export async function ensureSchema(env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return false;
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id          serial PRIMARY KEY,
      slug        text UNIQUE NOT NULL,
      status      text NOT NULL DEFAULT 'draft',
      date        date NOT NULL,
      author      jsonb NOT NULL,
      tag         jsonb NOT NULL,
      terms       jsonb NOT NULL DEFAULT '[]'::jsonb,
      title       jsonb NOT NULL,
      excerpt     jsonb NOT NULL,
      body        jsonb NOT NULL,
      created_at  timestamptz NOT NULL DEFAULT now(),
      updated_at  timestamptz NOT NULL DEFAULT now()
    )`;
  return true;
}

/** Published posts, newest-first. Empty array when no DB is configured. */
export async function listPublished(env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, status, date, author, tag, terms, title, excerpt, body
    FROM posts WHERE status = 'published' ORDER BY date DESC, id DESC`;
  return rows.map(mapRow);
}

/** All posts incl. drafts (admin), newest-first. Empty when no DB. */
export async function listAll(env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, status, date, author, tag, terms, title, excerpt, body
    FROM posts ORDER BY date DESC, id DESC`;
  return rows.map(mapRow);
}

/** A single post by slug, or null. */
export async function getBySlug(slug, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return null;
  const rows = await sql`
    SELECT id, slug, status, date, author, tag, terms, title, excerpt, body
    FROM posts WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ? mapRow(rows[0]) : null;
}

/** Insert a validated post (data from validatePost). Throws if no DB. */
export async function create(data, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`
    INSERT INTO posts (slug, status, date, author, tag, terms, title, excerpt, body)
    VALUES (${data.slug}, ${data.status}, ${data.date},
            ${JSON.stringify(data.author)}, ${JSON.stringify(data.tag)},
            ${JSON.stringify(data.terms)}, ${JSON.stringify(data.title)},
            ${JSON.stringify(data.excerpt)}, ${JSON.stringify(data.body)})
    RETURNING id, slug, status, date, author, tag, terms, title, excerpt, body`;
  return mapRow(rows[0]);
}

/** Update a post by id with a validated payload. Returns the row, or null. */
export async function update(id, data, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`
    UPDATE posts SET
      slug = ${data.slug}, status = ${data.status}, date = ${data.date},
      author = ${JSON.stringify(data.author)}, tag = ${JSON.stringify(data.tag)},
      terms = ${JSON.stringify(data.terms)}, title = ${JSON.stringify(data.title)},
      excerpt = ${JSON.stringify(data.excerpt)}, body = ${JSON.stringify(data.body)},
      updated_at = now()
    WHERE id = ${id}
    RETURNING id, slug, status, date, author, tag, terms, title, excerpt, body`;
  return rows[0] ? mapRow(rows[0]) : null;
}

/** Delete a post by id. Returns true if a row was removed. */
export async function remove(id, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`DELETE FROM posts WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// ── Public HTTP handler (shared by the Vercel fn + the Vite dev middleware) ──

/**
 * GET-only read API for the public site. `?slug=` returns a single *published*
 * post (drafts are invisible to the public); otherwise the published list. No
 * DB → empty list / 404, so the site stays on static POSTS with no errors.
 */
export async function handlePosts(method, query = {}, cookieHeader = '', env = process.env) {
  if (method !== 'GET') {
    return { status: 405, body: { ok: false, error: 'method_not_allowed' } };
  }
  
  const isPreview = query.preview === 'true' && Boolean(readSession(cookieHeader, env));
  const slug = query.slug;

  if (slug) {
    const post = await getBySlug(slug, env);
    if (!post || (post.status !== 'published' && !isPreview)) {
      return { status: 404, body: { ok: false, error: 'not_found' } };
    }
    return { status: 200, body: { ok: true, post } };
  }
  
  const posts = isPreview ? await listAll(env) : await listPublished(env);
  return { status: 200, body: { ok: true, posts } };
}
