// Pure, framework-neutral form processing — shared by the Vercel functions
// and the Vite dev middleware, and unit-tested directly.

const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

const clamp = (v, max) => String(v ?? '').trim().slice(0, max);

function json(status, body) {
  return { status, body };
}

// ── Rate limiting ──────────────────────────────────────────────────────────
// Soft per-IP sliding window. Module-scoped Map persists for the lifetime
// of a serverless instance, so this is best-effort — Vercel may spin up
// multiple instances and a determined attacker can cycle IPs. Good enough
// to deflect honest flooding (refresh-spamming the submit button).
const WINDOWS = {
  contact:    { ms: 60_000, max: 5 },
  newsletter: { ms: 60_000, max: 3 },
};
const HITS = new Map(); // key: `${kind}:${ip}` → array of timestamps

export function checkRate(kind, ip, now = Date.now()) {
  const cfg = WINDOWS[kind];
  if (!cfg || !ip) return { ok: true };
  const key = `${kind}:${ip}`;
  const arr = (HITS.get(key) || []).filter((t) => now - t < cfg.ms);
  if (arr.length >= cfg.max) {
    return { ok: false, retryAfterMs: cfg.ms - (now - arr[0]) };
  }
  arr.push(now);
  HITS.set(key, arr);
  return { ok: true };
}

export function _resetRateLimits() {
  HITS.clear(); // test-only helper, exported for unit tests
}

/**
 * Validate + normalize a contact submission.
 * Honeypot: a non-empty `company_website` means a bot — we pretend success.
 */
export function processContact(input = {}) {
  if (input.company_website) return json(200, { ok: true }); // silent honeypot

  const name = clamp(input.name, 80);
  const company = clamp(input.company, 120);
  const email = clamp(input.email, 160);
  const message = clamp(input.message, 2000);
  const purpose = clamp(input.purpose, 80);

  const errors = {};
  if (name.length < 2) errors.name = 'required';
  if (company.length < 1) errors.company = 'required';
  if (!EMAIL_RE.test(email)) errors.email = 'invalid';

  if (Object.keys(errors).length) {
    return json(422, { ok: false, errors });
  }
  return json(200, {
    ok: true,
    data: { name, company, email, message, purpose },
  });
}

/** Validate a newsletter subscription. */
export function processNewsletter(input = {}) {
  if (input.company_website) return json(200, { ok: true });
  const email = clamp(input.email, 160);
  if (!EMAIL_RE.test(email)) {
    return json(422, { ok: false, errors: { email: 'invalid' } });
  }
  return json(200, { ok: true, data: { email } });
}

/**
 * Optionally deliver via Resend if RESEND_API_KEY is set; otherwise run in
 * demo mode (log + succeed) so the portfolio works without secrets.
 */
export async function deliver(kind, data, env = process.env) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    console.log(`[forms:${kind}] demo-mode (no RESEND_API_KEY), payload:`, data);
    return { delivered: false, demo: true };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Ecozyon Site <onboarding@resend.dev>',
      to: env.CONTACT_TO,
      subject: `[Ecozyon] ${kind} — ${data.email}`,
      text: JSON.stringify(data, null, 2),
    }),
  });
  return { delivered: res.ok, demo: false };
}

/** Shared HTTP entry used by both the Vercel adapter and the dev middleware. */
export async function handle(kind, method, body, env, ip) {
  if (method !== 'POST') {
    return json(405, { ok: false, error: 'method_not_allowed' });
  }
  const rate = checkRate(kind, ip);
  if (!rate.ok) {
    return json(429, {
      ok: false,
      error: 'rate_limited',
      retryAfterMs: rate.retryAfterMs,
    });
  }
  const process = kind === 'contact' ? processContact : processNewsletter;
  const result = process(body || {});
  if (result.status === 200 && result.body.data) {
    try {
      await deliver(kind, result.body.data, env);
    } catch (err) {
      console.error(`[forms:${kind}] delivery error`, err);
      // Don't fail the user submission on delivery hiccups.
    }
  }
  return result;
}
