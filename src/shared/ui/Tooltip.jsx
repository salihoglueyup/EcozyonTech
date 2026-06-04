import { useId, useState, cloneElement, isValidElement } from 'react';

const SIDE = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Tooltip — accessible label shown on hover/focus of its single child.
 *
 *   <Tooltip label="Copy link"><button>…</button></Tooltip>
 *
 * The trigger receives aria-describedby while open; focus (which bubbles to
 * the wrapper) opens it too, so it's keyboard-reachable. The bubble animates
 * with opacity+scale so the side translate is preserved.
 */
export function Tooltip({ children, label, side = 'top', className = '' }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const trigger = isValidElement(children)
    ? cloneElement(children, { 'aria-describedby': open ? id : undefined })
    : children;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {trigger}
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-slate-700 px-2.5 py-1.5 text-[11.5px] font-medium text-white shadow-lg transition-all duration-150 ${SIDE[side]} ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${className}`}
      >
        {label}
      </span>
    </span>
  );
}
