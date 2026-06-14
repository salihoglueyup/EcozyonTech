import { describe, it, expect } from 'vitest';
import {
  organization,
  website,
  blogPosting,
  article,
  product,
  faqPage,
  breadcrumbList,
  collectionPage,
  ldScript,
} from './jsonld';

const site = { name: 'Ecozyon Tech', url: 'https://ecozyon.tech', email: 'hello@ecozyon.tech', description: 'desc' };

describe('jsonld builders', () => {
  it('organization carries name, url and a logo image', () => {
    const o = organization(site);
    expect(o['@type']).toBe('Organization');
    expect(o.url).toBe(site.url);
    expect(o.logo.url).toContain('/og.png');
  });

  it('website exposes a SearchAction with a query template', () => {
    const w = website(site, 'en');
    expect(w['@type']).toBe('WebSite');
    expect(w.inLanguage).toBe('en');
    expect(w.potentialAction.target.urlTemplate).toContain('/search?q={search_term_string}');
    expect(w.potentialAction['query-input']).toContain('search_term_string');
  });

  it('blogPosting pulls localized title/excerpt and dates', () => {
    const post = { title: { tr: 'Başlık', en: 'Title' }, excerpt: { tr: 'TR', en: 'EN' }, date: '2026-01-02' };
    const ld = blogPosting({ post, url: 'https://ecozyon.tech/blog/x', site, image: 'img.png', lang: 'en' });
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.headline).toBe('Title');
    expect(ld.datePublished).toBe('2026-01-02');
    expect(ld.mainEntityOfPage['@id']).toContain('/blog/x');
  });

  it('article wraps a generic headline/description', () => {
    const ld = article({ headline: 'H', description: 'D', url: 'u', site, image: 'i' });
    expect(ld['@type']).toBe('Article');
    expect(ld.headline).toBe('H');
  });

  it('product emits one offer per tier with stringified prices', () => {
    const ld = product({
      name: 'Plans',
      description: 'd',
      url: 'https://ecozyon.tech/pricing',
      site,
      currency: 'USD',
      offers: [
        { name: 'Free', price: 0 },
        { name: 'Team', price: 5 },
        { name: 'Enterprise' },
      ],
    });
    expect(ld['@type']).toBe('Product');
    expect(ld.offers).toHaveLength(3);
    expect(ld.offers[1]).toMatchObject({ name: 'Team', price: '5', priceCurrency: 'USD' });
    expect(ld.offers[2].price).toBe('0'); // missing amount → 0, still valid
  });

  it('faqPage maps q/a (localized or plain) to Question/Answer', () => {
    const ld = faqPage([{ q: { tr: 'S', en: 'Q' }, a: { tr: 'C', en: 'A' } }], 'en');
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity[0].name).toBe('Q');
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe('A');
  });

  it('breadcrumbList numbers positions and absolutizes paths', () => {
    const ld = breadcrumbList([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: 'Post' }], site);
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0]).toMatchObject({ position: 1, item: 'https://ecozyon.tech/' });
    expect(ld.itemListElement[1].item).toBe('https://ecozyon.tech/blog');
    expect(ld.itemListElement[2].item).toBeUndefined(); // current page, no link
  });

  it('collectionPage wraps an ItemList of absolute URLs', () => {
    const ld = collectionPage({ name: 'Blog', description: 'd', url: 'u', site, items: [{ name: 'A', path: '/blog/a' }] });
    expect(ld['@type']).toBe('CollectionPage');
    expect(ld.mainEntity.itemListElement[0].url).toBe('https://ecozyon.tech/blog/a');
  });

  it('ldScript wraps one or many nodes in script tags', () => {
    const one = ldScript({ '@type': 'X' });
    expect(one).toMatch(/^<script type="application\/ld\+json">/);
    expect(ldScript([{ a: 1 }, { b: 2 }]).match(/<script/g)).toHaveLength(2);
  });
});
