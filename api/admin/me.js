import { handleMe } from '../_lib/admin-auth.js';
import { applyResult } from './_send.js';

// GET /api/admin/me → { login } for a valid admin session, else 401.
export default function handler(req, res) {
  applyResult(res, handleMe(req.headers.cookie || '', process.env));
}
