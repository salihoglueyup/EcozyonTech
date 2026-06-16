import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useInView } from './useInView';

function Probe({ threshold, once }) {
  const [ref, inView] = useInView(threshold, { once });
  return <div ref={ref} data-testid="probe" data-inview={String(inView)} />;
}

describe('useInView', () => {
  it('flips inView true on an intersecting entry and disconnects when once', () => {
    const cbs = [];
    let disconnected = false;
    class IO {
      constructor(cb) { cbs.push(cb); }
      observe() {}
      disconnect() { disconnected = true; }
    }
    const prev = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = IO;
    try {
      render(<Probe />);
      const el = screen.getByTestId('probe');
      expect(el.dataset.inview).toBe('false');
      act(() => cbs[0]([{ isIntersecting: true }]));
      expect(el.dataset.inview).toBe('true');
      expect(disconnected).toBe(true);
    } finally {
      globalThis.IntersectionObserver = prev;
    }
  });

  it('resolves true immediately under reduced motion (no entry needed)', async () => {
    const mql = { matches: true, addEventListener() {}, removeEventListener() {} };
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue(mql);
    try {
      render(<Probe />);
      await act(async () => { await Promise.resolve(); }); // flush queueMicrotask
      expect(screen.getByTestId('probe').dataset.inview).toBe('true');
    } finally {
      spy.mockRestore();
    }
  });
});
