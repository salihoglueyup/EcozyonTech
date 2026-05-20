// Pins the production security header set so the next person who edits
// vercel.json can't silently weaken it. Each assertion below maps to a header
// observatory.mozilla.org grades on.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cfg = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));

function pickHeaders(source) {
  const block = cfg.headers.find((h) => h.source === source);
  if (!block) return {};
  return Object.fromEntries(block.headers.map((h) => [h.key, h.value]));
}

describe('vercel.json security headers', () => {
  const h = pickHeaders('/(.*)');

  it('declares Content-Security-Policy with safe defaults', () => {
    const csp = h['Content-Security-Policy'] || '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('forces HTTPS with HSTS preload', () => {
    expect(h['Strict-Transport-Security']).toMatch(/max-age=\d+/);
    expect(h['Strict-Transport-Security']).toContain('preload');
  });

  it('blocks MIME-sniffing and clickjacking', () => {
    expect(h['X-Content-Type-Options']).toBe('nosniff');
    expect(h['X-Frame-Options']).toBe('DENY');
  });

  it('limits referrer leakage and feature surface', () => {
    expect(h['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(h['Permissions-Policy']).toContain('camera=()');
    expect(h['Permissions-Policy']).toContain('geolocation=()');
  });

  it('caches /assets/* immutably', () => {
    const a = pickHeaders('/assets/(.*)');
    expect(a['Cache-Control']).toMatch(/immutable/);
  });
});
