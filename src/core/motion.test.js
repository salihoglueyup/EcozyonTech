import { describe, it, expect, afterEach, vi } from 'vitest';
import { EASING, DURATION, prefersReducedMotion } from './motion';

afterEach(() => vi.restoreAllMocks());

describe('motion tokens', () => {
  it('exposes named easings and an ascending duration scale', () => {
    expect(EASING.out).toMatch(/^cubic-bezier/);
    expect(EASING.inOut).toMatch(/^cubic-bezier/);
    expect(DURATION.fast).toBeLessThan(DURATION.base);
    expect(DURATION.base).toBeLessThan(DURATION.slow);
    expect(DURATION.slow).toBeLessThan(DURATION.reveal);
  });
});

describe('prefersReducedMotion', () => {
  it('is false when the media query does not match', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false });
    expect(prefersReducedMotion()).toBe(false);
  });
  it('is true when the user prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true });
    expect(prefersReducedMotion()).toBe(true);
  });
});
