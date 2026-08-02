
// Ecozyon Tech — Hero visual variants (alternatives to the Three.js globe)
// Exposes:
//   HeroParticles — Canvas2D particle ecosystem
//   HeroDataGrid  — animated SVG grid with carbon flow visualization
import React, { useEffect, useRef, useState } from 'react';

  // ── Variant A: Particle ecosystem (Canvas 2D) ──────────────────────────
  function HeroParticles({ cyan = "#0EA5E9", emerald = "#10B981", dark = false }) {
    const ref = useRef(null);

    useEffect(() => {
      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = canvas.clientWidth, h = canvas.clientHeight;

      function resize() {
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const N = 110;
      const particles = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() < 0.3 ? "e" : "c", // emerald vs cyan
      }));

      const target = { x: w / 2, y: h / 2, active: false };
      function onMove(e) {
        const r = canvas.getBoundingClientRect();
        target.x = e.clientX - r.left;
        target.y = e.clientY - r.top;
        target.active = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      }
      window.addEventListener("mousemove", onMove);

      let raf;
      function tick() {
        ctx.clearRect(0, 0, w, h);

        // Soft radial vignette (theme-aware via canvas paints)
        const grd = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, Math.max(w, h) / 1.4);
        grd.addColorStop(0, dark ? "rgba(14,165,233,0.10)" : "rgba(14,165,233,0.08)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        // Update + draw particles
        for (const p of particles) {
          // Gentle attraction towards target if active
          if (target.active) {
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 30000) {
              p.vx += (dx / Math.sqrt(d2 + 1)) * 0.02;
              p.vy += (dy / Math.sqrt(d2 + 1)) * 0.02;
            }
          }
          p.vx *= 0.985; p.vy *= 0.985;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x += w; if (p.x > w) p.x -= w;
          if (p.y < 0) p.y += h; if (p.y > h) p.y -= h;

          ctx.beginPath();
          ctx.fillStyle = p.hue === "e" ? emerald : cyan;
          ctx.globalAlpha = 0.75;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw connection lines
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 9000) {
              const alpha = 1 - d2 / 9000;
              ctx.strokeStyle = a.hue === "e" || b.hue === "e" ? emerald : cyan;
              ctx.globalAlpha = alpha * (dark ? 0.18 : 0.22);
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(tick);
      }
      tick();

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("mousemove", onMove);
      };
    }, [cyan, emerald, dark]);

    return (
      <div className="relative w-full h-full">
        <canvas ref={ref} className="w-full h-full" />
        {/* Center logo / pulse */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse"
              style={{ background: `radial-gradient(circle, ${emerald}99, transparent 70%)` }} />
            <div className="relative h-24 w-24 rounded-full grid place-items-center text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${cyan}, ${emerald})` }}>
              <svg viewBox="0 0 32 32" className="h-10 w-10" fill="none">
                <circle cx="16" cy="16" r="11" stroke="white" strokeWidth="1.6" fill="none" opacity=".9" />
                <path d="M8 16 Q16 8 24 16 T8 16" stroke="white" strokeWidth="1.6" fill="none" />
                <circle cx="22" cy="11" r="1.8" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Variant B: Animated data grid (SVG) ────────────────────────────────
  function HeroDataGrid({ cyan = "#0EA5E9", emerald = "#10B981" }) {
    const COLS = 14, ROWS = 14;
    const [tick, setTick] = useState(0);

    useEffect(() => {
      const id = setInterval(() => setTick((t) => t + 1), 900);
      return () => clearInterval(id);
    }, []);

    // Deterministic per-tick highlights
    const highlights = React.useMemo(() => {
      const seed = (tick * 9301 + 49297) % 233280;
      const rand = (i) => ((seed + i * 71) % 1000) / 1000;
      const hs = [];
      for (let i = 0; i < 18; i++) {
        const c = Math.floor(rand(i) * COLS);
        const r = Math.floor(rand(i * 3 + 7) * ROWS);
        const color = rand(i * 5) > 0.4 ? cyan : emerald;
        hs.push({ c, r, color, intensity: 0.6 + rand(i * 13) * 0.4 });
      }
      return hs;
    }, [tick, cyan, emerald]);

    // Static important nodes
    const nodes = [
      { c: 3, r: 4, label: "AI · 0.4W", color: cyan },
      { c: 9, r: 3, label: "Solar +12 kWh", color: emerald },
      { c: 11, r: 9, label: "API · 8.4K", color: cyan },
      { c: 4, r: 10, label: "CO₂ -38 kg/h", color: emerald },
    ];

    const cell = 32;
    const w = COLS * cell;
    const h = ROWS * cell;

    return (
      <div className="relative w-full h-full grid place-items-center overflow-hidden">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="hdg-mask">
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="hdg-fade">
              <rect width={w} height={h} fill="url(#hdg-mask)" />
            </mask>
            <linearGradient id="hdg-line-c" x1="0" x2="1">
              <stop offset="0" stopColor={cyan} stopOpacity="0" />
              <stop offset=".5" stopColor={cyan} stopOpacity="1" />
              <stop offset="1" stopColor={cyan} stopOpacity="0" />
            </linearGradient>
          </defs>

          <g mask="url(#hdg-fade)">
            {/* Grid lines */}
            {Array.from({ length: COLS + 1 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * cell} y1="0" x2={i * cell} y2={h} stroke="currentColor" strokeOpacity=".07" strokeWidth=".6" />
            ))}
            {Array.from({ length: ROWS + 1 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * cell} x2={w} y2={i * cell} stroke="currentColor" strokeOpacity=".07" strokeWidth=".6" />
            ))}

            {/* Random pulsing cells */}
            {highlights.map((cell_, i) => (
              <rect
                key={`hl-${tick}-${i}`}
                x={cell_.c * cell + 2} y={cell_.r * cell + 2}
                width={cell - 4} height={cell - 4}
                rx="3"
                fill={cell_.color}
                opacity={cell_.intensity}
              >
                <animate attributeName="opacity" from={cell_.intensity} to="0" dur="1.4s" fill="freeze" />
              </rect>
            ))}

            {/* Travelling arcs between important nodes */}
            {nodes.map((a, i) => {
              const b = nodes[(i + 1) % nodes.length];
              const x1 = a.c * cell + cell / 2;
              const y1 = a.r * cell + cell / 2;
              const x2 = b.c * cell + cell / 2;
              const y2 = b.r * cell + cell / 2;
              const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
              const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
              return (
                <path
                  key={`arc-${i}`}
                  d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                  stroke={a.color}
                  strokeOpacity=".35"
                  strokeWidth="1.2"
                  fill="none"
                  strokeDasharray="3 4"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="2.5s" repeatCount="indefinite" />
                </path>
              );
            })}

            {/* Important nodes */}
            {nodes.map((n, i) => (
              <g key={`n-${i}`}>
                <circle cx={n.c * cell + cell / 2} cy={n.r * cell + cell / 2} r="14" fill={n.color} opacity=".15">
                  <animate attributeName="r" values="12;18;12" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={n.c * cell + cell / 2} cy={n.r * cell + cell / 2} r="6" fill={n.color} />
                <text
                  x={n.c * cell + cell / 2 + 12} y={n.r * cell + cell / 2 + 3}
                  fontSize="9" fontWeight="600" fill={n.color} fontFamily="ui-monospace"
                >{n.label}</text>
              </g>
            ))}
          </g>
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="rounded-2xl backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/60 px-4 py-3 ring-1 ring-slate-900/[.04] text-center">
            <div className="text-[10px] uppercase tracking-[.2em] text-slate-500 font-semibold">Live network</div>
            <div className="font-display text-[22px] tracking-tight text-slate-900">8,431 nodes</div>
            <div className="text-[11px] text-emerald-700 font-mono">●  syncing</div>
          </div>
        </div>
      </div>
    );
  }

  export { HeroParticles, HeroDataGrid };
