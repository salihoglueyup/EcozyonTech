import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SuccessCheck } from './SuccessCheck';

describe('SuccessCheck', () => {
  it('renders an aria-hidden svg with a draw-in path', () => {
    const { container } = render(<SuccessCheck />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const path = container.querySelector('path');
    expect(path.getAttribute('pathLength')).toBe('1');
    expect(path.getAttribute('class')).toContain('animate-drawCheck');
  });

  it('forwards className and strokeWidth', () => {
    const { container } = render(<SuccessCheck className="h-2.5 w-2.5" strokeWidth={2.6} />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toBe('h-2.5 w-2.5');
    expect(svg.getAttribute('stroke-width')).toBe('2.6');
  });
});
