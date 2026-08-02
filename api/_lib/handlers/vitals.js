// Web Vitals ingest — framework-neutral, shared by the Vercel function and the
// Vite dev middleware, and unit-tested directly. Validates the beacon payload
// and forwards it to a pluggable sink (env-configured webhook), mirroring the
// forms deliver() pattern: works in demo mode with no secrets.

const NAMES = new Set(['CLS', 'FCP', 'INP', 'LCP', 'TTFB']);
const RATINGS = new Set(['good', 'needs-improvement', 'poor']);

const clampStr = (v, max) => String(v ?? '').trim().slice(0, max);
const json = (status, body) => ({ status, body });

// Validate + normalize a single metric beacon. Returns the cleaned metric on
// success (422 with a reason otherwise).
export function processVitals(input = {}) {
  const name = clampStr(input.name, 8);
  const value = Number(input.value);
  const rating = clampStr(input.rating, 24);

  if (!NAMES.has(name)) return json(422, { ok: false, error: 'bad_name' });
  if (!Number.isFinite(value) || value < 0) return json(422, { ok: false, error: 'bad_value' });

  return json(200, {
    ok: true,
    metric: {
      name,
      value: Math.round(value * 1000) / 1000,
      rating: RATINGS.has(rating) ? rating : 'unknown',
      id: clampStr(input.id, 64),
      path: clampStr(input.path, 200),
    },
  });
}

// Forward a validated metric to an env-configured webhook. With no
// VITALS_WEBHOOK_URL it runs in demo mode (no-op) so the portfolio works
// without secrets.
export async function forwardVitals(metric, env = process.env) {
  if (!env.VITALS_WEBHOOK_URL) {
    return { forwarded: false, demo: true };
  }
  try {
    const res = await fetch(env.VITALS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    });
    return { forwarded: res.ok, demo: false };
  } catch {
    return { forwarded: false, demo: false, error: true };
  }
}

// Shared HTTP entry. Beacons are fire-and-forget, so a valid metric acks with
// 204 (no body) to stay cheap; invalid payloads get a 422 for direct callers.
export async function handleVitals(method, body, env = process.env) {
  if (method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  const result = processVitals(body || {});
  if (result.status !== 200) return result;
  try {
    await forwardVitals(result.body.metric, env);
  } catch {
    /* never fail a telemetry beacon on a sink hiccup */
  }
  return json(204, null);
}
