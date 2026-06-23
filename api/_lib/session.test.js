import { describe, it, expect } from 'vitest';
import {
  sign,
  verify,
  parseCookies,
  serializeCookie,
  clearCookie,
  isAllowed,
  createSession,
  readSession,
  requireAdmin,
  COOKIE_NAME,
  STATE_COOKIE_NAME,
} from './session.js';
import {
  isAuthConfigured,
  handleLogin,
  handleCallback,
  handleMe,
  handleLogout,
} from './admin-auth.js';

const env = { SESSION_SECRET: 's3cr3t-test-key', ADMIN_GITHUB_LOGINS: 'ada, Grace' };

// Fake fetch: first call (token exchange) returns `tokenJson`, second (user)
// returns `userJson`.
function makeFetch(tokenJson, userJson) {
  let n = 0;
  return () => Promise.resolve({ json: () => Promise.resolve(n++ === 0 ? tokenJson : userJson) });
}

describe('sign/verify', () => {
  it('round-trips a payload', () => {
    const token = sign({ login: 'ada' }, env);
    expect(verify(token, env)).toMatchObject({ login: 'ada' });
  });
  it('returns null without a secret', () => {
    expect(sign({ login: 'ada' }, {})).toBeNull();
    expect(verify('a.b', {})).toBeNull();
  });
  it('rejects a tampered body and a tampered mac', () => {
    const token = sign({ login: 'ada' }, env);
    const [body, mac] = token.split('.');
    const otherBody = sign({ login: 'mallory' }, env).split('.')[0];
    expect(verify(`${otherBody}.${mac}`, env)).toBeNull();
    expect(verify(`${body}.${mac}x`, env)).toBeNull();
  });
  it('rejects a malformed token', () => {
    expect(verify('no-dot', env)).toBeNull();
    expect(verify(42, env)).toBeNull();
  });
  it('rejects an expired payload', () => {
    const expired = sign({ login: 'ada', exp: Date.now() - 1000 }, env);
    expect(verify(expired, env)).toBeNull();
  });
});

describe('cookies', () => {
  it('parses a cookie header', () => {
    expect(parseCookies('a=1; b=hello%20world')).toEqual({ a: '1', b: 'hello world' });
    expect(parseCookies('')).toEqual({});
  });
  it('serializes with secure attributes by default', () => {
    const c = serializeCookie('x', 'y', { maxAge: 60 });
    expect(c).toContain('x=y');
    expect(c).toContain('Max-Age=60');
    expect(c).toContain('HttpOnly');
    expect(c).toContain('SameSite=Lax');
    expect(c).toContain('Secure');
  });
  it('clearCookie expires the cookie', () => {
    expect(clearCookie('x')).toContain('Max-Age=0');
  });
});

describe('isAllowed', () => {
  it('matches the allowlist case-insensitively', () => {
    expect(isAllowed('ada', env)).toBe(true);
    expect(isAllowed('GRACE', env)).toBe(true);
    expect(isAllowed('mallory', env)).toBe(false);
    expect(isAllowed('', env)).toBe(false);
    expect(isAllowed('ada', {})).toBe(false);
  });
});

describe('session helpers', () => {
  it('createSession → readSession round-trips', () => {
    const token = createSession('ada', env);
    const raw = `${COOKIE_NAME}=${token}`;
    expect(readSession(raw, env)).toMatchObject({ login: 'ada' });
  });
  it('requireAdmin passes only for an allowlisted, valid session', () => {
    const ok = `${COOKIE_NAME}=${createSession('ada', env)}`;
    const notAllowed = `${COOKIE_NAME}=${createSession('mallory', env)}`;
    expect(requireAdmin(ok, env)).toMatchObject({ login: 'ada' });
    expect(requireAdmin(notAllowed, env)).toBeNull();
    expect(requireAdmin('', env)).toBeNull();
  });
});

describe('admin-auth flow', () => {
  const full = { ...env, GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'csec' };

  it('isAuthConfigured reflects the three secrets', () => {
    expect(isAuthConfigured(full)).toBe(true);
    expect(isAuthConfigured(env)).toBe(false);
  });

  it('handleLogin redirects to GitHub and sets a state cookie when configured', () => {
    const r = handleLogin(full, 'https://site.test');
    expect(r.status).toBe(302);
    expect(r.headers.Location).toContain('github.com/login/oauth/authorize');
    expect(r.headers.Location).toContain('client_id=cid');
    expect(r.headers['Set-Cookie']).toContain(STATE_COOKIE_NAME);
  });

  it('handleLogin redirects to an error when unconfigured', () => {
    expect(handleLogin(env).headers.Location).toBe('/admin?error=unconfigured');
  });

  it('handleCallback rejects a mismatched state', async () => {
    const r = await handleCallback({ code: 'c', state: 'x' }, `${STATE_COOKIE_NAME}=y`, full);
    expect(r.headers.Location).toBe('/admin?error=state');
  });

  it('handleCallback redirects forbidden for a non-allowlisted login', async () => {
    const fetchImpl = makeFetch({ access_token: 't' }, { login: 'mallory' });
    const r = await handleCallback({ code: 'c', state: 's' }, `${STATE_COOKIE_NAME}=s`, full, undefined, fetchImpl);
    expect(r.headers.Location).toBe('/admin?error=forbidden');
  });

  it('handleCallback sets the session cookie on success', async () => {
    const fetchImpl = makeFetch({ access_token: 't' }, { login: 'ada' });
    const r = await handleCallback({ code: 'c', state: 's' }, `${STATE_COOKIE_NAME}=s`, full, undefined, fetchImpl);
    expect(r.status).toBe(302);
    expect(r.headers.Location).toBe('/admin');
    expect(String(r.headers['Set-Cookie'])).toContain(COOKIE_NAME);
  });

  it('handleCallback handles an OAuth/network error', async () => {
    const fetchImpl = () => Promise.resolve({ json: () => Promise.resolve({}) }); // no access_token
    const r = await handleCallback({ code: 'c', state: 's' }, `${STATE_COOKIE_NAME}=s`, full, undefined, fetchImpl);
    expect(r.headers.Location).toBe('/admin?error=oauth');
  });

  it('handleMe is 401 without a session and 200 with one', () => {
    expect(handleMe('', full).status).toBe(401);
    const ok = `${COOKIE_NAME}=${createSession('ada', full)}`;
    const me = handleMe(ok, full);
    expect(me.status).toBe(200);
    expect(me.body.login).toBe('ada');
  });

  it('handleLogout clears the cookie', () => {
    const r = handleLogout();
    expect(r.status).toBe(200);
    expect(r.headers['Set-Cookie']).toContain('Max-Age=0');
  });
});
