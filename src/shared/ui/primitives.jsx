import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/shared/ui/useReveal';
import { useInView } from '@/shared/ui/useInView';

// Shared visual primitives used across every feature section.

// Standard section header: revealing eyebrow Tag + display heading (with an
// optional gradient accent word) + optional sub. `center` switches to the
// centered variant used by FAQ/testimonials. Replaces the hand-copied
// Reveal+Tag+h2 block that lived in every feature section.
export function SectionHeader({
  eyebrow,
  color = 'emerald',
  title,
  titleAccent,
  sub,
  center = false,
  shimmer = false,
  className = '',
  subClassName = 'max-w-2xl',
  as: Heading = 'h2',
}) {
  // Opt-in: the gradient accent sweeps a one-shot shimmer when it scrolls in.
  const [accentRef, accentSeen] = useInView(0.5);
  return (
    <Reveal className={center ? `text-center ${className}`.trim() : className}>
      <Tag color={color}>// {eyebrow}</Tag>
      <Heading className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
        {title}
        {titleAccent && (
          <>
            {' '}
            <span
              ref={shimmer ? accentRef : undefined}
              className={`eco-gradient-text${shimmer && accentSeen ? ' is-shimmer' : ''}`}
            >
              {titleAccent}
            </span>
          </>
        )}
      </Heading>
      {sub && (
        <p className={`mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed ${center ? 'mx-auto ' : ''}${subClassName}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

// Page-level header: the eyebrow Tag + display **h1** (with optional gradient
// accent) + optional intro. Sibling of SectionHeader, but uses an <h1> (one per
// page, for SEO/a11y) and no Reveal (page titles are the LCP, not animated-in).
// Replaces the hand-copied Tag+h1+intro block duplicated across ~18 route pages.
// `className` is the wrapping spacing (e.g. "max-w-3xl mb-12"); `introClassName`
// overrides the intro width. No explicit space before the accent — like the
// originals, any gap between title and accent comes from the data.
export function PageHeader({
  eyebrow,
  color = 'cyan',
  title,
  titleAccent,
  intro,
  className = '',
  introClassName = 'max-w-2xl',
}) {
  return (
    <div className={className}>
      <Tag color={color}>// {eyebrow}</Tag>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
        {title}
        {titleAccent && <span className="eco-gradient-text">{titleAccent}</span>}
      </h1>
      {intro && (
        <p className={`mt-3 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed ${introClassName}`.trim()}>
          {intro}
        </p>
      )}
    </div>
  );
}

// Small right-pointing arrow used on CTAs and "read more" links across the app.
// Decorative (aria-hidden) — it always sits beside a text label. Size/stroke and
// any hover transform come via className/strokeWidth. Replaces the inline arrow
// <svg> that was hand-copied into ~17 CTAs.
export function ArrowRight({ className = 'h-3.5 w-3.5', strokeWidth = 1.6 }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <path d="M3 7h8m-3-3 3 3-3 3" />
    </svg>
  );
}

// Pill search field with a leading magnifier icon — the filter input shared by
// the Blog/Careers/Help list pages. `onChange` receives the raw string value.
// `className` is wrapper spacing/width (e.g. "mb-5 max-w-sm"); `inputClassName`
// tunes padding/size. Replaces the hand-copied icon + <input type="search">
// block. (Glossary/Search keep bespoke fields — different, icon-less designs.)
export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  clearLabel,
  className = '',
  inputClassName = 'py-2.5 text-[13px]',
}) {
  const inputRef = useRef(null);
  const hasValue = value != null && value !== '';
  const clear = () => {
    onChange('');
    inputRef.current?.focus();
  };
  return (
    <div className={`relative ${className}`.trim()}>
      <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape' && hasValue) { e.preventDefault(); clear(); } }}
        placeholder={placeholder}
        aria-label={label}
        className={`w-full rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] pl-10 ${hasValue ? 'pr-9' : 'pr-4'} ${inputClassName} text-slate-800 dark:text-slate-200 outline-none focus:ring-cyan-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
      />
      {hasValue && (
        <button
          type="button"
          onClick={clear}
          aria-label={clearLabel}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-900/[.05] dark:hover:bg-white/[.08] transition"
        >
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}

// Horizontal group of single-select filter "pills" (the All + categories
// toggle row shared by Blog/Careers/Cases/Glossary/Help/Integrations). `value`
// is the active id (null = All). `options` are `{ id, label }` where label is a
// string or a `{tr,en}` pair; pass `allLabel` to prepend the id=null "All"
// pill. `children` render after the mapped pills, inside the same group (e.g.
// Blog's "saved" toggle). Uses the standard eco-press pill styling.
export function FilterPills({
  options,
  value,
  onChange,
  lang,
  label,
  allLabel,
  className = '',
  children,
}) {
  const items = allLabel != null ? [{ id: null, label: allLabel }, ...options] : options;
  const ref = useRef(null);
  // Roving tabindex: the active pill (or the first) is the group's single tab
  // stop; arrow keys move focus between pills (toolbar-style, like Tabs.jsx).
  const rovingIdx = Math.max(0, items.findIndex((o) => o.id === value));

  const onKeyDown = (e) => {
    const btns = Array.from(ref.current?.querySelectorAll('button') ?? []);
    const i = btns.indexOf(document.activeElement);
    if (i < 0 || !btns.length) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % btns.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + btns.length) % btns.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = btns.length - 1;
    if (next != null) {
      e.preventDefault();
      btns[next].focus();
    }
  };

  return (
    <div ref={ref} onKeyDown={onKeyDown} className={`flex flex-wrap gap-2 ${className}`.trim()} role="group" aria-label={label}>
      {items.map((opt, idx) => {
        const on = value === opt.id;
        const text = typeof opt.label === 'string' ? opt.label : opt.label[lang] || opt.label.en;
        return (
          <button
            key={opt.id ?? 'all'}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={on}
            tabIndex={idx === rovingIdx ? 0 : -1}
            className={`eco-press rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ring-1 transition ${
              on
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-slate-900 dark:ring-white'
                : 'bg-white/70 dark:bg-white/[.06] text-slate-700 dark:text-slate-300 ring-slate-900/[.08] dark:ring-white/[.1] hover:ring-cyan-500/30'
            }`}
          >
            {text}
          </button>
        );
      })}
      {children}
    </div>
  );
}

// Boxed "no results / empty" state — the muted eco-card shown when a filtered
// list comes up empty (Careers/Help/Glossary). Shared styling is the card +
// muted text; `className` controls shape/padding/alignment (default matches the
// Careers/Help box; Glossary passes a tighter `rounded-xl p-6`).
export function EmptyState({ children, icon, action, className = 'rounded-2xl p-8 text-center' }) {
  return (
    <div className={`eco-card text-[13.5px] text-slate-500 dark:text-slate-400 ${className}`.trim()}>
      {icon && <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center text-slate-400">{icon}</div>}
      {children}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// The small muted "N results" line above a filtered list. `aria-live` so screen
// readers hear the count update as filters/search change. `className` is the
// spacing (default `mb-4`; Glossary uses `mt-4 mb-2`).
export function ResultCount({ children, className = 'mb-4' }) {
  return (
    <div className={`text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400 ${className}`.trim()} aria-live="polite">
      {children}
    </div>
  );
}

// Status dot + label tinted by a status `accent` colour (operational/degraded/
// down for /status, live/beta/soon for integrations). The dot is decorative
// (aria-hidden) — its colour just echoes the label. `className` tunes the text
// size (default `text-[12.5px]`; pass '' to inherit), `dotClassName` the dot.
export function StatusBadge({ accent, label, pulse = false, className = 'text-[12.5px]', dotClassName = 'h-2 w-2' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`.trim()} style={{ color: accent }}>
      <span className={`relative inline-flex ${dotClassName} rounded-full`} style={{ backgroundColor: accent }} aria-hidden="true">
        {pulse && (
          <span className="absolute inset-0 rounded-full animate-ping motion-reduce:animate-none opacity-70" style={{ backgroundColor: accent }} />
        )}
      </span>
      {label}
    </span>
  );
}

export function Tag({ children, color = "emerald" }) {
  const map = {
    emerald: "bg-emerald-50/90 dark:bg-emerald-500/[.12] text-emerald-700 dark:text-emerald-400 ring-emerald-600/15 dark:ring-emerald-400/20",
    cyan: "bg-cyan-50/90 dark:bg-cyan-500/[.12] text-cyan-700 dark:text-cyan-400 ring-cyan-600/15 dark:ring-cyan-400/20",
    slate: "bg-white/80 dark:bg-white/[.06] text-slate-700 dark:text-slate-300 ring-slate-900/10 dark:ring-white/10",
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

// Decorative open-quote glyph used by quote blocks (about bento, testimonials).
// Color + size come from the caller via className (uses currentColor).
export function QuoteMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 8c-4 1-7 4-7 9v7h8v-8H8c0-3 1.5-5 4-6V8Zm14 0c-4 1-7 4-7 9v7h8v-8h-5c0-3 1.5-5 4-6V8Z"
      />
    </svg>
  );
}

// Round avatar showing initials over a solid color or gradient. `background`
// is any CSS background value; size/font/ring/shadow come via className, and
// `style` merges extra inline rules (e.g. an overlap marginLeft).
export function InitialsAvatar({ initials, background, className = "", style }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white ${className}`}
      style={{ background, ...style }}
    >
      {initials}
    </div>
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
      <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-[10px] bg-slate-900 dark:bg-slate-800 text-white shadow-sm overflow-hidden">
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
      <span className="font-display text-[15px] tracking-tight text-slate-900 dark:text-slate-100">
        Ecozyon<span className="text-slate-400 dark:text-slate-500 font-normal"> Tech</span>
      </span>
    </Link>
  );
}
