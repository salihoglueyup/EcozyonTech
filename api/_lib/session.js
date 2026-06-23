// Stateless admin session — an HMAC-signed cookie, no JWT/auth dependency.
//
// The session payload is `${base64url(json)}.${hmac-sha256}` signed with
// SESSION_SECRET. No DB row is needed: verify() re-derives the MAC and checks
// expiry. With no SESSION_SECRET set, sign/verify return null (the admin simply
// can't be authenticated) so the public site is unaffected.
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export const COOKIE_NAME = 'eco_admin';
export const STATE_COOKIE_NAME = 'eco_oauth_state';
export const MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

const b64url = (input) => Buffer.from(input).toString('base64url');
const secretOf = (env) => env.SESSION_SECRET || '';

/** Sign a JSON-serializable payload → `body.mac`, or null if no secret. */
export function sign(payload, env = process.env) {
  const secret = secretOf(env);
  if (!secret) return null;
  const body = b64url(JSON.stringify(payload));
  const mac = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${mac}`;
}

/** Verify a token's MAC + expiry; returns the payload or null. Constant-time. */
export function verify(token, env = process.env) {
  const secret = secretOf(env);
  if (!secret || typeof token !== 'string') return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload && typeof payload.exp === 'number' && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Parse a Cookie header into a `{ name: value }` map. */
export function parseCookies(header = '') {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    if (!k) continue;
    out[k] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

/** Serialize a Set-Cookie value. Secure + HttpOnly + SameSite=Lax by default. */
export function serializeCookie(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`);
  parts.push(`Path=${opts.path || '/'}`);
  if (opts.httpOnly !== false) parts.push('HttpOnly');
  parts.push(`SameSite=${opts.sameSite || 'Lax'}`);
  if (opts.secure !== false) parts.push('Secure');
  return parts.join('; ');
}

/** A Set-Cookie that immediately clears `name`. */
export const clearCookie = (name) => serializeCookie(name, '', { maxAge: 0 });

/** A random, URL-safe OAuth `state` / CSRF token. */
export const randomState = () => randomBytes(16).toString('hex');

/** Is `login` in the comma-separated ADMIN_GITHUB_LOGINS allowlist? */
export function isAllowed(login, env = process.env) {
  const list = String(env.ADMIN_GITHUB_LOGINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(login) && list.includes(String(login).toLowerCase());
}

/** Build a signed session token for an authenticated admin login. */
export function createSession(login, env = process.env, now = Date.now()) {
  return sign({ login, iat: now, exp: now + MAX_AGE * 1000 }, env);
}

/** Read + verify the session cookie from a request's Cookie header. */
export function readSession(cookieHeader = '', env = process.env) {
  const cookies = parseCookies(cookieHeader);
  return verify(cookies[COOKIE_NAME], env);
}

/**
 * Gate for write endpoints: returns the session payload only when the cookie is
 * valid AND its login is still on the allowlist; otherwise null.
 */
export function requireAdmin(cookieHeader = '', env = process.env) {
  const session = readSession(cookieHeader, env);
  return session && isAllowed(session.login, env) ? session : null;
}
