import { Link } from 'react-router-dom';

// Shared visual primitives used across every feature section.

export function Tag({ children, color = "emerald" }) {
  const map = {
    emerald: "bg-emerald-50/90 text-emerald-700 ring-emerald-600/15",
    cyan: "bg-cyan-50/90 text-cyan-700 ring-cyan-600/15",
    slate: "bg-white/80 text-slate-700 ring-slate-900/10",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium ring-1 backdrop-blur ${map[color]}`}>
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${color === "cyan" ? "bg-cyan-500" : color === "slate" ? "bg-slate-500" : "bg-emerald-500"}`}>
        <span className={`absolute inset-0 rounded-full animate-ping ${color === "cyan" ? "bg-cyan-500" : color === "slate" ? "bg-slate-500" : "bg-emerald-500"} opacity-60`} />
      </span>
      {children}
    </span>
  );
}

export function GlowOrb({ className, color, size = 480 }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className || ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

// Wordmark + mark. Routes home via the SPA router instead of a hash anchor.
export function EcoLogo({ accent = "emerald", to = "/" }) {
  const c = accent === "cyan" ? "#0EA5E9" : "#10B981";
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-[10px] bg-slate-900 text-white shadow-sm overflow-hidden">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <defs>
            <linearGradient id="ec-lg" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#0EA5E9" />
              <stop offset="1" stopColor={c} />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="11" fill="none" stroke="url(#ec-lg)" strokeWidth="1.5" />
          <path d="M8 16 Q16 8 24 16 T8 16" fill="none" stroke="url(#ec-lg)" strokeWidth="1.5" />
          <circle cx="22" cy="11" r="1.6" fill="#10B981" />
        </svg>
      </span>
      <span className="font-display text-[15px] tracking-tight text-slate-900">
        Ecozyon<span className="text-slate-400 font-normal"> Tech</span>
      </span>
    </Link>
  );
}
