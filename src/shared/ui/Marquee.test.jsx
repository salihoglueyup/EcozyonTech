import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('animates and renders an aria-hidden duplicate of the children by default', () => {
    const { container, getAllByText } = render(
      <Marquee><span>logo</span></Marquee>,
    );
    const track = container.firstChild;
    expect(track.style.animation).toContain('marquee');
    // Original + duplicate set.
    expect(getAllByText('logo')).toHaveLength(2);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders one static, non-animated set under reduced motion', () => {
    const mql = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue(mql);
    try {
      const { container, getAllByText } = render(
        <Marquee><span>logo</span></Marquee>,
      );
      expect(getAllByText('logo')).toHaveLength(1);
      expect(container.firstChild.style.animation).toBe('');
      expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
      expect(container.firstChild).toHaveClass('flex-wrap');
    } finally {
      spy.mockRestore();
    }
  });
});
