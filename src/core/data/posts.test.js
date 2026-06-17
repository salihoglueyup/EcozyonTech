import { describe, it, expect } from 'vitest';
import { POSTS, postTags, filterByTag, searchPosts, relatedPosts, postNeighbors, readingTime, blockText, tagSlug, postTagBySlug } from './posts';
import { glossaryByIds } from './glossary';

describe('POSTS data', () => {
  it('every post has a bilingual author byline', () => {
    for (const p of POSTS) {
      expect(p.author?.name, `${p.slug} author`).toBeTruthy();
      expect(p.author.role).toHaveProperty('tr');
      expect(p.author.role).toHaveProperty('en');
    }
  });
});

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

describe('tagSlug / postTagBySlug', () => {
  it('slugifies a tag id and round-trips back to it', () => {
    expect(tagSlug('AI')).toBe('ai');
    expect(tagSlug('Guide')).toBe('guide');
    for (const t of postTags(POSTS)) {
      expect(postTagBySlug(tagSlug(t.id)).id).toBe(t.id);
    }
  });

  it('returns undefined for an unknown slug', () => {
    expect(postTagBySlug('nope')).toBeUndefined();
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

describe('relatedPosts', () => {
  const list = [
    { slug: 'a', date: '2026-04-01', tag: { en: 'Guide' } },
    { slug: 'b', date: '2026-03-01', tag: { en: 'Hardware' } },
    { slug: 'c', date: '2026-02-01', tag: { en: 'Guide' } },
    { slug: 'd', date: '2026-01-01', tag: { en: 'Community' } },
  ];

  it('never includes the post itself', () => {
    const r = relatedPosts(list[0], list, 3);
    expect(r.map((p) => p.slug)).not.toContain('a');
  });

  it('prefers same-tag posts, then falls back to recency', () => {
    // a is Guide; the only other Guide is c, so c must come first.
    const r = relatedPosts(list[0], list, 3);
    expect(r[0].slug).toBe('c');
    // remaining slots filled by most recent of the rest (b before d).
    expect(r.map((p) => p.slug)).toEqual(['c', 'b', 'd']);
  });

  it('respects the n limit and returns [] for no post', () => {
    expect(relatedPosts(list[0], list, 2)).toHaveLength(2);
    expect(relatedPosts(null)).toEqual([]);
  });

  it('works against the real dataset deterministically', () => {
    const r = relatedPosts(POSTS[0]);
    expect(r.length).toBeLessThanOrEqual(2);
    expect(r.every((p) => p.slug !== POSTS[0].slug)).toBe(true);
  });
});

describe('postNeighbors', () => {
  it('returns null prev for the first post and null next for the last', () => {
    const first = postNeighbors(POSTS[0].slug);
    expect(first.prev).toBeNull();
    expect(first.next?.slug).toBe(POSTS[1].slug);

    const last = postNeighbors(POSTS[POSTS.length - 1].slug);
    expect(last.next).toBeNull();
    expect(last.prev?.slug).toBe(POSTS[POSTS.length - 2].slug);
  });

  it('returns both neighbors for a middle post', () => {
    const mid = postNeighbors(POSTS[1].slug);
    expect(mid.prev?.slug).toBe(POSTS[0].slug);
    expect(mid.next?.slug).toBe(POSTS[2].slug);
  });

  it('returns nulls for an unknown slug', () => {
    expect(postNeighbors('nope')).toEqual({ prev: null, next: null });
  });
});

describe('readingTime', () => {
  it('is at least 1 minute even for an empty body', () => {
    expect(readingTime({ body: { tr: [] } }, 'tr')).toBe(1);
    expect(readingTime({}, 'en')).toBe(1);
  });

  it('counts heading-block text alongside paragraphs', () => {
    const post = { body: { en: [{ h: 'A heading here', id: 'x' }, 'one two three'] } };
    expect(readingTime(post, 'en')).toBe(1); // 6 words → rounds to 1, but headings are included
    expect(blockText({ h: 'A heading here', id: 'x' })).toBe('A heading here');
    expect(blockText('plain string')).toBe('plain string');
  });
});

describe('body heading blocks', () => {
  it('every post has heading blocks with ids shared across languages', () => {
    for (const p of POSTS) {
      const trHeads = p.body.tr.filter((b) => typeof b === 'object').map((b) => b.id);
      const enHeads = p.body.en.filter((b) => typeof b === 'object').map((b) => b.id);
      expect(trHeads.length).toBeGreaterThan(0);
      expect(enHeads).toEqual(trHeads); // anchors stay stable on language switch
    }
  });

  it('searchPosts matches heading text', () => {
    const hits = searchPosts(POSTS, 'baseline yaklaşımı', 'tr');
    expect(hits.map((p) => p.slug)).toContain('carbon-budget-basics');
  });
});

describe('post content depth + cross-links', () => {
  it('every post has at least 3 heading sections in both languages', () => {
    for (const p of POSTS) {
      for (const lang of ['tr', 'en']) {
        const heads = p.body[lang].filter((b) => typeof b === 'object' && b);
        expect(heads.length, `${p.slug}.${lang}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('every glossary term id referenced by a post resolves to a real term', () => {
    for (const p of POSTS) {
      const ids = p.terms || [];
      expect(glossaryByIds(ids).length, `${p.slug} terms`).toBe(ids.length);
    }
  });
});
