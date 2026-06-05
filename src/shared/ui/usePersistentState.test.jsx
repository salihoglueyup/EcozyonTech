import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistentState } from './usePersistentState';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe('usePersistentState', () => {
  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => usePersistentState('k', { n: 1 }));
    expect(result.current[0]).toEqual({ n: 1 });
  });

  it('hydrates from a previously stored value', () => {
    window.localStorage.setItem('k', JSON.stringify({ n: 42 }));
    const { result } = renderHook(() => usePersistentState('k', { n: 1 }));
    expect(result.current[0]).toEqual({ n: 42 });
  });

  it('persists updates back to storage', () => {
    const { result } = renderHook(() => usePersistentState('k', 0));
    act(() => result.current[1](7));
    expect(result.current[0]).toBe(7);
    expect(JSON.parse(window.localStorage.getItem('k'))).toBe(7);
  });

  it('supports a functional updater like useState', () => {
    const { result } = renderHook(() => usePersistentState('k', 1));
    act(() => result.current[1]((prev) => prev + 4));
    expect(result.current[0]).toBe(5);
  });

  it('honors the session storage area', () => {
    const { result } = renderHook(() => usePersistentState('k', 'a', { storage: 'session' }));
    act(() => result.current[1]('b'));
    expect(window.sessionStorage.getItem('k')).toBe(JSON.stringify('b'));
    expect(window.localStorage.getItem('k')).toBeNull();
  });

  it('stores raw strings without JSON quoting', () => {
    const { result } = renderHook(() => usePersistentState('k', 'hi', { raw: true }));
    act(() => result.current[1]('there'));
    expect(window.localStorage.getItem('k')).toBe('there');
    expect(result.current[0]).toBe('there');
  });

  it('does not throw and keeps the initial when stored JSON is corrupt', () => {
    window.localStorage.setItem('k', '{not json');
    const { result } = renderHook(() => usePersistentState('k', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
