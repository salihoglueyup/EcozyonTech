import { handleLogout } from '../_lib/admin-auth.js';
import { applyResult } from './_send.js';

// POST /api/admin/logout → clear the session cookie.
export default function handler(req, res) {
  applyResult(res, handleLogout());
}
