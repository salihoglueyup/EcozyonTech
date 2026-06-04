import { useEffect, useRef, useState } from 'react';

/**
 * Tabs — accessible segmented control with an animated sliding indicator.
 *
 *   <Tabs
 *     tabs={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
 *     value={value}
 *     onChange={setValue}
 *   />
 *
 * role=tablist/tab + aria-selected; roving tabIndex with arrow/Home/End keys.
 * The pill indicator is measured from the active button so it slides on change.
 */
export function Tabs({ tabs, value, onChange, className = '', size = 'md' }) {
  const listRef = useRef(null);
  const [ind, setInd] = useState({ left: 0, width: 0, ready: false });

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    if (!el) return;
    // Return prev unchanged when measurements match so an inline tabs={...map}
    // (new array each render) can't drive a re-render loop.
    setInd((prev) =>
      prev.ready && prev.left === el.offsetLeft && prev.width === el.offsetWidth
        ? prev
        : { left: el.offsetLeft, width: el.offsetWidth, ready: true },
    );
  }, [value, tabs]);

  const onKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.id === value);
    if (idx < 0) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next != null) {
      e.preventDefault();
      onChange(tabs[next].id);
      listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
    }
  };

  const pad = size === 'sm' ? 'px-3 py-1 text-[12px]' : 'px-4 py-2 text-[13px]';

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={onKeyDown}
      className={`relative inline-flex items-center gap-1 rounded-full bg-slate-900/[.04] dark:bg-white/[.06] p-1 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full bg-white dark:bg-white/[.14] shadow-sm transition-all duration-300 ease-out"
        style={{ left: ind.left, width: ind.width, opacity: ind.ready ? 1 : 0 }}
      />
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            data-active={active}
            onClick={() => onChange(t.id)}
            className={`relative z-10 rounded-full font-medium transition-colors ${pad} ${
              active
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
