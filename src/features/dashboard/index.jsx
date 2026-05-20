// Interactive dashboard preview
import React, { useState, useEffect } from 'react';
import { Tag, EcoLogo } from '@/shared/ui/primitives';
import { WorldGlobe } from '@/shared/3d/LazyGlobes';

function DashboardPreview({ t, lang }) {
  const [tab, setTab] = useState(0);
  const [view, setView] = useState("overview"); // overview | devices | insights
  const [weekHover, setWeekHover] = useState(null);
  const [donutHover, setDonutHover] = useState(null);
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);

  // Live mode pulse — increments every 3s
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, [live]);

  // Datasets that subtly change with tab
  const datasets = [
    { // Personal
      budget: { used: 38, total: 100, unit: "kg CO₂" },
      week: [4.2, 6.1, 3.8, 8.5, 5.3, 2.9, 4.4],
      target: 5.5,
      cats: [42, 28, 18, 12],
      line: "12 → 8.4 kg",
      delta: "-30%",
      headline: "1.4 kg",
    },
    { // Team
      budget: { used: 412, total: 800, unit: "kg CO₂" },
      week: [62, 78, 51, 94, 70, 38, 49],
      target: 70,
      cats: [38, 31, 14, 17],
      line: "98 → 65 kg",
      delta: "-34%",
      headline: "18 kg",
    },
    { // Enterprise
      budget: { used: 2840, total: 5200, unit: "t CO₂" },
      week: [340, 410, 280, 520, 380, 190, 270],
      target: 360,
      cats: [29, 41, 11, 19],
      line: "2.4 → 1.7 kt",
      delta: "-28%",
      headline: "240 t",
    },
  ];
  const d = datasets[tab];
  const dayLabels = ["P", "S", "Ç", "P", "C", "Ct", "P"];

  return (
    <section id="dashboard" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(14,165,233,.18), transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 h-[460px] w-[460px] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(16,185,129,.16), transparent 70%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <Tag color="cyan">// 05 · {t.dash.eyebrow}</Tag>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
              {t.dash.title}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(110deg,#0EA5E9 0%, #10B981 100%)" }}>
                {t.dash.titleAccent}
              </span>
            </h2>
            <p className="mt-3 text-[14.5px] text-slate-600 max-w-lg leading-relaxed">{t.dash.sub}</p>
          </div>
        </div>

        {/* Browser-frame style dashboard */}
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/65 backdrop-blur-2xl ring-1 ring-slate-900/[.05] shadow-[0_50px_120px_-50px_rgba(15,23,42,.45)]">
          {/* Window chrome */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-900/[.06] bg-gradient-to-b from-white/80 to-white/40">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57] hover:brightness-90" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E] hover:brightness-90" />
              <span className="h-3 w-3 rounded-full bg-[#28C840] hover:brightness-90" />
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button className="h-6 w-6 rounded-md grid place-items-center text-slate-400 hover:bg-slate-900/[.05] hover:text-slate-700">
                <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 4L5 7l4 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="h-6 w-6 rounded-md grid place-items-center text-slate-400 hover:bg-slate-900/[.05] hover:text-slate-700">
                <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4l4 3-4 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => setTick((t) => t + 1)} className="h-6 w-6 rounded-md grid place-items-center text-slate-400 hover:bg-slate-900/[.05] hover:text-slate-700">
                <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7a4 4 0 0 1 7-2.5M11 7a4 4 0 0 1-7 2.5M3 4v2.5h2.5M11 9.5V7H8.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-1 text-[11px] text-slate-600 ring-1 ring-slate-900/[.06] min-w-[280px] justify-center">
                <svg viewBox="0 0 16 16" className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 7V5a3 3 0 0 0-6 0v2M4 7h8v6H4z" /></svg>
                <span className="text-slate-400">app.ecozyon.tech</span>
                <span className="text-slate-900">/dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLive((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition ${live ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20" : "bg-slate-900/[.05] text-slate-500 hover:text-slate-700"}`}
                title="Toggle live data"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {live ? "LIVE" : "PAUSED"}
              </button>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{lang === "tr" ? `Son güncel: ${tick}s·` : `Last update: ${tick}s·`}</span>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="border-r border-slate-900/[.06] bg-white/30 p-4 hidden md:block">
              <div className="flex items-center gap-2 mb-5 px-2">
                <EcoLogo />
              </div>
              <div className="space-y-1">
                {[
                  { i: "home", label: "Overview", v: "overview" },
                  { i: "device", label: "Devices", v: "devices" },
                  { i: "chart", label: "Insights", v: "insights" },
                  { i: "spark", label: "Carbon budget" },
                  { i: "people", label: "Team" },
                  { i: "report", label: "ESG report" },
                ].map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => it.v && setView(it.v)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left ${
                      it.v && it.v === view
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-900/[.04]"
                    }`}
                  >
                    <SidebarIcon name={it.i} />
                    {lang === "tr" && it.v === "overview" ? "Genel bakış" :
                     lang === "tr" && it.v === "devices" ? "Cihazlar" :
                     lang === "tr" && it.v === "insights" ? "İçgörüler" :
                     it.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-slate-900/[.06]">
                <div className="text-[10px] uppercase tracking-[.14em] text-slate-500 font-semibold px-2 mb-2">Workspace</div>
                {["Personal", "Atlas Bank", "Helios Energy"].map((w, i) => (
                  <a key={i} href="#" className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] ${i === 0 ? "text-slate-900 font-medium" : "text-slate-500 hover:bg-slate-900/[.04]"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
                    {w}
                  </a>
                ))}
              </div>
            </aside>

            {/* Main panel */}
            <div className="p-5 lg:p-7 bg-gradient-to-br from-white/30 via-white/40 to-white/60">
              {/* Tabs + greeting */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{t.dash.budgetSub}</div>
                  <div className="font-display text-[22px] tracking-tight text-slate-900">
                    {view === "overview" && (lang === "tr" ? "Günaydın Emre 👋" : "Good morning, Emre 👋")}
                    {view === "devices" && (lang === "tr" ? "Bağlı cihazlar" : "Connected devices")}
                    {view === "insights" && (lang === "tr" ? "Bu haftanın içgörüleri" : "This week's insights")}
                  </div>
                </div>
                <div className="inline-flex rounded-full bg-slate-900/[.05] p-1 text-[11.5px] font-medium text-slate-600 self-start">
                  {t.dash.tabs.map((lab, i) => (
                    <button
                      key={i}
                      onClick={() => setTab(i)}
                      className={`px-3.5 py-1.5 rounded-full transition ${tab === i ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
                    >
                      {lab}
                    </button>
                  ))}
                </div>
              </div>

              {view === "overview" && (
                <DashOverview t={t} d={d} dayLabels={dayLabels} weekHover={weekHover} setWeekHover={setWeekHover} donutHover={donutHover} setDonutHover={setDonutHover} tab={tab} live={live} tick={tick} />
              )}
              {view === "devices" && <DashDevices t={t} lang={lang} tab={tab} />}
              {view === "insights" && <DashInsights lang={lang} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Dashboard subviews ─────────────────────────────────────────────────────
function DashOverview({ t, d, dayLabels, weekHover, setWeekHover, donutHover, setDonutHover, tab, live, tick }) {
  // Subtle live-mode mutations
  const liveUsed = live ? Math.min(d.budget.total, d.budget.used + (tick % 4)) : d.budget.used;
  const livePct = Math.round((liveUsed / d.budget.total) * 100);
  return (
    <div className="grid grid-cols-12 gap-3">
                {/* Carbon budget — radial gauge */}
                <div className="col-span-12 lg:col-span-5 rounded-2xl bg-white border border-slate-900/[.05] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{t.dash.budgetTitle}</div>
                      <div className="mt-1 font-display text-[34px] leading-none tracking-tight text-slate-900">
                        <span className={live ? "transition-all duration-500" : ""}>{liveUsed}</span><span className="text-slate-400 text-[18px] ml-0.5">/{d.budget.total}</span>
                      </div>
                      <div className="text-[12px] text-slate-500 mt-1">{d.budget.unit}</div>
                    </div>
                    <div className="rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-semibold px-2 py-1 ring-1 ring-emerald-500/15">
                      {d.delta}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-5">
                    <RadialGauge pct={livePct} />
                    <div className="space-y-2 text-[12px] flex-1">
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500" /><span className="text-slate-700">{livePct}% {t.dash.used}</span></div>
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-200" /><span className="text-slate-700">{100 - livePct}% {t.dash.remaining}</span></div>
                      <div className="pt-1 mt-1 border-t border-slate-100 text-[11px] text-slate-500">AI: bisikletle gidersen %12 daha az</div>
                    </div>
                  </div>
                </div>

                {/* Weekly bars */}
                <div className="col-span-12 lg:col-span-7 rounded-2xl bg-white border border-slate-900/[.05] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{t.dash.weekTitle}</div>
                      <div className="mt-1 font-display text-[20px] tracking-tight text-slate-900">{t.dash.weekSub}</div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full bg-cyan-500" />Actual</span>
                      <span className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-0.5 w-3 rounded bg-emerald-500" />Target</span>
                    </div>
                  </div>

                  <WeeklyBars data={d.week} target={d.target} days={dayLabels} hover={weekHover} setHover={setWeekHover} />
                </div>

                {/* Category donut */}
                <div className="col-span-12 md:col-span-6 lg:col-span-5 rounded-2xl bg-white border border-slate-900/[.05] p-5">
                  <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{t.dash.catTitle}</div>
                  <div className="mt-3 flex items-center gap-5">
                    <Donut values={d.cats} hover={donutHover} setHover={setDonutHover} />
                    <ul className="flex-1 space-y-2 text-[12.5px]">
                      {t.dash.catItems.map((c, i) => {
                        const colors = ["#0EA5E9", "#10B981", "#7C3AED", "#F59E0B"];
                        const isHov = donutHover === i;
                        return (
                          <li
                            key={i}
                            onMouseEnter={() => setDonutHover(i)}
                            onMouseLeave={() => setDonutHover(null)}
                            className={`flex items-center justify-between px-1.5 py-1 rounded-md cursor-default transition ${isHov ? "bg-slate-50" : ""}`}
                          >
                            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors[i] }} /><span className="text-slate-700">{c}</span></span>
                            <span className="font-mono text-slate-900 font-medium">{d.cats[i]}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* AI insight */}
                <div className="col-span-12 md:col-span-6 lg:col-span-7 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-50/70 to-cyan-50/40 p-5 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, rgba(16,185,129,.55), transparent)" }} />
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-inner">
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.6 4.6l2.1 2.1M13.3 13.3l2.1 2.1M4.6 15.4l2.1-2.1M13.3 6.7l2.1-2.1" strokeLinecap="round" /></svg>
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] uppercase tracking-[.14em] text-emerald-700 font-semibold">{t.dash.insight}</div>
                        <span className="text-[10px] text-emerald-700 font-mono">●  LIVE</span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] text-slate-800 leading-snug">{t.dash.insightText}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="rounded-full bg-slate-900 text-white text-[11.5px] font-medium px-3 py-1.5 hover:bg-slate-800">Apply suggestion</button>
                        <button className="rounded-full bg-white text-slate-700 text-[11.5px] font-medium px-3 py-1.5 border border-slate-900/[.08]">Show similar</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-[28px] leading-none tracking-tight text-emerald-600">{d.headline}</div>
                      <div className="text-[10.5px] text-slate-500">/ {tab === 0 ? "week" : tab === 1 ? "week" : "month"}</div>
                    </div>
                  </div>
                </div>

                {/* Sparklines row */}
                <div className="col-span-12 rounded-2xl bg-white border border-slate-900/[.05] p-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                      { label: "Transport CO₂", val: d.line, color: "#0EA5E9", series: [12, 14, 11, 9, 10, 8.4, 7.8] },
                      { label: "Active devices", val: tab === 0 ? "1" : tab === 1 ? "42" : "1,840", color: "#10B981", series: [1, 1, 1, 1, 1, 1, 1] },
                      { label: "AI suggestions", val: "23", color: "#7C3AED", series: [12, 15, 17, 14, 19, 21, 23] },
                      { label: "Streak", val: tab === 0 ? "14 days" : tab === 1 ? "9 wks" : "6 mo", color: "#F59E0B", series: [3, 5, 7, 8, 10, 12, 14] },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Sparkline data={s.series} color={s.color} />
                        <div>
                          <div className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 font-semibold">{s.label}</div>
                          <div className="font-display text-[16px] text-slate-900 tracking-tight">{s.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
    </div>
  );
}

// ── Devices view ───────────────────────────────────────────────────────────
function DashDevices({ t, lang, tab }) {
  const devices = [
    { name: "Ecozyon Band v2", id: "ECZ-08431", battery: 78, sync: lang === "tr" ? "2 dk önce" : "2 min ago", co2: "-1.4 kg", status: "online", user: "Emre Y." },
    { name: "Ecozyon Ring",    id: "ECZ-08432", battery: 92, sync: lang === "tr" ? "şimdi"     : "now",       co2: "-0.8 kg", status: "online", user: "Zeynep D." },
    { name: "Ecozyon Band v1", id: "ECZ-04190", battery: 34, sync: lang === "tr" ? "12 dk önce": "12 min ago", co2: "-2.1 kg", status: "online", user: "Ali K." },
    { name: "Ecozyon Clip",    id: "ECZ-02018", battery: 56, sync: lang === "tr" ? "1 saat önce":"1 hr ago",   co2: "-0.5 kg", status: "idle",   user: "Mert C." },
    { name: "Ecozyon Band v2", id: "ECZ-08501", battery: 12, sync: lang === "tr" ? "3 saat önce":"3 hr ago",   co2: "-0.2 kg", status: "low",    user: "Defne A." },
  ];

  const stats = [
    { label: lang === "tr" ? "Toplam cihaz" : "Total devices", val: tab === 0 ? "1" : tab === 1 ? "42" : "1,840", color: "#0EA5E9" },
    { label: lang === "tr" ? "Çevrimiçi"   : "Online",         val: tab === 0 ? "1" : tab === 1 ? "38" : "1,712", color: "#10B981" },
    { label: lang === "tr" ? "Düşük pil"   : "Low battery",    val: tab === 0 ? "0" : tab === 1 ? "3"  : "94",    color: "#F59E0B" },
    { label: lang === "tr" ? "Sync sorunu" : "Sync issue",     val: tab === 0 ? "0" : tab === 1 ? "1"  : "34",    color: "#E11D48" },
  ];

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl bg-white border border-slate-900/[.05] p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 font-semibold">{s.label}</span>
            </div>
            <div className="mt-2 font-display text-[26px] tracking-tight text-slate-900 leading-none">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="col-span-12 rounded-2xl bg-white border border-slate-900/[.05] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-900/[.05]">
          <div className="text-[12px] font-semibold text-slate-700">{lang === "tr" ? "Son senkronizasyon" : "Recent sync"}</div>
          <div className="text-[11px] text-slate-500 font-mono">{devices.length} {lang === "tr" ? "satır" : "rows"}</div>
        </div>
        <div className="divide-y divide-slate-900/[.04]">
          {devices.map((dv, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-5 py-3.5 text-[12.5px] hover:bg-slate-50/40">
              <div className="col-span-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 ring-1 ring-slate-900/[.05] grid place-items-center">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="3" width="8" height="14" rx="2.5"/><path d="M8 6h4M8 14h4"/></svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{dv.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{dv.id} · {dv.user}</div>
                </div>
              </div>
              <div className="col-span-3 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="relative h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{
                      width: `${dv.battery}%`,
                      background: dv.battery > 50 ? "#10B981" : dv.battery > 20 ? "#F59E0B" : "#E11D48",
                    }} />
                  </div>
                  <span className="text-slate-700 font-mono tabular-nums text-[11.5px]">{dv.battery}%</span>
                </div>
              </div>
              <div className="col-span-2 hidden md:block text-slate-500">{dv.sync}</div>
              <div className="col-span-1 hidden md:block text-emerald-700 font-medium text-right">{dv.co2}</div>
              <div className="col-span-7 sm:col-span-4 md:col-span-1 text-right">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                  dv.status === "online" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/15"
                  : dv.status === "low"  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-900/10"
                }`}>
                  <span className="h-1 w-1 rounded-full bg-current" />
                  {dv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7 rounded-2xl bg-white border border-slate-900/[.05] p-5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{lang === "tr" ? "Filo dağılımı" : "Fleet distribution"}</div>
          <div className="flex items-center gap-2 text-[10.5px]">
            <span className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{lang === "tr" ? "Aktif" : "Active"}</span>
            <span className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />{lang === "tr" ? "Partner" : "Partner"}</span>
          </div>
        </div>
        <div className="mt-3 relative h-60 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50/30">
          {WorldGlobe ? (
            <WorldGlobe
              layers={{ active: true, partners: true, arcs: true }}
              onHover={() => {}}
              onSelect={() => {}}
              selected={null}
              timeYear={2026}
              showTerminator={false}
              compact={true}
              theme="light"
              borders
              capitals
              ariaLabel={t.a11y.globeCompact}
            />
          ) : (
            <div className="grid place-items-center h-full text-slate-400 text-[12px]">Loading globe…</div>
          )}
          {/* Caption */}
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono bg-white/70 backdrop-blur px-2 py-0.5 rounded ring-1 ring-slate-900/[.05]">
            {lang === "tr" ? "43 şehir · 3 kıta" : "43 cities · 3 continents"}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5 rounded-2xl bg-white border border-slate-900/[.05] p-5">
        <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{lang === "tr" ? "Donanım sağlığı" : "Fleet health"}</div>
        <div className="mt-3 space-y-3">
          {[
            { label: lang === "tr" ? "Firmware uptime"     : "Firmware uptime",     val: 99.4, color: "#10B981" },
            { label: lang === "tr" ? "Ort. pil"            : "Avg battery",         val: 64,   color: "#0EA5E9" },
            { label: lang === "tr" ? "Sync güvenilirliği"  : "Sync reliability",    val: 97.1, color: "#10B981" },
            { label: lang === "tr" ? "Güneş katkısı"       : "Solar contribution",  val: 38,   color: "#F59E0B" },
          ].map((it, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-[11.5px] mb-1">
                <span className="text-slate-700">{it.label}</span>
                <span className="font-mono text-slate-900">{it.val}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${it.val}%`, background: it.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Insights view ──────────────────────────────────────────────────────────
function DashInsights({ lang }) {
  const insights = lang === "tr" ? [
    { tag: "Ulaşım",   title: "Çarşamba pikinizi düşürün", body: "Hafta içi video toplantılarınızı sesli moda alırsan haftalık 1.4 kg CO₂ tasarrufu sağlarsın.", save: "1.4 kg / hf", confidence: 92, color: "#0EA5E9" },
    { tag: "Enerji",   title: "Klimayı 2°C arttır",        body: "Öğleden sonra ofiste yüksek yük görülüyor. 2°C artış kişi başı 38 kg/ay tasarrufa denk.", save: "38 kg / ay",  confidence: 88, color: "#10B981" },
    { tag: "Beslenme", title: "Salı öğlen yerel ye",       body: "Son 3 hafta salı öğlenleri alışkanlık haline geldi. Yerel ürün seçimi 0.6 kg/hafta tasarruf sağlıyor.", save: "0.6 kg / hf", confidence: 76, color: "#7C3AED" },
    { tag: "Dijital",  title: "Streaming kalitesi",        body: "4K → 1080p geçişi servis başına ayda 1.2 kg CO₂ tasarrufu sağlıyor.", save: "1.2 kg / ay", confidence: 81, color: "#F59E0B" },
  ] : [
    { tag: "Transport", title: "Flatten your Wednesday spike", body: "Switching mid-week video calls to audio-only saves 1.4 kg CO₂ weekly.", save: "1.4 kg / wk", confidence: 92, color: "#0EA5E9" },
    { tag: "Energy",    title: "Raise AC by 2°C",              body: "Afternoon load is heavy in the office. A 2°C nudge equates to 38 kg/mo per person.", save: "38 kg / mo", confidence: 88, color: "#10B981" },
    { tag: "Diet",      title: "Tuesday lunch — go local",     body: "Last 3 weeks show a Tuesday lunch pattern. Local sourcing saves 0.6 kg weekly.", save: "0.6 kg / wk", confidence: 76, color: "#7C3AED" },
    { tag: "Digital",   title: "Streaming quality",            body: "Stepping 4K → 1080p saves 1.2 kg CO₂ monthly per service.", save: "1.2 kg / mo", confidence: 81, color: "#F59E0B" },
  ];

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 rounded-2xl bg-white border border-slate-900/[.05] p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[.14em] text-slate-500 font-semibold">{lang === "tr" ? "30 günlük trend" : "30-day trend"}</div>
            <div className="mt-1 font-display text-[20px] tracking-tight text-slate-900">{lang === "tr" ? "AI tahminine karşı gerçekleşen" : "AI forecast vs. actual"}</div>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full bg-cyan-500" />{lang === "tr" ? "Tahmin" : "Forecast"}</span>
            <span className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-500" />{lang === "tr" ? "Gerçekleşen" : "Actual"}</span>
          </div>
        </div>
        <TrendChart />
      </div>

      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((ins, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-white border border-slate-900/[.05] p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1" style={{ color: ins.color, backgroundColor: `${ins.color}14`, borderColor: `${ins.color}30` }}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ins.color }} />
                {ins.tag}
              </span>
              <span className="text-[10.5px] text-slate-500 font-mono">{ins.confidence}% conf.</span>
            </div>
            <h4 className="mt-3 font-display text-[17px] tracking-tight text-slate-900 leading-snug">{ins.title}</h4>
            <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed">{ins.body}</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 font-semibold">{lang === "tr" ? "Tahmini tasarruf" : "Est. saving"}</div>
                <div className="font-display text-[18px] tracking-tight" style={{ color: ins.color }}>{ins.save}</div>
              </div>
              <button className="rounded-full bg-slate-900 text-white text-[11.5px] font-medium px-3 py-1.5 hover:bg-slate-800">{lang === "tr" ? "Uygula" : "Apply"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart() {
  const N = 30;
  const forecast = Array.from({ length: N }, (_, i) => 12 - i * 0.15 + Math.sin(i * 0.6) * 0.8);
  const actual = forecast.map((v, i) => v - 0.6 - Math.sin(i * 0.4 + 1) * 0.5 - (i / N) * 0.4);
  const W = 600, H = 140;
  const max = Math.max(...forecast, ...actual) * 1.1;
  const min = Math.min(...forecast, ...actual) * 0.9;
  const span = max - min;
  const xy = (arr) => arr.map((v, i) => `${(i / (N - 1)) * W},${H - ((v - min) / span) * H}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-4 w-full h-44">
      <defs>
        <linearGradient id="trend-fc" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0EA5E9" stopOpacity=".22" />
          <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trend-ac" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#10B981" stopOpacity=".3" />
          <stop offset="1" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1="0" y1={H * p} x2={W} y2={H * p} stroke="#F1F5F9" strokeWidth=".6" />
      ))}
      <polyline points={`0,${H} ${xy(forecast)} ${W},${H}`} fill="url(#trend-fc)" />
      <polyline points={xy(forecast)} fill="none" stroke="#0EA5E9" strokeWidth="1.6" strokeDasharray="3 4" />
      <polyline points={`0,${H} ${xy(actual)} ${W},${H}`} fill="url(#trend-ac)" />
      <polyline points={xy(actual)} fill="none" stroke="#10B981" strokeWidth="2" />
    </svg>
  );
}

// ── chart primitives ───────────────────────────────────────────────────────
function RadialGauge({ pct }) {
  const R = 38, C = 2 * Math.PI * R;
  const off = C - (pct / 100) * C;
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
      <circle cx="50" cy="50" r={R} fill="none" stroke="#F1F5F9" strokeWidth="10" />
      <defs>
        <linearGradient id="gauge" x1="0" x2="1">
          <stop offset="0" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <circle
        cx="50" cy="50" r={R} fill="none" stroke="url(#gauge)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }}
      />
      <text x="50" y="56" textAnchor="middle" transform="rotate(90 50 50)" fontSize="18" fontWeight="700" fill="#0F172A" fontFamily="ui-sans-serif">{pct}%</text>
    </svg>
  );
}

function WeeklyBars({ data, target, days, hover, setHover }) {
  const max = Math.max(...data, target) * 1.15;
  const w = 100 / data.length;
  return (
    <div className="mt-4 relative h-44">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {/* horizontal grid */}
        {[25, 50, 75].map(y => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#F1F5F9" strokeWidth=".4" />)}
        {/* target line */}
        <line x1="0" x2="100" y1={100 - (target / max) * 100} y2={100 - (target / max) * 100} stroke="#10B981" strokeWidth=".6" strokeDasharray="2 2" />
        {data.map((v, i) => {
          const bh = (v / max) * 100;
          const isOver = v > target;
          const isHov = hover === i;
          return (
            <g key={i}>
              <rect
                x={i * w + w * 0.18} y={100 - bh}
                width={w * 0.64} height={bh}
                rx=".8"
                fill={isOver ? "#0EA5E9" : "#0EA5E9"}
                opacity={isHov ? 1 : 0.85}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                style={{ transition: "opacity .2s" }}
              />
              {isOver && (
                <rect x={i * w + w * 0.18} y={100 - bh} width={w * 0.64} height={bh - (target / max) * 100} rx=".8" fill="#F59E0B" opacity={isHov ? 1 : 0.85} />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-x-0 -bottom-5 flex justify-around text-[10.5px] text-slate-500 font-mono">
        {days.map((d, i) => <span key={i} className={hover === i ? "text-slate-900 font-semibold" : ""}>{d}</span>)}
      </div>
      {hover !== null && (
        <div className="absolute -top-2 left-0 right-0 flex justify-around pointer-events-none">
          <div className="px-2 py-1 rounded-md bg-slate-900 text-white text-[10.5px] font-mono shadow-lg" style={{ marginLeft: `${(hover / data.length) * 100}%`, transform: "translateX(-50%)" }}>
            {data[hover]} kg
          </div>
        </div>
      )}
    </div>
  );
}

function Donut({ values, hover, setHover }) {
  const total = values.reduce((a, b) => a + b, 0);
  const colors = ["#0EA5E9", "#10B981", "#7C3AED", "#F59E0B"];
  const R = 40, r = 26;
  // Cumulative start for each slice, computed without mutating across the
  // render boundary (values is tiny, so the O(n²) slice is fine).
  const starts = values.map((_, i) => values.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28">
      {values.map((v, i) => {
        const cum = starts[i];
        const a0 = (cum / total) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((cum + v) / total) * Math.PI * 2 - Math.PI / 2;
        const large = v / total > 0.5 ? 1 : 0;
        const x0 = 50 + R * Math.cos(a0), y0 = 50 + R * Math.sin(a0);
        const x1 = 50 + R * Math.cos(a1), y1 = 50 + R * Math.sin(a1);
        const xi0 = 50 + r * Math.cos(a0), yi0 = 50 + r * Math.sin(a0);
        const xi1 = 50 + r * Math.cos(a1), yi1 = 50 + r * Math.sin(a1);
        const isHov = hover === i;
        return (
          <path
            key={i}
            d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi0} ${yi0} Z`}
            fill={colors[i]}
            opacity={hover === null || isHov ? 1 : .35}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ transition: "opacity .2s", transform: isHov ? "scale(1.04)" : "scale(1)", transformOrigin: "50px 50px" }}
          />
        );
      })}
      <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
        {hover === null ? `${total}%` : `${values[hover]}%`}
      </text>
      <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#64748B" letterSpacing="1">SHARE</text>
    </svg>
  );
}

function Sparkline({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 30;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / Math.max(max - min, 0.0001)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-20 flex-none">
      <defs>
        <linearGradient id={`sp-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sp-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / Math.max(max - min, 0.0001)) * h} r="2" fill={color} />
    </svg>
  );
}

function SidebarIcon({ name }) {
  const paths = {
    home: <path d="M3 9 10 3l7 6v8a1 1 0 0 1-1 1h-3v-6h-6v6H4a1 1 0 0 1-1-1V9Z" />,
    spark: <path d="M10 3v4m0 6v4M3 10h4m6 0h4M5.5 5.5l3 3m3 3 3 3M5.5 14.5l3-3m3-3 3-3" />,
    device: <><rect x="6" y="3" width="8" height="14" rx="2" /><path d="M9 14h2" /></>,
    chart: <path d="M3 17h14M5 14l3-4 3 2 4-6" />,
    people: <><circle cx="7" cy="8" r="3" /><circle cx="14" cy="9" r="2.4" /><path d="M2 17c.4-2.8 2.5-4 5-4s4.6 1.2 5 4M12 17c.3-2 1.7-2.7 3-2.7s2.5.7 3 2.7" /></>,
    report: <><rect x="4" y="3" width="12" height="14" rx="2" /><path d="M7 7h6M7 10h6M7 13h4" /></>,
  };
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {paths[name]}
    </svg>
  );
}


export { DashboardPreview };
