import { handleLogin } from '../_lib/auth/admin.auth.js';
import { applyResult, originOf } from './_send.js';

// GET /api/admin/login → redirect the browser to GitHub's OAuth consent.
export default function handler(req, res) {
  applyResult(res, handleLogin(process.env, originOf(req)));
}
