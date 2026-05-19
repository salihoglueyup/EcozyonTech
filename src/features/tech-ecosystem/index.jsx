// Tech Ecosystem — AI panel + Wearable exploded view + Community panel
import React, { useState } from 'react';
import { Tag } from '@/shared/ui/primitives';

function TechEcosystem({ t }) {
  return (
    <section id="tech" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[.45]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 10%, rgba(16,185,129,.10), transparent 50%), radial-gradient(circle at 10% 80%, rgba(14,165,233,.10), transparent 55%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <Tag color="emerald">// 03 · {t.tech.eyebrow}</Tag>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
            {t.tech.title}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(110deg,#0EA5E9 0%, #10B981 100%)" }}
            >{t.tech.titleAccent}</span>
          </h2>
        </div>

        <div id="ecosystem" className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AIPanel t={t} />
          <WearablePanel t={t} />
        </div>
        <div className="mt-5">
          <CommunityPanel t={t} />
        </div>
      </div>
    </section>
  );
}

// ── AI panel with animated data flow ───────────────────────────────────────
function AIPanel({ t }) {
  const ai = t.tech.ai;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-6 lg:p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,.35)]">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="10" r="6.5" />
            <circle cx="10" cy="10" r="3" />
            <path d="M3.5 10h13M10 3.5v13" />
          </svg>
        </span>
        <span className="text-[11px] uppercase tracking-[.14em] font-semibold text-cyan-700">{ai.tag}</span>
      </div>

      <h3 className="mt-4 font-display text-[26px] lg:text-[30px] leading-tight tracking-tight text-slate-900">{ai.title}</h3>
      <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">{ai.desc}</p>

      {/* Data flow diagram */}
      <div className="mt-6 rounded-2xl border border-slate-900/[.06] bg-gradient-to-br from-slate-50 to-white p-5">
        <AIDataFlow />
      </div>

      <ul className="mt-6 space-y-2.5">
        {ai.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
            <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-cyan-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Decorative corner glow */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(14,165,233,.45), transparent 70%)" }} />
    </div>
  );
}

function AIDataFlow() {
  return (
    <svg viewBox="0 0 460 200" className="w-full h-auto">
      <defs>
        <linearGradient id="ai-line" x1="0" x2="1">
          <stop offset="0" stopColor="#0EA5E9" stopOpacity="0" />
          <stop offset=".5" stopColor="#0EA5E9" stopOpacity="1" />
          <stop offset="1" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ai-line2" x1="0" x2="1">
          <stop offset="0" stopColor="#10B981" stopOpacity="0" />
          <stop offset=".5" stopColor="#10B981" stopOpacity="1" />
          <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Stage 1: sensors */}
      <g>
        <rect x="10" y="40" width="100" height="120" rx="14" fill="white" stroke="#E2E8F0" />
        <text x="60" y="60" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B" letterSpacing="1.2">SENSORS</text>
        {[78, 98, 118, 138].map((y, i) => (
          <g key={i}>
            <rect x="22" y={y - 6} width="76" height="12" rx="3" fill="#F1F5F9" />
            <rect x="22" y={y - 6} width={[68, 42, 56, 30][i]} height="12" rx="3" fill="#0EA5E9" opacity={[.6, .4, .5, .3][i]}>
              <animate attributeName="width" values={`${[68, 42, 56, 30][i]};${[40, 65, 30, 70][i]};${[68, 42, 56, 30][i]}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </rect>
          </g>
        ))}
      </g>

      {/* Arrows 1 */}
      <line x1="115" y1="100" x2="165" y2="100" stroke="url(#ai-line)" strokeWidth="2">
        <animate attributeName="stroke-dasharray" values="0 60;60 0" dur="1.6s" repeatCount="indefinite" />
      </line>

      {/* Stage 2: Neural net */}
      <g transform="translate(170, 30)">
        <rect x="0" y="10" width="120" height="140" rx="14" fill="white" stroke="#E2E8F0" />
        <text x="60" y="30" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B" letterSpacing="1.2">NEURAL NET</text>
        {[0, 1, 2].map((layer) => (
          [0, 1, 2, 3].map((n) => (
            <circle
              key={`${layer}-${n}`}
              cx={20 + layer * 40}
              cy={55 + n * 22}
              r="4.5"
              fill={layer === 1 ? "#10B981" : "#0EA5E9"}
              opacity={0.5 + Math.random() * 0.5}
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + Math.random()}s`} repeatCount="indefinite" />
            </circle>
          ))
        ))}
        {[0, 1].map((l) =>
          [0, 1, 2, 3].flatMap((a) =>
            [0, 1, 2, 3].map((b) => (
              <line
                key={`l-${l}-${a}-${b}`}
                x1={20 + l * 40}
                y1={55 + a * 22}
                x2={20 + (l + 1) * 40}
                y2={55 + b * 22}
                stroke="#0EA5E9"
                strokeOpacity={0.08}
                strokeWidth="1"
              />
            ))
          )
        )}
      </g>

      {/* Arrows 2 */}
      <line x1="295" y1="100" x2="345" y2="100" stroke="url(#ai-line2)" strokeWidth="2">
        <animate attributeName="stroke-dasharray" values="0 60;60 0" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
      </line>

      {/* Stage 3: Insight card */}
      <g>
        <rect x="350" y="40" width="100" height="120" rx="14" fill="white" stroke="#E2E8F0" />
        <text x="400" y="60" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748B" letterSpacing="1.2">INSIGHT</text>
        <circle cx="400" cy="92" r="20" fill="#10B981" opacity=".12" />
        <circle cx="400" cy="92" r="13" fill="#10B981" opacity=".22" />
        <path d="M393 92 l5 5 9-10" stroke="#10B981" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="362" y="122" width="76" height="6" rx="3" fill="#F1F5F9" />
        <rect x="362" y="134" width="58" height="6" rx="3" fill="#F1F5F9" />
        <rect x="362" y="122" width="50" height="6" rx="3" fill="#10B981" opacity=".7">
          <animate attributeName="width" values="0;76;76" dur="3.2s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
}

// ── Wearable exploded view ─────────────────────────────────────────────────
function WearablePanel({ t }) {
  const w = t.tech.wearable;
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-6 lg:p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,.35)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="6" y="3" width="8" height="14" rx="2.5" />
              <path d="M8 6h4M8 14h4" />
            </svg>
          </span>
          <span className="text-[11px] uppercase tracking-[.14em] font-semibold text-emerald-700">{w.tag}</span>
        </div>
        <span className="text-[10px] uppercase tracking-[.14em] text-slate-400 font-medium">
          {hover ? "exploded" : w.hint}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[26px] lg:text-[30px] leading-tight tracking-tight text-slate-900">{w.title}</h3>
      <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed max-w-md">{w.desc}</p>

      <div className="relative mt-6 grid grid-cols-[1.1fr_1fr] gap-6 items-center min-h-[300px]">
        <ExplodedWearable layers={w.layers} hover={hover} />
        <ul className="space-y-1.5">
          {w.layers.map((l, i) => (
            <li
              key={i}
              className={`rounded-xl border p-3 transition-all duration-500 ${hover ? "bg-white/90 border-emerald-500/20 shadow-sm" : "bg-white/40 border-white/60"}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-emerald-700 font-semibold">L{i + 1}</span>
                  <span className="text-[13px] font-medium text-slate-800">{l.name}</span>
                </div>
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${hover ? "bg-emerald-500" : "bg-slate-300"}`} />
              </div>
              <div className="mt-0.5 text-[11.5px] text-slate-500 leading-snug">{l.note}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, rgba(16,185,129,.45), transparent 70%)" }} />
    </div>
  );
}

function ExplodedWearable({ layers, hover }) {
  // Four stacked layers; on hover they peel apart vertically + show callout lines
  const offsets = hover ? [-50, -18, 14, 46] : [-8, -3, 2, 7];

  return (
    <div className="relative h-[280px]">
      <svg viewBox="0 0 240 280" className="w-full h-full" style={{ overflow: "visible" }}>
        {/* connecting callout lines */}
        {layers.map((_, i) => (
          <line
            key={`call-${i}`}
            x1="180" y1={140 + offsets[i] + 8}
            x2="232" y2={140 + offsets[i] + 8}
            stroke="#10B981"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity={hover ? 0.6 : 0}
            style={{ transition: "opacity .4s" }}
          />
        ))}

        {/* L4 — solar micro-cell (back, faint orange-emerald) */}
        <g style={{ transition: "transform .55s cubic-bezier(.22,1,.36,1)", transform: `translateY(${offsets[3]}px)` }}>
          <rect x="60" y="120" width="120" height="44" rx="20" fill="#E2E8F0" />
          <rect x="68" y="128" width="104" height="28" rx="14" fill="#FCD34D" opacity=".5" />
          {[0,1,2,3,4,5,6].map(i => (
            <line key={i} x1={75 + i*14} y1="130" x2={75 + i*14} y2="154" stroke="#F59E0B" strokeWidth=".8" opacity=".6" />
          ))}
          <text x="64" y="116" fontSize="8" fill="#64748B" fontWeight="600" letterSpacing="1">L4 · SOLAR</text>
        </g>

        {/* L3 — recycled housing (matte slate) */}
        <g style={{ transition: "transform .55s cubic-bezier(.22,1,.36,1) .05s", transform: `translateY(${offsets[2]}px)` }}>
          <rect x="56" y="118" width="128" height="48" rx="22" fill="#0F172A" />
          <rect x="60" y="122" width="120" height="40" rx="20" fill="#1E293B" />
          <text x="60" y="114" fontSize="8" fill="#64748B" fontWeight="600" letterSpacing="1">L3 · HOUSING</text>
        </g>

        {/* L2 — bio-sensor (emerald glow ring) */}
        <g style={{ transition: "transform .55s cubic-bezier(.22,1,.36,1) .1s", transform: `translateY(${offsets[1]}px)` }}>
          <rect x="64" y="124" width="112" height="36" rx="18" fill="#10B981" opacity=".15" />
          <rect x="64" y="124" width="112" height="36" rx="18" fill="none" stroke="#10B981" strokeWidth="1.2" />
          <circle cx="84" cy="142" r="4" fill="#10B981" />
          <circle cx="120" cy="142" r="4" fill="#10B981" opacity=".6" />
          <circle cx="156" cy="142" r="4" fill="#10B981" opacity=".4" />
          <path d="M70 142 q10 -8 18 0 q10 8 18 0 q10 -8 18 0 q10 8 18 0 q10 -8 18 0" stroke="#10B981" strokeWidth="1" fill="none" opacity={hover ? 1 : .5}>
            <animate attributeName="opacity" values=".4;1;.4" dur="2s" repeatCount="indefinite" />
          </path>
          <text x="68" y="120" fontSize="8" fill="#10B981" fontWeight="600" letterSpacing="1">L2 · BIO-SENSORS</text>
        </g>

        {/* L1 — AI chip (top) */}
        <g style={{ transition: "transform .55s cubic-bezier(.22,1,.36,1) .15s", transform: `translateY(${offsets[0]}px)` }}>
          <rect x="78" y="128" width="84" height="28" rx="6" fill="#0EA5E9" opacity=".1" />
          <rect x="78" y="128" width="84" height="28" rx="6" fill="none" stroke="#0EA5E9" strokeWidth="1.2" />
          <rect x="92" y="134" width="56" height="16" rx="2" fill="#0EA5E9" />
          <text x="120" y="146" textAnchor="middle" fontSize="8" fill="white" fontWeight="700" letterSpacing="2">AI · 5nm</text>
          {[80,84,88,156,160].map((x,i)=>(<rect key={i} x={x} y="125" width="2" height="3" fill="#0EA5E9" />))}
          {[80,84,88,156,160].map((x,i)=>(<rect key={i} x={x} y="156" width="2" height="3" fill="#0EA5E9" />))}
          <text x="82" y="120" fontSize="8" fill="#0EA5E9" fontWeight="600" letterSpacing="1">L1 · AI CHIP</text>
        </g>

        {/* Strap hints */}
        <rect x="100" y={hover ? 240 : 200} width="40" height="36" rx="8" fill="#E2E8F0" opacity={hover ? .4 : .9} style={{ transition: "all .55s" }} />
        <rect x="100" y={hover ? -10 : 36} width="40" height="36" rx="8" fill="#E2E8F0" opacity={hover ? .4 : .9} style={{ transition: "all .55s" }} />
      </svg>
    </div>
  );
}


// ────────────────────────────────────────────────────────────────────────────
// Community & Behavior — third ecosystem panel
// ────────────────────────────────────────────────────────────────────────────
function CommunityPanel({ t }) {
  const c = t.tech.community;
  if (!c) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl ring-1 ring-slate-900/[.04] p-6 lg:p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,.35)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6 lg:gap-10 items-center">
        {/* LEFT: copy */}
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="7" cy="8" r="3" />
                <circle cx="14" cy="9" r="2.5" />
                <path d="M2 17c.4-2.6 2.5-4 5-4s4.6 1.4 5 4M11 17c.3-1.7 1.7-2.5 3-2.5s2.5.8 3 2.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-[11px] uppercase tracking-[.14em] font-semibold text-violet-700">{c.tag}</span>
          </div>

          <h3 className="mt-4 font-display text-[26px] lg:text-[30px] leading-tight tracking-tight text-slate-900">{c.title}</h3>
          <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">{c.desc}</p>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {c.stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-900/[.06] bg-white/70 p-3">
                <div className="text-[10px] uppercase tracking-[.12em] text-slate-500 font-semibold leading-tight">{s.label}</div>
                <div className="mt-1.5 font-display text-[22px] tracking-tight text-slate-900 leading-none">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Badge collection */}
          <div className="mt-6">
            <div className="text-[10.5px] uppercase tracking-[.14em] text-slate-500 font-semibold mb-2.5">Badges</div>
            <div className="flex flex-wrap gap-1.5">
              {c.badges.map((b, i) => (
                <BadgeChip key={i} label={b} idx={i} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: leaderboard mock */}
        <div className="relative">
          <div className="absolute inset-0 -m-4 rounded-3xl blur-2xl opacity-50 pointer-events-none"
            style={{ background: "radial-gradient(circle at 70% 30%, rgba(124,58,237,.25), transparent 60%)" }} />
          <div className="relative rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl ring-1 ring-slate-900/[.05] p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,.25)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500">Bike week challenge</div>
                <div className="font-display text-[18px] tracking-tight text-slate-900">Top contributors</div>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-500/15 px-2 py-1 text-[10px] font-semibold">
                <span className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" />
                LIVE
              </div>
            </div>

            <div className="space-y-2.5">
              {c.leaderboard.map((m, i) => (
                <LeaderboardRow key={i} m={m} i={i} />
              ))}
            </div>

            {/* Progress to next challenge */}
            <div className="mt-5 pt-4 border-t border-slate-900/[.06]">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-600">Sonraki: <span className="font-medium text-slate-900">Local food week</span></span>
                <span className="font-mono text-slate-500">3g 12s</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-[68%] rounded-full" style={{ background: "linear-gradient(90deg, #7C3AED, #10B981)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner glow */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, rgba(124,58,237,.45), transparent 70%)" }} />
    </div>
  );
}

function BadgeChip({ label, idx }) {
  const colors = ["#F59E0B", "#0EA5E9", "#10B981", "#7C3AED", "#E11D48"];
  const c = colors[idx % colors.length];
  const glyphs = ["☀", "🚲", "♻", "🌿", "🌱"];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1"
      style={{ color: c, backgroundColor: `${c}12`, borderColor: `${c}30` }}
    >
      <span className="text-[10px]" style={{ filter: "grayscale(0)" }}>{glyphs[idx % glyphs.length]}</span>
      {label}
    </span>
  );
}

function LeaderboardRow({ m, i }) {
  const avatarColors = ["#F59E0B", "#0EA5E9", "#10B981", "#7C3AED"];
  const ac = avatarColors[i % avatarColors.length];
  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
  const initials = m.name.split(" ").map((p) => p[0]).join("");
  // Bar width relative to rank 1
  const maxKg = 84;
  const numericCo2 = parseFloat(m.co2);
  const pct = (numericCo2 / maxKg) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="w-7 text-center">
        {medal ? (
          <span className="text-[16px] leading-none">{medal}</span>
        ) : (
          <span className="text-[11px] font-mono text-slate-500">#{m.rank}</span>
        )}
      </div>
      <div
        className="h-8 w-8 rounded-full grid place-items-center text-[10.5px] font-semibold text-white"
        style={{ background: `linear-gradient(135deg, ${ac}, ${ac}cc)` }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-medium text-slate-800 leading-tight">{m.name}</div>
        <div className="relative h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, #7C3AED, ${ac})` }}
          />
        </div>
      </div>
      <div className="font-mono tabular-nums text-[11.5px] text-slate-900 font-medium">{m.co2}</div>
    </div>
  );
}


export { TechEcosystem, CommunityPanel };
