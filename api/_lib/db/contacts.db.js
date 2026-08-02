// DB-backed contacts — the persistence layer for the CMS Contacts Tab.
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
  
  // Ensure we also trigger posts schema since we're setting up
  await ensurePostsSchema(env);

  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id          serial PRIMARY KEY,
      name        text NOT NULL,
      company     text,
      email       text NOT NULL,
      purpose     text NOT NULL,
      message     text,
      status      text NOT NULL DEFAULT 'unread',
      created_at  timestamptz NOT NULL DEFAULT now()
    )`;
  return true;
}

export async function createContact(data, env = process.env) {
  const sql = await getSql(env);
  if (!sql) {
    console.log('[contacts-db] db unconfigured, skipping insert', data);
    return null;
  }
  
  await ensureSchema(env);

  const rows = await sql`
    INSERT INTO contacts (name, company, email, purpose, message, status)
    VALUES (${data.name}, ${data.company}, ${data.email}, ${data.purpose}, ${data.message || ''}, 'unread')
    RETURNING id`;
  return rows[0];
}

export async function listAll(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, name, company, email, purpose, message, status, created_at
    FROM contacts ORDER BY created_at DESC`;
  return rows;
}

export async function updateStatus(id, status, env = process.env) {
  const sql = await getSql(env);
  if (!sql) return null;
  const rows = await sql`
    UPDATE contacts SET status = ${status} WHERE id = ${id}
    RETURNING id`;
  return rows[0];
}

export async function remove(id, env = process.env) {
  const sql = await getSql(env);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`DELETE FROM contacts WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
