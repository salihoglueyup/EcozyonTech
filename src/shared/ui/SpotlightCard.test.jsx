import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotlightCard } from './SpotlightCard';

// Helper: stub matchMedia so we can drive the coarse-pointer / reduced-motion
// feature checks per test.
function stubMedia(matcher) {
  return vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({
    matches: matcher(q),
    media: q,
    addEventListener() {},
    removeEventListener() {},
  }));
}

describe('SpotlightCard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('on a fine pointer, renders the glow overlay and tracks pointer into CSS vars', () => {
    stubMedia(() => false); // not coarse, not reduced-motion
    const { container } = render(
      <SpotlightCard data-testid="card">
        <p>content</p>
      </SpotlightCard>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
    const card = screen.getByTestId('card');
    // The aria-hidden glow overlay exists.
    expect(card.querySelector('span[aria-hidden="true"]')).not.toBeNull();

    fireEvent.pointerMove(card, { clientX: 30, clientY: 20 });
    // jsdom getBoundingClientRect is all-zeros, so the props equal the client pos.
    expect(card.style.getPropertyValue('--spot-x')).toBe('30px');
    expect(card.style.getPropertyValue('--spot-y')).toBe('20px');
    expect(container).toBeTruthy();
  });

  it('on a coarse pointer, renders a plain wrapper (no overlay, no listeners)', () => {
    stubMedia((q) => q.includes('coarse'));
    const { container } = render(
      <SpotlightCard data-testid="card">
        <p>content</p>
      </SpotlightCard>,
    );
    const card = screen.getByTestId('card');
    expect(card.querySelector('span[aria-hidden="true"]')).toBeNull();
    fireEvent.pointerMove(card, { clientX: 10, clientY: 10 });
    expect(card.style.getPropertyValue('--spot-x')).toBe('');
    expect(container).toBeTruthy();
  });

  it('under reduced motion, renders a plain wrapper', () => {
    stubMedia((q) => q.includes('reduced-motion'));
    render(
      <SpotlightCard data-testid="card">
        <p>content</p>
      </SpotlightCard>,
    );
    expect(screen.getByTestId('card').querySelector('span[aria-hidden="true"]')).toBeNull();
  });
});
