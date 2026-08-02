import { ensureSchema as ensurePostsSchema } from './posts.db.js';

export const isConfigured = (env = process.env) => Boolean(env.DATABASE_URL);

let _sql; // memoized neon tagged-template client
async function getSql(env = process.env) {
  if (!isConfigured(env)) return null;
  if (!_sql) {
    const { neon } = await import('@neondatabase/serverless');
    _sql = neon(env.DATABASE_URL);
  }
  return _sql;
}

export async function ensureSchema(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return false;
  
  await sql`
    CREATE TABLE IF NOT EXISTS job_applications (
      id              serial PRIMARY KEY,
      name            text NOT NULL,
      email           text NOT NULL,
      role            text NOT NULL,
      note            text,
      company_website text,
      status          text NOT NULL DEFAULT 'unread',
      created_at      timestamptz NOT NULL DEFAULT now()
    )`;
  return true;
}

export async function createApplication(data, env = process.env) {
  const sql = await getSql(env);
  if (!sql) {
    console.log('[careers-db] db unconfigured, skipping insert', data);
    return null;
  }
  
  await ensureSchema(env);

  const rows = await sql`
    INSERT INTO job_applications (name, email, role, note, company_website, status)
    VALUES (${data.name}, ${data.email}, ${data.role}, ${data.note || ''}, ${data.company_website || ''}, 'unread')
    RETURNING id`;
  return rows[0];
}

export async function listAll(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, name, email, role, note, company_website, status, created_at
    FROM job_applications ORDER BY created_at DESC`;
  return rows;
}

export async function updateStatus(id, status, env = process.env) {
  const sql = await getSql(env);
  if (!sql) return null;
  const rows = await sql`
    UPDATE job_applications SET status = ${status} WHERE id = ${id}
    RETURNING id`;
  return rows[0];
}

export async function remove(id, env = process.env) {
  const sql = await getSql(env);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`DELETE FROM job_applications WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
