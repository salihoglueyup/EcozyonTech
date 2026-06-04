import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Reveal, RevealGroup, Parallax } from './useReveal';

describe('Reveal', () => {
  it('renders children and starts hidden (IntersectionObserver is mocked, never fires)', () => {
    render(<Reveal><span>hi</span></Reveal>);
    const span = screen.getByText('hi');
    const wrapper = span.parentElement;
    expect(wrapper).toHaveAttribute('data-reveal');
    expect(wrapper.style.opacity).toBe('0');
  });

  it('includes a scale in the hidden transform when scale is set', () => {
    render(<Reveal scale={0.9}><span>scaled</span></Reveal>);
    const wrapper = screen.getByText('scaled').parentElement;
    expect(wrapper.style.transform).toContain('scale(0.9)');
  });
});

describe('RevealGroup', () => {
  it('injects an incremental delay into each Reveal child without adding a wrapper', () => {
    const { container } = render(
      <div data-testid="grid">
        <RevealGroup step={100}>
          <Reveal><span>a</span></Reveal>
          <Reveal><span>b</span></Reveal>
          <Reveal><span>c</span></Reveal>
        </RevealGroup>
      </div>,
    );
    // No extra wrapper element: the grid's direct children are the 3 reveals.
    const grid = container.querySelector('[data-testid="grid"]');
    expect(grid.children).toHaveLength(3);
    // Stagger shows up as the transition-delay in each child's transition.
    expect(grid.children[0].style.transition).toContain('0ms');
    expect(grid.children[1].style.transition).toContain('100ms');
    expect(grid.children[2].style.transition).toContain('200ms');
  });

  it('passes non-element children through unchanged', () => {
    render(<RevealGroup>{'plain text'}</RevealGroup>);
    expect(screen.getByText('plain text')).toBeInTheDocument();
  });
});

describe('Parallax', () => {
  it('renders children with a transform will-change hint', () => {
    render(<Parallax><span>deep</span></Parallax>);
    const wrapper = screen.getByText('deep').parentElement;
    expect(wrapper.style.willChange).toBe('transform');
  });

  it('merges caller style with the will-change hint', () => {
    render(<Parallax style={{ opacity: '0.5' }}><span>merged</span></Parallax>);
    const wrapper = screen.getByText('merged').parentElement;
    expect(wrapper.style.willChange).toBe('transform');
    expect(wrapper.style.opacity).toBe('0.5');
  });
});
