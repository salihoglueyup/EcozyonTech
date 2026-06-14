import { describe, it, expect } from 'vitest';
import { findLoader, prefetchRoute } from './routePrefetch';

describe('findLoader', () => {
  it('resolves the home route', () => {
    expect(typeof findLoader('/')).toBe('function');
  });

  it('resolves static routes', () => {
    expect(typeof findLoader('/services')).toBe('function');
    expect(typeof findLoader('/pricing')).toBe('function');
  });

  it('resolves dynamic :param routes', () => {
    expect(typeof findLoader('/cases/acme')).toBe('function');
    expect(typeof findLoader('/integrations/slack')).toBe('function');
    expect(typeof findLoader('/blog/some-post')).toBe('function');
  });

  it('matches the more specific blog tag route distinctly from a post', () => {
    const tag = findLoader('/blog/tag/iklim');
    const post = findLoader('/blog/some-post');
    expect(typeof tag).toBe('function');
    expect(typeof post).toBe('function');
    expect(tag).not.toBe(post); // different chunks
  });

  it('returns null for unknown paths (never prefetches NotFound)', () => {
    expect(findLoader('/definitely-not-a-route')).toBeNull();
    expect(findLoader('/blog/a/b/c')).toBeNull();
  });
});

describe('prefetchRoute', () => {
  it('is a no-op for non-strings and unknown paths (no throw)', () => {
    expect(() => prefetchRoute(undefined)).not.toThrow();
    expect(() => prefetchRoute('/nope')).not.toThrow();
  });

  it('warms a known route without throwing and stays idempotent', () => {
    expect(() => {
      prefetchRoute('/pricing');
      prefetchRoute('/pricing');
    }).not.toThrow();
  });
});
