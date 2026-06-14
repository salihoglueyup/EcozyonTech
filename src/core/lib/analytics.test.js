import { describe, it, expect, afterEach, vi } from 'vitest';
import { track, isOptedOut, sanitizeProps, onAnalyticsEvent } from './analytics';

function setDNT(value) {
  Object.defineProperty(navigator, 'doNotTrack', { value, configurable: true });
}

afterEach(() => {
  setDNT(null);
  Object.defineProperty(navigator, 'globalPrivacyControl', { value: undefined, configurable: true });
  vi.restoreAllMocks();
});

describe('sanitizeProps', () => {
  it('keeps short primitives and drops objects/arrays/PII blobs', () => {
    const out = sanitizeProps({ to: '/pricing', n: 3, ok: true, obj: { a: 1 }, arr: [1], empty: '' });
    expect(out).toEqual({ to: '/pricing', n: 3, ok: true });
  });
  it('truncates long strings to 80 chars', () => {
    expect(sanitizeProps({ s: 'x'.repeat(200) }).s).toHaveLength(80);
  });
});

describe('isOptedOut', () => {
  it('is false by default', () => {
    setDNT(null);
    expect(isOptedOut()).toBe(false);
  });
  it('honors Do-Not-Track', () => {
    setDNT('1');
    expect(isOptedOut()).toBe(true);
  });
  it('honors Global Privacy Control', () => {
    setDNT(null);
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    expect(isOptedOut()).toBe(true);
  });
});

describe('track', () => {
  it('notifies subscribers with a sanitized event and returns true', () => {
    setDNT(null);
    const seen = [];
    const off = onAnalyticsEvent((e) => seen.push(e));
    const ok = track('cta_click', { to: '/pricing', bad: { x: 1 } });
    off();
    expect(ok).toBe(true);
    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({ name: 'cta_click', props: { to: '/pricing' } });
    expect(seen[0].props.bad).toBeUndefined();
    expect(typeof seen[0].path).toBe('string');
  });

  it('does nothing when the user has opted out', () => {
    setDNT('1');
    const seen = [];
    const off = onAnalyticsEvent((e) => seen.push(e));
    const ok = track('cta_click', { to: '/pricing' });
    off();
    expect(ok).toBe(false);
    expect(seen).toHaveLength(0);
  });

  it('ignores an empty/invalid event name', () => {
    setDNT(null);
    expect(track('')).toBe(false);
    expect(track(null)).toBe(false);
  });
});
