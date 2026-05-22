import { describe, it, expect } from 'vitest';
import { POSTS, postTags, filterByTag, searchPosts, readingTime } from './posts';

describe('postTags', () => {
  it('returns distinct tags in first-appearance order', () => {
    const tags = postTags(POSTS);
    const ids = tags.map((t) => t.id);
    expect(ids).toEqual([...new Set(ids)]); // no duplicates
    expect(ids).toEqual(POSTS.map((p) => p.tag.en).filter((v, i, a) => a.indexOf(v) === i));
  });

  it('carries both translations on each tag label', () => {
    for (const tg of postTags(POSTS)) {
      expect(tg.label).toHaveProperty('tr');
      expect(tg.label).toHaveProperty('en');
      expect(tg.id).toBe(tg.label.en);
    }
  });

  it('collapses duplicates from a synthetic list', () => {
    const list = [
      { slug: 'a', tag: { tr: 'Rehber', en: 'Guide' } },
      { slug: 'b', tag: { tr: 'Rehber', en: 'Guide' } },
      { slug: 'c', tag: { tr: 'Donanım', en: 'Hardware' } },
    ];
    expect(postTags(list).map((t) => t.id)).toEqual(['Guide', 'Hardware']);
  });
});

describe('filterByTag', () => {
  it('returns every post when the tag id is null or empty', () => {
    expect(filterByTag(POSTS, null)).toBe(POSTS);
    expect(filterByTag(POSTS, '')).toBe(POSTS);
  });

  it('keeps only posts whose English tag matches the id', () => {
    const guide = filterByTag(POSTS, 'Guide');
    expect(guide.length).toBeGreaterThan(0);
    expect(guide.every((p) => p.tag.en === 'Guide')).toBe(true);
  });

  it('returns an empty list for an unknown tag', () => {
    expect(filterByTag(POSTS, 'Nope')).toEqual([]);
  });

  it('filters by the stable English id regardless of display language', () => {
    // The TR label of the same tag must still resolve through the EN id.
    const post = POSTS[0];
    expect(filterByTag(POSTS, post.tag.en).includes(post)).toBe(true);
    expect(filterByTag(POSTS, post.tag.tr)).toEqual([]); // TR string is not the id
  });
});

describe('searchPosts', () => {
  it('returns every post for an empty or whitespace query', () => {
    expect(searchPosts(POSTS, '', 'tr')).toBe(POSTS);
    expect(searchPosts(POSTS, '   ', 'en')).toBe(POSTS);
    expect(searchPosts(POSTS, null, 'tr')).toBe(POSTS);
  });

  it('matches the title case-insensitively in the active language', () => {
    const hits = searchPosts(POSTS, 'KARBON', 'tr');
    expect(hits.length).toBe(1);
    expect(hits[0].slug).toBe('carbon-budget-basics');
  });

  it('matches text in the post body', () => {
    const hits = searchPosts(POSTS, 'baseline', 'en');
    expect(hits.map((p) => p.slug)).toContain('carbon-budget-basics');
  });

  it('is language-scoped — an EN-only term misses under tr', () => {
    expect(searchPosts(POSTS, 'community', 'tr')).toEqual([]);
    expect(searchPosts(POSTS, 'community', 'en').length).toBeGreaterThan(0);
  });

  it('composes with filterByTag (AND semantics)', () => {
    const scoped = searchPosts(filterByTag(POSTS, 'Guide'), 'karbon', 'tr');
    expect(scoped.every((p) => p.tag.en === 'Guide')).toBe(true);
    expect(scoped.length).toBe(1);
  });

  it('returns empty for a term that appears nowhere', () => {
    expect(searchPosts(POSTS, 'zzzznotfound', 'tr')).toEqual([]);
  });
});

describe('readingTime', () => {
  it('is at least 1 minute even for an empty body', () => {
    expect(readingTime({ body: { tr: [] } }, 'tr')).toBe(1);
    expect(readingTime({}, 'en')).toBe(1);
  });
});
