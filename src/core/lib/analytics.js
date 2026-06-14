// Privacy-first, cookieless event analytics. Honors Do-Not-Track / Global
// Privacy Control, stores nothing, and sends no PII — just an event name, a few
// sanitized primitive props and the current path. In dev each event is logged
// and pushed to in-process listeners (the dev EventsHud); in prod it is
// beaconed to /api/analytics. Telemetry must never throw into the app.
//
// `track`, `isOptedOut` and `sanitizeProps` are unit-tested; the prod beacon
// branch (sendBeacon) is excluded from coverage like the vitals reporter.

const ENDPOINT = '/api/analytics';

const listeners = new Set();
export function onAnalyticsEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Respect the user's opt-out signals (DNT across vendor prefixes, GPC).
export function isOptedOut() {
  if (typeof navigator === 'undefined') return false;
  const dnt =
    navigator.doNotTrack ||
    (typeof window !== 'undefined' && window.doNotTrack) ||
    navigator.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes') return true;
  if (navigator.globalPrivacyControl === true) return true;
  return false;
}

// Keep only short string/number/boolean props — never objects, arrays or PII.
export function sanitizeProps(props = {}) {
  const out = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string' && v) out[k] = v.slice(0, 80);
  }
  return out;
}

export function track(name, props = {}) {
  if (typeof window === 'undefined') return false;
  if (typeof name !== 'string' || !name) return false;
  if (isOptedOut()) return false;

  const event = {
    name: name.slice(0, 40),
    props: sanitizeProps(props),
    path: typeof location !== 'undefined' ? location.pathname : '/',
    ts: Date.now(),
  };

  for (const fn of listeners) {
    try {
      fn(event);
    } catch {
      /* a dev overlay subscriber must never break telemetry */
    }
  }

  if (import.meta.env.DEV) {
    console.debug('[track]', event.name, event.props);
    return true;
  }

  try {
    const body = JSON.stringify({ name: event.name, props: event.props, path: event.path });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(ENDPOINT, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    }
  } catch {
    /* swallow — telemetry must never break the app */
  }
  return true;
}
