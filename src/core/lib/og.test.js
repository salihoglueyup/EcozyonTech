import { describe, it, expect } from 'vitest';
import { wrap, ogCardSvg } from './og';

describe('wrap', () => {
  it('keeps short text on a single line', () => {
    expect(wrap('hello world', 32, 2)).toEqual(['hello world']);
  });

  it('breaks onto a second line at word boundaries', () => {
    const lines = wrap('one two three four five six seven', 12, 2);
    expect(lines.length).toBe(2);
    expect(lines[0].length).toBeLessThanOrEqual(12);
  });

  it('ellipsizes the last line when it overflows the line budget', () => {
    const lines = wrap('alpha beta gamma delta epsilon zeta eta theta', 10, 2);
    expect(lines.length).toBe(2);
    expect(lines[lines.length - 1].endsWith('…')).toBe(true);
  });

  it('tolerates empty/nullish text', () => {
    expect(wrap('', 10, 2)).toEqual(['']);
    expect(wrap(null, 10, 2)).toEqual(['']);
  });
});

describe('ogCardSvg', () => {
  it('is a 1200×630 svg with the brand defaults', () => {
    const svg = ogCardSvg({ title: 'Hello' });
    expect(svg).toContain('viewBox="0 0 1200 630"');
    expect(svg).toContain('Ecozyon Tech'); // default eyebrow
    expect(svg).toContain('ECOZYON.TECH'); // default footer
    expect(svg).toContain('Hello');
  });

  it('escapes XML-special characters in every text field', () => {
    const svg = ogCardSvg({ eyebrow: 'A & B', title: '<x>', subtitle: '"q"', footerRight: 'a<b' });
    expect(svg).toContain('A &amp; B');
    expect(svg).toContain('&lt;x&gt;');
    expect(svg).not.toContain('<x>');
  });

  it('splits a long title across two lines', () => {
    const long = 'Karbon bütçesi nedir ve neden kişiselleştirilmeli kesinlikle';
    const svg = ogCardSvg({ title: long });
    const y280 = svg.includes('y="280"');
    const y358 = svg.includes('y="358"');
    expect(y280 && y358).toBe(true);
    // second title line must carry some text (the wrap produced 2 lines)
    expect(svg).toMatch(/y="358"[^>]*>[^<]+</);
  });
});
