import { useMemo, useState } from 'react';

// Owns the `active` filter + `query` search state for a list page and derives
// the visible rows as `search(filter(items, active), query, lang)`. Both
// `filter` (items, active) and `search` (list, query, lang) are optional — a
// page without one just omits it. Pass stable (module-level) fns so the memo
// doesn't recompute every render. Shared by the Careers/Help/Glossary filters.
export function useFilteredList({
  items,
  filter,
  search,
  lang,
  initialActive = null,
  initialQuery = '',
}) {
  const [active, setActive] = useState(initialActive);
  const [query, setQuery] = useState(initialQuery);
  const visible = useMemo(() => {
    const scoped = filter ? filter(items, active) : items;
    return search ? search(scoped, query, lang) : scoped;
  }, [items, filter, search, active, query, lang]);
  return { active, setActive, query, setQuery, visible };
}
