import { describe, it, expect } from 'vitest';
import { buildFeed } from './feed';
import { POSTS } from '@/core/data/posts';
import { SITE } from '@/core/config/site';

const now = new Date('2026-05-22T00:00:00Z');

describe('buildFeed', () => {
  it('emits valid RSS 2.0 with one item per post', () => {
    const xml = buildFeed({ posts: POSTS, site: SITE, lang: 'tr', now });
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<channel>');
    expect((xml.match(/<item>/g) || []).length).toBe(POSTS.length);
    expect(xml).toContain('<atom:link');
    expect(xml).toContain(`${SITE.url}/feed.xml`);
  });

  it('links each item to its canonical post URL with a permalink guid', () => {
    const xml = buildFeed({ posts: POSTS, site: SITE, now });
    for (const p of POSTS) {
      const url = `${SITE.url}/blog/${p.slug}`;
      expect(xml).toContain(`<link>${url}</link>`);
      expect(xml).toContain(`<guid isPermaLink="true">${url}</guid>`);
    }
  });

  it('escapes XML-special characters in titles', () => {
    const xml = buildFeed({
      posts: [{ slug: 'x', date: '2026-01-01', title: { tr: 'A & B <c>' }, excerpt: { tr: '"q"' } }],
      site: SITE,
      now,
    });
    expect(xml).toContain('A &amp; B &lt;c&gt;');
    expect(xml).not.toContain('A & B <c>');
  });

  it('falls back to now for a missing/invalid date instead of emitting NaN', () => {
    const xml = buildFeed({
      posts: [{ slug: 'x', title: { tr: 't' }, excerpt: { tr: 'e' } }],
      site: SITE,
      now,
    });
    expect(xml).not.toContain('Invalid Date');
    expect(xml).toContain(now.toUTCString());
  });

  it('produces an empty channel for no posts', () => {
    const xml = buildFeed({ posts: [], site: SITE, now });
    expect(xml).toContain('<channel>');
    expect(xml).not.toContain('<item>');
  });
});
