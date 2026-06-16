import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilteredList } from './useFilteredList';

const ITEMS = [
  { id: 1, cat: 'a', name: 'Solar panel' },
  { id: 2, cat: 'b', name: 'Wind turbine' },
  { id: 3, cat: 'a', name: 'Solar inverter' },
];
const filter = (items, active) => (active ? items.filter((i) => i.cat === active) : items);
// `lang` is accepted to mirror the real (list, query, lang) search signature.
const search = (items, q) => items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));

describe('useFilteredList', () => {
  it('returns all items when no filter/query is active', () => {
    const { result } = renderHook(() => useFilteredList({ items: ITEMS, filter, search, lang: 'en' }));
    expect(result.current.visible).toHaveLength(3);
    expect(result.current.active).toBeNull();
    expect(result.current.query).toBe('');
  });

  it('applies the active filter, then the search query', () => {
    const { result } = renderHook(() => useFilteredList({ items: ITEMS, filter, search, lang: 'en' }));
    act(() => result.current.setActive('a'));
    expect(result.current.visible.map((i) => i.id)).toEqual([1, 3]);
    act(() => result.current.setQuery('inverter'));
    expect(result.current.visible.map((i) => i.id)).toEqual([3]);
  });

  it('works without a search fn (filter only)', () => {
    const { result } = renderHook(() => useFilteredList({ items: ITEMS, filter, lang: 'en' }));
    act(() => result.current.setActive('b'));
    expect(result.current.visible.map((i) => i.id)).toEqual([2]);
  });

  it('honors initialActive/initialQuery', () => {
    const { result } = renderHook(() =>
      useFilteredList({ items: ITEMS, filter, search, lang: 'en', initialActive: 'a', initialQuery: 'panel' }),
    );
    expect(result.current.visible.map((i) => i.id)).toEqual([1]);
  });
});
