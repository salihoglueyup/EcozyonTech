import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RevealText } from './RevealText';

describe('RevealText', () => {
  it('renders each word in its own inline-block span and preserves the text', () => {
    render(<RevealText as="h2" text="Build a greener future" />);
    const heading = screen.getByRole('heading', { level: 2 });
    const spans = heading.querySelectorAll('span');
    expect(spans).toHaveLength(4);
    expect(spans[0].textContent).toBe('Build');
    expect(spans[3].textContent).toBe('future');
    // The accessible text equals the source string (spaces preserved).
    expect(heading.textContent).toBe('Build a greener future');
  });

  it('shows all words at full opacity under reduced motion', async () => {
    const mql = { matches: true, addEventListener() {}, removeEventListener() {} };
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue(mql);
    try {
      const { container } = render(<RevealText as="div" text="one two three" />);
      await act(async () => { await Promise.resolve(); }); // flush useInView microtask
      const words = container.querySelectorAll('span'); // inner word spans only
      expect(words).toHaveLength(3);
      words.forEach((s) => {
        expect(s.style.opacity).toBe('1');
      });
    } finally {
      spy.mockRestore();
    }
  });
});
