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
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id          serial PRIMARY KEY,
      email       text UNIQUE NOT NULL,
      created_at  timestamptz NOT NULL DEFAULT now()
    )`;
  return true;
}

export async function addSubscriber(email, env = process.env) {
  const sql = await getSql(env);
  if (!sql) {
    console.log('[newsletter-db] db unconfigured, skipping insert', email);
    return null;
  }
  
  await ensureSchema(env);

  try {
    const rows = await sql`
      INSERT INTO newsletter_subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
      RETURNING id`;
    return rows[0];
  } catch (err) {
    console.error('Newsletter insert error:', err);
    return null;
  }
}

export async function listAll(env = process.env) {
  const sql = await getSql(env);
  if (!sql) return [];
  const rows = await sql`
    SELECT id, email, created_at
    FROM newsletter_subscribers ORDER BY created_at DESC`;
  return rows;
}

export async function remove(id, env = process.env) {
  const sql = await getSql(env);
  if (!sql) throw new Error('db_unconfigured');
  const rows = await sql`DELETE FROM newsletter_subscribers WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
