// Accessible loading spinner — a spinning ring. `size` is the Tailwind h/w
// (default h-4 w-4); `className` sets the ring colours (a faint track + a solid
// `border-t`). `role="status"` + `label` announce the loading state to screen
// readers (the inline blob it replaces was silently aria-hidden). Under reduced
// motion the global rule freezes the spin to a static ring.
export function Spinner({
  size = 'h-4 w-4',
  className = 'border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-200',
  label = 'Loading',
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block ${size} rounded-full border-2 animate-spin ${className}`.trim()}
    />
  );
}
