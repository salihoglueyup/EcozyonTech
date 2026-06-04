/**
 * Skeleton — animated placeholder block for loading states.
 *
 * Usage:
 *   <Skeleton className="h-8 w-40" />           // bar
 *   <Skeleton className="h-28 w-full rounded-2xl" />  // card
 *   <Skeleton circle className="h-10 w-10" />   // avatar
 */
export function Skeleton({ className = '', circle = false }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse bg-slate-200/60 dark:bg-slate-700/40 ${circle ? 'rounded-full' : 'rounded-xl'} ${className}`}
    />
  );
}

/**
 * CardSkeleton — ready-made skeleton that mimics a standard card.
 */
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/60 dark:bg-white/[.04] p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
}
