import { handleCallback } from '../_lib/admin-auth.js';
import { applyResult, originOf } from './_send.js';

// GET /api/admin/callback?code&state → exchange code, set the session cookie.
export default async function handler(req, res) {
  const query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);
  applyResult(res, await handleCallback(query, req.headers.cookie || '', process.env, originOf(req)));
}
