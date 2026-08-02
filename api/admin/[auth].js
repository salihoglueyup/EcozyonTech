import { handleLogin, handleCallback, handleMe, handleLogout } from '../_lib/auth/admin.auth.js';
import { applyResult, originOf } from './_send.js';

export default async function handler(req, res) {
  const { auth } = req.query;

  if (auth === 'login') {
    return applyResult(res, handleLogin(process.env, originOf(req)));
  }
  if (auth === 'callback') {
    return applyResult(res, await handleCallback(req.query, req.headers.cookie, process.env, originOf(req)));
  }
  if (auth === 'me') {
    return applyResult(res, handleMe(req.headers.cookie, process.env));
  }
  if (auth === 'logout') {
    return applyResult(res, handleLogout());
  }

  res.status(404).json({ error: 'Not found' });
}
