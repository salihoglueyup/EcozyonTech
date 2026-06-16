import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Typewriter } from './Typewriter';

describe('Typewriter', () => {
  it('shows the full text immediately and is a11y-correct under reduced motion', () => {
    const mql = { matches: true, addEventListener() {}, removeEventListener() {} };
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue(mql);
    try {
      const { container } = render(<Typewriter text="Hello world" />);
      const outer = container.firstChild;
      // Full sentence exposed once to screen readers…
      expect(outer).toHaveAttribute('aria-label', 'Hello world');
      // …while the visible (animated) text is hidden from the a11y tree.
      const inner = outer.querySelector('[aria-hidden="true"]');
      expect(inner).toHaveTextContent('Hello world');
    } finally {
      spy.mockRestore();
    }
  });
});
