// Web Vitals RUM bootstrap. In dev each metric is logged so we can see CLS/LCP/INP
// while iterating; in production they're beaconed to /api/vitals as JSON. The
// endpoint is a no-op stub today — wiring it to a real backend (Vercel Log
// Drains, BigQuery, Plausible, etc.) is a one-line swap.
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const ENDPOINT = '/api/vitals';

// In-process subscribers (used by the dev-only VitalsHud overlay). Notified for
// every metric report, in both dev and prod, before any logging/beaconing.
const listeners = new Set();
export function onVitalsReport(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function send(metric) {
  for (const fn of listeners) {
    try {
      fn(metric);
    } catch {
      /* a HUD subscriber must never break telemetry */
    }
  }
  if (import.meta.env.DEV) {
    console.debug('[vitals]', metric.name, Math.round(metric.value), metric.rating);
    return;
  }
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      path: location.pathname,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(ENDPOINT, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    }
  } catch {
    /* swallow — telemetry must never break the app */
  }
}

export function registerVitals() {
  if (typeof window === 'undefined') return;
  onCLS(send);
  onFCP(send);
  onINP(send);
  onLCP(send);
  onTTFB(send);
}
