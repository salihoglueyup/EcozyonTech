import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { AnimatedIcon } from './AnimatedIcon';

const Icon = (props) => (
  <AnimatedIcon {...props}>
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <g>
        <rect x="4" y="4" width="12" height="12" />
        <path d="M2 2l4 4" />
      </g>
      <circle cx="10" cy="10" r="3" />
    </svg>
  </AnimatedIcon>
);

describe('AnimatedIcon', () => {
  it('wraps the svg with eco-draw and injects pathLength on every shape (even nested)', () => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('eco-draw');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    container.querySelectorAll('rect, path, circle').forEach((s) => {
      expect(s.getAttribute('pathLength')).toBe('1');
    });
  });

  it('adds is-drawn once in view (reduced-motion stub resolves immediately)', async () => {
    const mql = { matches: true, addEventListener() {}, removeEventListener() {} };
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue(mql);
    try {
      const { container } = render(<Icon />);
      await act(async () => { await Promise.resolve(); }); // flush useInView microtask
      expect(container.querySelector('svg').getAttribute('class')).toContain('is-drawn');
    } finally {
      spy.mockRestore();
    }
  });

  it('applies a per-shape stagger delay when stagger is set', () => {
    const { container } = render(<Icon stagger={100} />);
    const shapes = container.querySelectorAll('rect, path, circle');
    expect(shapes[0].style.transitionDelay).toBe('0ms');
    expect(shapes[1].style.transitionDelay).toBe('100ms');
    expect(shapes[2].style.transitionDelay).toBe('200ms');
  });

  it('exposes a label when provided (role=img)', () => {
    const { container } = render(<Icon label="Recycle" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Recycle');
  });
});
