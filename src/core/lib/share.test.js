import { describe, it, expect } from 'vitest';
import { shareLinks } from './share';

describe('shareLinks', () => {
  it('builds X and LinkedIn intent URLs with the page URL encoded', () => {
    const { x, linkedin } = shareLinks('https://ecozyon.tech/blog/a', 'Hello world');
    expect(x).toContain('twitter.com/intent/tweet');
    expect(x).toContain(encodeURIComponent('https://ecozyon.tech/blog/a'));
    expect(x).toContain(encodeURIComponent('Hello world'));
    expect(linkedin).toContain('linkedin.com/sharing/share-offsite');
    expect(linkedin).toContain(encodeURIComponent('https://ecozyon.tech/blog/a'));
  });

  it('encodes special characters in the title', () => {
    const { x } = shareLinks('https://x.co', 'Karbon & bütçe?');
    expect(x).toContain(encodeURIComponent('Karbon & bütçe?'));
    expect(x).not.toContain('Karbon & bütçe?'); // raw form must not leak through
  });

  it('tolerates null/undefined inputs', () => {
    expect(() => shareLinks()).not.toThrow();
    const { x, linkedin } = shareLinks();
    expect(x).toContain('url=');
    expect(linkedin).toContain('url=');
  });
});
