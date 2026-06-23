import { describe, it, expect } from 'vitest';
import { linkedinConfigured, postUrl, shareText, publishToLinkedIn, publishPost } from './social.js';

const post = {
  slug: 'hello-world',
  title: { tr: 'Merhaba', en: 'Hello' },
  excerpt: { tr: 'kısa', en: 'short' },
};
const configured = { LINKEDIN_ACCESS_TOKEN: 'tok', LINKEDIN_AUTHOR_URN: 'urn:li:person:abc123' };

describe('helpers', () => {
  it('linkedinConfigured needs both token and URN', () => {
    expect(linkedinConfigured({})).toBe(false);
    expect(linkedinConfigured({ LINKEDIN_ACCESS_TOKEN: 'x' })).toBe(false);
    expect(linkedinConfigured(configured)).toBe(true);
  });
  it('postUrl + shareText build a canonical share', () => {
    expect(postUrl(post)).toMatch(/\/blog\/hello-world$/);
    const text = shareText(post);
    expect(text).toContain('Hello');
    expect(text).toContain('short');
    expect(text).toContain('/blog/hello-world');
  });
});

describe('publishToLinkedIn', () => {
  it('demo-mode without a token', async () => {
    const r = await publishToLinkedIn(post, {});
    expect(r).toEqual({ provider: 'linkedin', posted: false, demo: true });
  });

  it('posts via the UGC API when configured', async () => {
    let captured;
    const fetchImpl = async (url, opts) => {
      captured = { url, opts };
      return { ok: true };
    };
    const r = await publishToLinkedIn(post, configured, fetchImpl);
    expect(r).toEqual({ provider: 'linkedin', posted: true });
    expect(captured.url).toContain('api.linkedin.com');
    expect(captured.opts.headers.Authorization).toBe('Bearer tok');
    const body = JSON.parse(captured.opts.body);
    expect(body.author).toBe('urn:li:person:abc123');
  });

  it('reports a non-OK HTTP response', async () => {
    const r = await publishToLinkedIn(post, configured, async () => ({ ok: false, status: 401 }));
    expect(r).toEqual({ provider: 'linkedin', posted: false, error: 'http_401' });
  });

  it('reports a network error without throwing', async () => {
    const r = await publishToLinkedIn(post, configured, async () => {
      throw new Error('boom');
    });
    expect(r.posted).toBe(false);
    expect(r.error).toBe('boom');
  });
});

describe('publishPost', () => {
  it('returns per-provider results', async () => {
    const results = await publishPost(post, {});
    expect(results).toHaveLength(1);
    expect(results[0].provider).toBe('linkedin');
  });
});
