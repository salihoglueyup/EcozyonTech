import { handleAdminPost } from '../../_lib/admin-posts.js';
import { applyResult } from '../_send.js';

// /api/admin/posts/:id — PUT (update) + DELETE. Admin-gated.
export default async function handler(req, res) {
  const id = req.query?.id ?? new URL(req.url, 'http://localhost').pathname.split('/').pop();
  applyResult(res, await handleAdminPost(req.method, id, req.body, req.headers.cookie || '', process.env));
}
