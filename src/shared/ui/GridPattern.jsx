export function GridPattern({ className = '', width = 40, height = 40, strokeDasharray = 0 }) {
  const id = `grid-pattern-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg className={`absolute inset-0 h-full w-full text-slate-900/[0.04] dark:text-white/[0.04] ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x="-1" y="-1">
          <path d={`M.5 ${height}V.5H${width}`} fill="none" stroke="currentColor" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} strokeWidth={0} />
    </svg>
  );
}
