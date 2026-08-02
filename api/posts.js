import { handlePosts } from './_lib/db/posts.db.js';

// Vercel serverless function — public, read-only blog API. Returns the
// DB-published posts (or a single one via ?slug=). With no DATABASE_URL it
// returns an empty list and the site stays on its static POSTS, unchanged.
export default async function handler(req, res) {
  const query = req.query || Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);
  const cookieHeader = req.headers.cookie || '';
  const { status, body } = await handlePosts(req.method, query, cookieHeader, process.env);
  res.status(status).json(body);
}
