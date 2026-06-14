import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

afterEach(() => vi.restoreAllMocks());

function mockMq(matches) {
  const listeners = new Set();
  const mq = {
    matches,
    addEventListener: (_, fn) => listeners.add(fn),
    removeEventListener: (_, fn) => listeners.delete(fn),
    _emit: (m) => listeners.forEach((fn) => fn({ matches: m })),
  };
  vi.spyOn(window, 'matchMedia').mockReturnValue(mq);
  return mq;
}

describe('useReducedMotion', () => {
  it('reflects the initial media-query state after mount', () => {
    mockMq(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('starts false when reduced motion is not requested', () => {
    mockMq(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
