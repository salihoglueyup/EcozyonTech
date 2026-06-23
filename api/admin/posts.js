import { handleAdminPosts } from '../_lib/admin-posts.js';
import { applyResult } from './_send.js';

// /api/admin/posts — GET (list incl. drafts) + POST (create). Admin-gated.
export default async function handler(req, res) {
  applyResult(res, await handleAdminPosts(req.method, req.body, req.headers.cookie || '', process.env));
}
