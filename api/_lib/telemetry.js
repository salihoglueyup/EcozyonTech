// Telemetry event ingest — framework-neutral, shared by the Vercel function and
// the Vite dev/preview middleware, and unit-tested directly. Validates the
// beacon payload and forwards it to a pluggable sink (env-configured webhook),
// mirroring the vitals reporter: works in demo mode with no secrets.

const NAME_RE = /^[a-z0-9_]+$/i;
const MAX_PROPS = 12;

const clampStr = (v, max) => String(v ?? '').trim().slice(0, max);
const json = (status, body) => ({ status, body });

// Validate + normalize a single event beacon. Returns the cleaned event on
// success (422 with a reason otherwise). Props are reduced to short primitives.
export function processEvent(input = {}) {
  const name = clampStr(input.name, 40);
  if (!name || !NAME_RE.test(name)) return json(422, { ok: false, error: 'bad_name' });

  const props = {};
  if (input.props && typeof input.props === 'object' && !Array.isArray(input.props)) {
    for (const [k, v] of Object.entries(input.props)) {
      if (Object.keys(props).length >= MAX_PROPS) break;
      const key = clampStr(k, 40);
      if (!key) continue;
      if (typeof v === 'number' && Number.isFinite(v)) props[key] = v;
      else if (typeof v === 'boolean') props[key] = v;
      else if (typeof v === 'string' && v) props[key] = clampStr(v, 120);
    }
  }

  return json(200, { ok: true, event: { name, props, path: clampStr(input.path, 200) } });
}

// Forward a validated event to an env-configured webhook. With no
// TELEMETRY_WEBHOOK_URL it runs in demo mode (no-op) so the portfolio works
// without secrets.
export async function forwardEvent(event, env = process.env) {
  if (!env.TELEMETRY_WEBHOOK_URL) return { forwarded: false, demo: true };
  try {
    const res = await fetch(env.TELEMETRY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return { forwarded: res.ok, demo: false };
  } catch {
    return { forwarded: false, demo: false, error: true };
  }
}

// Shared HTTP entry. Beacons are fire-and-forget, so a valid event acks with
// 204 (no body) to stay cheap; invalid payloads get a 422 for direct callers.
export async function handleEvent(method, body, env = process.env) {
  if (method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  const result = processEvent(body || {});
  if (result.status !== 200) return result;
  try {
    await forwardEvent(result.body.event, env);
  } catch {
    /* swallow — never fail a beacon on a sink error */
  }
  return json(204, null);
}
