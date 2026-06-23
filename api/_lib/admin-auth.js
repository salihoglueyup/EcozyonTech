// GitHub OAuth flow for the admin, as framework-neutral handlers that return
// `{ status, headers, body }`. The thin Vercel functions in api/admin/*.js and
// the Vite dev middleware both translate these to a real response, so the flow
// lives in one tested place. Network calls take an injectable `fetchImpl` so
// the success / forbidden / error branches are unit-testable without GitHub.
import {
  COOKIE_NAME,
  STATE_COOKIE_NAME,
  MAX_AGE,
  serializeCookie,
  clearCookie,
  parseCookies,
  randomState,
  isAllowed,
  createSession,
  readSession,
} from './session.js';

const GH_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GH_TOKEN = 'https://github.com/login/oauth/access_token';
const GH_USER = 'https://api.github.com/user';

const json = (status, body, headers = {}) => ({ status, headers, body });
const redirect = (location, setCookie) => ({
  status: 302,
  headers: setCookie ? { Location: location, 'Set-Cookie': setCookie } : { Location: location },
  body: null,
});

/** True when all three OAuth/session secrets are present. */
export const isAuthConfigured = (env = process.env) =>
  Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.SESSION_SECRET);

function authorizeUrl(state, env, origin) {
  const u = new URL(GH_AUTHORIZE);
  u.searchParams.set('client_id', env.GITHUB_CLIENT_ID || '');
  u.searchParams.set('scope', 'read:user');
  u.searchParams.set('state', state);
  if (origin) u.searchParams.set('redirect_uri', `${origin}/api/admin/callback`);
  return u.toString();
}

/** GET /api/admin/login → redirect to GitHub, stashing `state` in a cookie. */
export function handleLogin(env = process.env, origin) {
  if (!isAuthConfigured(env)) return redirect('/admin?error=unconfigured');
  const state = randomState();
  return redirect(
    authorizeUrl(state, env, origin),
    serializeCookie(STATE_COOKIE_NAME, state, { maxAge: 600 }),
  );
}

async function exchangeCode(code, env, origin, fetchImpl) {
  const res = await fetchImpl(GH_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: origin ? `${origin}/api/admin/callback` : undefined,
    }),
  });
  const data = await res.json();
  if (!data || !data.access_token) throw new Error('token_exchange_failed');
  return data.access_token;
}

async function fetchLogin(token, fetchImpl) {
  const res = await fetchImpl(GH_USER, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'ecozyon-admin' },
  });
  const user = await res.json();
  if (!user || !user.login) throw new Error('user_fetch_failed');
  return user.login;
}

/**
 * GET /api/admin/callback?code&state → verify state, exchange code, check the
 * allowlist, set the session cookie (success) or redirect with ?error=.
 */
export async function handleCallback(query = {}, cookieHeader = '', env = process.env, origin, fetchImpl = fetch) {
  const cookies = parseCookies(cookieHeader);
  const clearState = clearCookie(STATE_COOKIE_NAME);
  if (!isAuthConfigured(env)) return redirect('/admin?error=unconfigured', clearState);
  const { code, state } = query;
  if (!code || !state || state !== cookies[STATE_COOKIE_NAME]) {
    return redirect('/admin?error=state', clearState);
  }
  let login;
  try {
    login = await fetchLogin(await exchangeCode(code, env, origin, fetchImpl), fetchImpl);
  } catch {
    return redirect('/admin?error=oauth', clearState);
  }
  if (!isAllowed(login, env)) return redirect('/admin?error=forbidden', clearState);
  const session = createSession(login, env);
  return {
    status: 302,
    headers: {
      Location: '/admin',
      'Set-Cookie': [clearState, serializeCookie(COOKIE_NAME, session, { maxAge: MAX_AGE })],
    },
    body: null,
  };
}

/** GET /api/admin/me → `{ login }` for a valid admin session, else 401. */
export function handleMe(cookieHeader = '', env = process.env) {
  const session = readSession(cookieHeader, env);
  if (!session || !isAllowed(session.login, env)) {
    return json(401, { ok: false, authenticated: false });
  }
  return json(200, { ok: true, authenticated: true, login: session.login });
}

/** POST /api/admin/logout → clear the session cookie. */
export function handleLogout() {
  return json(200, { ok: true }, { 'Set-Cookie': clearCookie(COOKIE_NAME) });
}
