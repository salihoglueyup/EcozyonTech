// Basit, Manuel E-posta ve Şifre bazlı Admin Auth sistemi.
// Karmaşık GitHub OAuth yerine statik admin@ecozyon.com ve ecozyon2026 
// bilgilerine dayalı Basic form tabanlı giriş kullanıyoruz.
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

const ADMIN_EMAIL = 'admin@ecozyon.com';
const ADMIN_PASS = 'ecozyon2026';

const json = (status, body, headers = {}) => ({ status, headers, body });
const redirect = (location, setCookie) => ({
  status: 302,
  headers: setCookie ? { Location: location, 'Set-Cookie': setCookie } : { Location: location },
  body: null,
});

/** 
 * Admin paneline form ile post edildiğinde tetiklenir (Login endpoint'i)
 * Beklenen: { email, password }
 */
export function handleLogin(body = {}, env = process.env, origin) {
  // Eğer girişler doğruysa
  if (body.email === ADMIN_EMAIL && body.password === ADMIN_PASS) {
    // Oturum (Session) yarat
    const session = createSession('Ecozyon Admin', env);
    return json(200, { ok: true }, {
      'Set-Cookie': serializeCookie(COOKIE_NAME, session, { maxAge: MAX_AGE })
    });
  }

  // Hatalı şifre
  return json(401, { ok: false, error: 'invalid_credentials' });
}

/** 
 * GET /api/admin/me → `{ login }` for a valid admin session, else 401. 
 */
export function handleMe(cookieHeader = '', env = process.env) {
  const session = readSession(cookieHeader, env);
  // Basit manuel yetkilendirme (Session varsa başarılı)
  if (!session) {
    return json(401, { ok: false, authenticated: false });
  }
  return json(200, { ok: true, authenticated: true, login: session.login || 'Ecozyon Admin' });
}

/** 
 * POST /api/admin/logout → clear the session cookie. 
 */
export function handleLogout() {
  return json(200, { ok: true }, { 'Set-Cookie': clearCookie(COOKIE_NAME) });
}

// OAuth'a özel fonksiyonlar artık kullanılmıyor, ancak vite.config.js kırmaması için boş dönüyoruz.
export async function handleCallback() {
  return redirect('/admin');
}
