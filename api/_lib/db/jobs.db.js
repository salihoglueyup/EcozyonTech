// DB-backed job listings — the persistence layer for the CMS.
//
// DB-OPTIONAL: If no database is configured, read functions return [] 
// and the static `src/core/data/jobs.js` remains the single source of truth.

const clamp = (v, max) => String(v ?? '').trim().slice(0, max);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = new Set(['draft', 'published']);

const biField = (v, max) => ({ tr: clamp(v?.tr, max), en: clamp(v?.en, max) });
const biArray = (v, max) => ({
  tr: Array.isArray(v?.tr) ? v.tr.map(s => clamp(s, max)).filter(Boolean) : [],
  en: Array.isArray(v?.en) ? v.en.map(s => clamp(s, max)).filter(Boolean) : [],
});

export function mapRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    team: row.team || { tr: '', en: '' },
    type: row.type || { tr: '', en: '' },
    location: row.location || { tr: '', en: '' },
    level: row.level || { tr: '', en: '' },
    title: row.title || { tr: '', en: '' },
    desc: row.desc || { tr: '', en: '' },
    responsibilities: row.responsibilities || { tr: [], en: [] },
    requirements: row.requirements || { tr: [], en: [] },
  };
}

export function validateJob(input = {}) {
  const errors = {};

  const slug = clamp(input.slug, 100).toLowerCase().replace(/[^a-z0-9-]+/g, '');
  if (!SLUG_RE.test(slug)) errors.slug = 'invalid';

  const status = clamp(input.status, 20) || 'draft';
  if (!STATUSES.has(status)) errors.status = 'invalid';

  const title = biField(input.title, 160);
  if (!title.tr || !title.en) errors.title = 'required';

  const team = biField(input.team, 80);
  const type = biField(input.type, 80);
  const location = biField(input.location, 80);
  const level = biField(input.level, 80);
  const desc = biField(input.desc, 400);
  
  if (!desc.tr || !desc.en) errors.desc = 'required';

  const responsibilities = biArray(input.responsibilities, 400);
  const requirements = biArray(input.requirements, 400);

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { slug, status, team, type, location, level, title, desc, responsibilities, requirements } };
}

export const isConfigured = (env = process.env) => Boolean(env.DATABASE_URL);

let _sql;
async function getSql(env = process.env) {
  if (!isConfigured(env)) return null;
  if (!_sql) {
    const { neon } = await import('@neondatabase/serverless');
    _sql = neon(env.DATABASE_URL);
  }
  return _sql;
}

async function resolveSql(env, injected) {
  return injected || (await getSql(env));
}

export async function ensureSchema(env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return false;
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id               serial PRIMARY KEY,
      slug             text UNIQUE NOT NULL,
      status           text NOT NULL DEFAULT 'draft',
      team             jsonb NOT NULL,
      type             jsonb NOT NULL,
      location         jsonb NOT NULL,
      level            jsonb NOT NULL,
      title            jsonb NOT NULL,
      desc_field       jsonb NOT NULL,
      responsibilities jsonb NOT NULL,
      requirements     jsonb NOT NULL,
      created_at       timestamptz NOT NULL DEFAULT now(),
      updated_at       timestamptz NOT NULL DEFAULT now()
    )`;
  return true;
}

export async function listPublished(env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, status, team, type, location, level, title, desc_field as desc, responsibilities, requirements
    FROM jobs WHERE status = 'published' ORDER BY created_at DESC, id DESC`;
  return rows.map(mapRow);
}

export async function listAll(env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, slug, status, team, type, location, level, title, desc_field as desc, responsibilities, requirements
    FROM jobs ORDER BY created_at DESC, id DESC`;
  return rows.map(mapRow);
}

export async function create(data, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`
    INSERT INTO jobs (slug, status, team, type, location, level, title, desc_field, responsibilities, requirements)
    VALUES (${data.slug}, ${data.status},
            ${JSON.stringify(data.team)}, ${JSON.stringify(data.type)},
            ${JSON.stringify(data.location)}, ${JSON.stringify(data.level)},
            ${JSON.stringify(data.title)}, ${JSON.stringify(data.desc)},
            ${JSON.stringify(data.responsibilities)}, ${JSON.stringify(data.requirements)})
    RETURNING id, slug, status, team, type, location, level, title, desc_field as desc, responsibilities, requirements`;
  return mapRow(rows[0]);
}

export async function update(id, data, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`
    UPDATE jobs SET
      slug = ${data.slug}, status = ${data.status},
      team = ${JSON.stringify(data.team)}, type = ${JSON.stringify(data.type)},
      location = ${JSON.stringify(data.location)}, level = ${JSON.stringify(data.level)},
      title = ${JSON.stringify(data.title)}, desc_field = ${JSON.stringify(data.desc)},
      responsibilities = ${JSON.stringify(data.responsibilities)}, requirements = ${JSON.stringify(data.requirements)},
      updated_at = now()
    WHERE id = ${id}
    RETURNING id, slug, status, team, type, location, level, title, desc_field as desc, responsibilities, requirements`;
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function remove(id, env = process.env, injected) {
  const sql = await resolveSql(env, injected);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`DELETE FROM jobs WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
