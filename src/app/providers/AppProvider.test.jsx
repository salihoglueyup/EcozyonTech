import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppProvider';

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

describe('AppProvider', () => {
  it('defaults to Turkish with a matching dictionary', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.lang).toBe('tr');
    expect(result.current.dict).toBeDefined();
    expect(result.current.t).toBe(result.current.dict);
  });

  it('persists language changes to localStorage', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setLang('en'));
    expect(result.current.lang).toBe('en');
    expect(JSON.parse(localStorage.getItem('ecozyon.prefs')).lang).toBe('en');
  });

  it('toggles the dark class on <html> when theme changes', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setTheme('dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    act(() => result.current.setTheme('light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('derives accent palette and bg color from prefs', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.accents).toHaveProperty('cyan');
    expect(result.current.accents).toHaveProperty('emerald');
    expect(result.current.bgColor).toMatch(/^#/);
  });
});
