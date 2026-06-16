import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Donut, Sparkline } from './index';

// matchMedia is stubbed to matches:false in the test setup, so
// prefersReducedMotion() is false here and the draw-in path is exercised.
describe('chart draw-in', () => {
  const arcOf = (c) => c.querySelectorAll('circle')[1]; // [0]=track, [1]=value arc
  const lineOf = (c) => c.querySelectorAll('polyline')[1]; // [0]=area, [1]=line

  it('Donut: static (offset 0) when play is omitted', () => {
    const { container } = render(<Donut value={75} />);
    expect(arcOf(container).getAttribute('stroke-dashoffset')).toBe('0');
  });

  it('Donut: hidden arc (offset=dash) when play=false, drawn (0) when play=true', () => {
    const { container, rerender } = render(<Donut value={75} play={false} />);
    expect(Number(arcOf(container).getAttribute('stroke-dashoffset'))).toBeGreaterThan(0);
    rerender(<Donut value={75} play />);
    expect(arcOf(container).getAttribute('stroke-dashoffset')).toBe('0');
  });

  it('Sparkline: no path-draw dash when play is omitted (static)', () => {
    const { container } = render(<Sparkline data={[1, 3, 2, 5, 4]} />);
    expect(lineOf(container).getAttribute('pathLength')).toBeNull();
  });

  it('Sparkline: normalized path-draw (pathLength=1, offset 1) when play=false', () => {
    const { container } = render(<Sparkline data={[1, 3, 2, 5, 4]} play={false} />);
    const line = lineOf(container);
    expect(line.getAttribute('pathLength')).toBe('1');
    expect(line.getAttribute('stroke-dashoffset')).toBe('1');
  });
});
