// Impact Map — 3D globe with layers + interactions
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/shared/ui/primitives';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { CITIES } from '@/core/data/cities';
import { caseByCity } from '@/core/data/cases';
import { WorldGlobe } from '@/shared/3d/LazyGlobes';
import { useApp } from '@/app/providers/AppProvider';

function ImpactMap({ t }) {
  const m = t.impactMap;
  const { isDark, accents } = useApp();
  const cities = CITIES || [];

  const [layers, setLayers] = useState({
    active: true,
    partners: false,
    arcs: false,
    heat: false,
    solar: false,
  });
  const [showTerminator, setShowTerminator] = useState(false);
  const [hover, setHover] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeYear, setTimeYear] = useState(2026);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)).slice(0, 8);
  }, [search, cities]);

  // Active stats with time filter
  const activeCities = useMemo(() => cities.filter((c) => c.since <= timeYear), [timeYear, cities]);
  const totalCo2 = useMemo(() => activeCities.reduce((s, c) => s + c.co2, 0), [activeCities]);
  const totalPartners = useMemo(() => activeCities.filter((c) => c.partner).length, [activeCities]);
  const totalCountries = useMemo(() => new Set(activeCities.map((c) => c.country)).size, [activeCities]);

  // Live CO₂ counter — increments based on totalCo2/86400 per second
  const [liveTick, setLiveTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLiveTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  // kg/sec rate (very small) shown as accumulating decimal
  const co2Rate = totalCo2 / 86400; // kg saved per second across the network
  const liveCo2 = (liveTick * co2Rate).toFixed(2);

  // Nearest pilot — fake, picks closest by hash of locale
  const nearest = useMemo(() => {
    const navLang = typeof navigator !== "undefined" ? navigator.language : "en-US";
    const lang_country = (navLang || "en-US").split("-")[1] || "DE";
    return cities.find((c) => c.country === lang_country) || cities.find((c) => c.country === "TR") || cities[0];
  }, [cities]);

  function toggle(key) {
    setLayers((l) => ({ ...l, [key]: !l[key] }));
  }

  function selectCity(c) {
    setSelected(c);
    setSearchOpen(false);
    setSearch("");
  }

  return (
    <section id="impact" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[80%] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(14,165,233,.15), transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[50%] h-[60%] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(16,185,129,.13), transparent 60%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-10">
          <SectionHeader
            color="emerald"
            eyebrow={`03 · ${m.eyebrow}`}
            title={m.title}
            titleAccent={m.titleAccent}
            sub={m.sub}
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-white/[.08] bg-white/65 backdrop-blur-2xl ring-1 ring-slate-900/[.05] dark:ring-white/[.06] shadow-[0_50px_120px_-50px_rgba(15,23,42,.45)]">
          {/* Header strip with stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-900/[.06] border-b border-slate-900/[.06] bg-white/40">
            <StatPill label={m.stats.cities} value={activeCities.length} accent="#10B981" />
            <StatPill label={m.stats.countries} value={totalCountries} accent="#0EA5E9" />
            <StatPill label={m.stats.partners} value={totalPartners} accent="#7C3AED" />
            <StatPill label={m.stats.co2live} value={`${liveCo2} kg`} accent="#F59E0B" live />
          </div>

          {/* Main map area */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* Globe */}
            <div className="relative h-[460px] lg:h-[640px] bg-gradient-to-br from-slate-50/30 via-white/10 to-white/0">
              <WorldGlobe
                layers={layers}
                onHover={(city, pos) => { setHover(city); setHoverPos(pos); }}
                onSelect={selectCity}
                selected={selected}
                timeYear={timeYear}
                showTerminator={showTerminator}
                theme={isDark ? "dark" : "light"}
                cyan={accents.cyan}
                emerald={accents.emerald}
                borders
                capitals
                ariaLabel={t.a11y.globeFull}
              />

              {/* Hover tooltip — follows the city in screen-space */}
              {hover && hoverPos && !selected && <HoverCard city={hover} pos={hoverPos} m={m} />}

              {/* Help hints (corner) */}
              <div className="absolute bottom-3 left-3 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-3 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-white/[.04] backdrop-blur px-2 py-1 ring-1 ring-slate-900/[.05] dark:ring-white/[.06]">
                  <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3-3 3 3 3M5 4l3-3 3 3" strokeLinecap="round" /></svg>
                  {m.helpDrag}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-white/[.04] backdrop-blur px-2 py-1 ring-1 ring-slate-900/[.05] dark:ring-white/[.06]">
                  <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="3" /><circle cx="7" cy="7" r="6" /></svg>
                  {m.helpClick}
                </span>
              </div>

              {/* Search box (top-left of globe) */}
              <div className="absolute top-3 left-3 z-10 w-64 max-w-[calc(100%-1.5rem)]">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                    placeholder={m.searchP}
                    className="w-full rounded-full pl-9 pr-3 py-2 text-[12.5px] bg-white/80 dark:bg-white/[.06] backdrop-blur-md ring-1 ring-slate-900/[.06] border border-white/70 dark:border-white/[.08] outline-none focus:ring-cyan-500/30 focus:border-cyan-500/30 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  />
                  <svg viewBox="0 0 16 16" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="4.5" /><path d="M13 13l-2.5-2.5" strokeLinecap="round" /></svg>
                </div>
                {searchOpen && filtered.length > 0 && (
                  <div className="mt-2 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-900/[.08] dark:border-white/[.1] shadow-xl p-1 max-h-64 overflow-y-auto">
                    {filtered.map((c) => (
                      <button key={c.name} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => selectCity(c)} className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[12.5px] text-slate-700 dark:text-slate-300 hover:bg-slate-50">
                        <span className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${c.partner ? "bg-cyan-500" : "bg-emerald-500"}`} />
                          {c.name}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-mono">{c.country} · {c.users}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Time scrubber */}
              <div className="absolute top-3 right-3 z-10 w-44">
                <div className="rounded-full bg-white/80 dark:bg-white/[.06] backdrop-blur-md ring-1 ring-slate-900/[.06] border border-white/70 dark:border-white/[.08] px-3 py-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9.5px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">{m.timeLabel}</span>
                    <span className="text-[10.5px] font-mono font-semibold text-slate-900 dark:text-slate-100">{timeYear}</span>
                  </div>
                  <input
                    type="range" min="2024" max="2026" step="1" value={timeYear}
                    onChange={(e) => setTimeYear(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Nearest pilot pill */}
              {nearest && (
                <div className="absolute bottom-3 right-3 z-10">
                  <button onClick={() => selectCity(nearest)} className="inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-slate-900/[.06] border border-white/70 dark:border-white/[.08] px-3 py-1.5 text-[11.5px] text-slate-700 dark:text-slate-300 hover:bg-white transition">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px]" style={{ background: "linear-gradient(135deg,#0EA5E9,#10B981)" }}>
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="6" cy="5" r="2" /><path d="M6 1v2M2 5h2M10 5h-2M6 9v2M2 11l4-3 4 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">{m.nearestLabel}:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{nearest.name}</span>
                    <span className="text-slate-400 font-mono">{nearest.country}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Side panel */}
            <aside className="border-t lg:border-t-0 lg:border-l border-slate-900/[.05] dark:border-white/[.06] bg-white/40 backdrop-blur-md">
              {selected ? (
                <CityDetail city={selected} m={m} onClose={() => setSelected(null)} />
              ) : (
                <LayerPanel layers={layers} toggle={toggle} m={m} showTerminator={showTerminator} setShowTerminator={setShowTerminator} />
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({ label, value, accent, live }) {
  const ref = useRef();
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  // Live counters update continuously — don't tween them, just render.
  return (
    <div ref={ref} className="px-5 py-4 relative">
      {live && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          live
        </span>
      )}
      <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-display text-[24px] tracking-tight" style={{ color: accent }}>
        {live ? value : <AnimatedNumber value={value} play={seen} />}
      </div>
    </div>
  );
}

function HoverCard({ city, pos, m }) {
  // Position is in pixels relative to globe container; clamp inside viewport.
  const style = pos ? {
    left: Math.max(8, Math.min(pos.x + 14, 9999)),
    top: Math.max(8, pos.y - 8),
    transform: "translate(0, -100%)",
  } : {};
  return (
    <div className="absolute z-20 max-w-[220px] pointer-events-none" style={style}>
      <div className="rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 ring-1 ring-slate-900/[.06] px-3.5 py-3 shadow-[0_18px_50px_-20px_rgba(15,23,42,.35)]">
        <div className="flex items-center gap-2 mb-1">
          <span className={`h-1.5 w-1.5 rounded-full ${city.capital ? "bg-slate-400" : city.partner ? "bg-cyan-500" : "bg-emerald-500"}`} />
          <span className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">{city.country}</span>
          {city.capital && <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 ml-auto">{m.details.capital || "CAPITAL"}</span>}
          {!city.capital && city.partner && <span className="text-[9.5px] font-mono text-cyan-700 ml-auto">PARTNER</span>}
        </div>
        <div className="font-display text-[16px] tracking-tight text-slate-900 dark:text-slate-100 leading-tight">{city.name}</div>
        {!city.capital && (
          <div className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex justify-between gap-3"><span>{m.details.users}</span><span className="font-mono text-slate-900 dark:text-slate-100">{city.users.toLocaleString()}</span></div>
            <div className="flex justify-between gap-3"><span>{m.details.co2}</span><span className="font-mono text-emerald-700">{city.co2} kg</span></div>
            <div className="flex justify-between gap-3"><span>{m.details.solar}</span><span className="font-mono text-amber-600">{city.solar}%</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

function LayerPanel({ layers, toggle, m, showTerminator, setShowTerminator }) {
  const items = [
    { key: "active", spec: m.layers.active },
    { key: "partners", spec: m.layers.partners },
    { key: "arcs", spec: m.layers.arcs },
    { key: "heat", spec: m.layers.heat },
    { key: "solar", spec: m.layers.solar },
  ];
  return (
    <div className="p-5">
      <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400 mb-4">Veri katmanları</div>
      <div className="space-y-1.5">
        {items.map(({ key, spec }) => (
          <LayerRow key={key} on={layers[key]} onToggle={() => toggle(key)} spec={spec} />
        ))}
        <LayerRow on={showTerminator} onToggle={() => setShowTerminator(!showTerminator)} spec={m.layers.terminator} />
      </div>
      <div className="mt-6 pt-4 border-t border-slate-900/[.06] text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Bir nokta veya partner üzerine gel → detayları gör. <span className="font-medium text-slate-700 dark:text-slate-300">Tıkla</span> → şehir profilini sabit aç.
      </div>
    </div>
  );
}

function LayerRow({ on, onToggle, spec }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition border ${on ? "bg-white/80 dark:bg-white/[.06] border-slate-900/[.05] dark:border-white/[.06]" : "bg-transparent border-transparent hover:bg-white/60 dark:bg-white/[.04]"}`}
    >
      <span className="relative mt-0.5 h-4 w-7 rounded-full flex-none" style={{ backgroundColor: on ? `${spec.color}` : "rgba(15,23,42,.12)" }}>
        <span className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all" style={{ left: on ? 14 : 2 }} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2 text-[13px] font-medium text-slate-900 dark:text-slate-100">
          {spec.label}
        </span>
        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{spec.desc}</span>
      </span>
    </button>
  );
}

function CityDetail({ city, m, onClose }) {
  const study = caseByCity(city.name);
  return (
    <div className="p-5 relative">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${city.partner ? "bg-cyan-500" : "bg-emerald-500"}`} />
          <span className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">{city.country}</span>
        </div>
        <button onClick={onClose} className="h-7 w-7 rounded-full grid place-items-center text-slate-500 dark:text-slate-400 hover:bg-slate-900/[.05]">
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4l6 6M10 4l-6 6" strokeLinecap="round" /></svg>
        </button>
      </div>

      <h3 className="font-display text-[28px] leading-tight tracking-tight text-slate-900 dark:text-slate-100">{city.name}</h3>

      {city.partner && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-500/15 px-2 py-0.5 text-[10.5px] font-semibold">
          {m.details.partner}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DetailStat label={m.details.users}   value={city.users.toLocaleString()} accent="#0EA5E9" />
        <DetailStat label={m.details.co2}     value={`${city.co2} kg`}           accent="#10B981" />
        <DetailStat label={m.details.solar}   value={`${city.solar}%`}           accent="#F59E0B" />
        <DetailStat label={m.details.since}   value={city.since}                  accent="#7C3AED" />
      </div>

      {/* Mini progress chart of solar share */}
      <div className="mt-5">
        <div className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold mb-2">Renewable mix</div>
        <div className="space-y-2 text-[11.5px]">
          {[
            { label: "Solar", v: city.solar, color: "#F59E0B" },
            { label: "Wind", v: Math.max(0, 100 - city.solar - 40), color: "#0EA5E9" },
            { label: "Grid", v: 40, color: "#94A3B8" },
          ].map((b, i) => (
            <div key={i}>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                <span>{b.label}</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{b.v}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${b.v}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {study && (
        <Link to={`/cases/${study.slug}`} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-[12.5px] font-medium text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.1] dark:ring-white/[.12] hover:ring-cyan-500/40">
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2.5h6l2 2v7h-8z" strokeLinejoin="round" /><path d="M5 6h4M5 8.5h4" strokeLinecap="round" /></svg>
          {m.details.readCase}
        </Link>
      )}

      <Link to="/contact" className={`${study ? 'mt-2' : 'mt-6'} w-full inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-[12.5px] font-medium text-white shadow-[0_10px_30px_-12px_rgba(14,165,233,.6)]`}
        style={{ backgroundImage: "linear-gradient(120deg,#0EA5E9,#10B981)" }}>
        {m.details.openProfile}
        <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
      </Link>
    </div>
  );
}

function DetailStat({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-white/80 dark:bg-white/[.06] border border-slate-900/[.05] dark:border-white/[.06] p-3">
      <div className="text-[10px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">{label}</div>
      <div className="mt-1 font-display text-[18px] tracking-tight" style={{ color: accent }}>{value}</div>
    </div>
  );
}


export { ImpactMap };