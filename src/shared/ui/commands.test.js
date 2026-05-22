import { describe, it, expect } from 'vitest';
import { buildCommands, filterCommands } from './commands';
import { ROUTES } from '@/core/config/site';
import { POSTS } from '@/core/data/posts';

describe('buildCommands', () => {
  it('emits a page item per concrete route and a post item per blog post', () => {
    const items = buildCommands({ routes: ROUTES, posts: POSTS, lang: 'tr' });
    const pages = items.filter((i) => i.type === 'page');
    const posts = items.filter((i) => i.type === 'post');
    expect(pages.length).toBe(ROUTES.filter((r) => r.path !== '*' && !r.path.includes(':')).length);
    expect(posts.length).toBe(POSTS.length);
    expect(items.every((i) => typeof i.to === 'string' && i.id)).toBe(true);
  });

  it('labels in the active language and links posts to their slug', () => {
    const tr = buildCommands({ routes: ROUTES, posts: POSTS, lang: 'tr' });
    const en = buildCommands({ routes: ROUTES, posts: POSTS, lang: 'en' });
    const homeTr = tr.find((i) => i.to === '/');
    const homeEn = en.find((i) => i.to === '/');
    expect(homeTr.label).toBe('Ana Sayfa');
    expect(homeEn.label).toBe('Home');
    const firstPost = tr.find((i) => i.type === 'post');
    expect(firstPost.to).toBe(`/blog/${POSTS[0].slug}`);
  });

  it('skips the catch-all and param routes', () => {
    const routes = [...ROUTES, { path: '*' }, { path: '/blog/:slug', nav: { tr: 'x', en: 'x' } }];
    const items = buildCommands({ routes, posts: [], lang: 'en' });
    expect(items.some((i) => i.to === '*' || i.to.includes(':'))).toBe(false);
  });
});

describe('filterCommands', () => {
  const items = [
    { id: 'a', label: 'Pricing', hint: '' },
    { id: 'b', label: 'About', hint: '' },
    { id: 'c', label: 'Carbon budget basics', hint: 'Guide', keywords: ['blog'] },
    { id: 'd', label: 'Contact', hint: '' },
  ];

  it('returns all items for an empty query', () => {
    expect(filterCommands(items, '')).toBe(items);
    expect(filterCommands(items, '   ')).toBe(items);
  });

  it('matches case-insensitively across label, hint and keywords', () => {
    expect(filterCommands(items, 'PRIC').map((i) => i.id)).toEqual(['a']);
    expect(filterCommands(items, 'guide').map((i) => i.id)).toEqual(['c']); // via hint
    expect(filterCommands(items, 'blog').map((i) => i.id)).toEqual(['c']);  // via keyword
  });

  it('ranks label-prefix matches ahead of mid-string matches', () => {
    const list = [
      { id: 'mid', label: 'Impact map' },
      { id: 'pre', label: 'Map overview' },
    ];
    expect(filterCommands(list, 'map').map((i) => i.id)).toEqual(['pre', 'mid']);
  });

  it('returns empty when nothing matches', () => {
    expect(filterCommands(items, 'zzzz')).toEqual([]);
  });
});
