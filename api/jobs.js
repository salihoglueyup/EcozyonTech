import { listPublished, isConfigured } from './_lib/db/jobs.db.js';

// Vercel serverless function — public, read-only jobs API. Returns the
// DB-published jobs. With no DATABASE_URL it returns an empty list and 
// the site stays on its static JOBS, unchanged.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const env = process.env;
  if (!isConfigured(env)) {
    return res.status(200).json({ ok: true, jobs: [] });
  }
  
  const jobs = await listPublished(env);
  res.status(200).json({ ok: true, jobs });
}
