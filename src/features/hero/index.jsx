import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, GlowOrb } from '@/shared/ui/primitives';
import { EcoGlobe } from '@/shared/3d/LazyGlobes';
import { Modal } from '@/shared/ui/Modal';
import { HeroParticles, HeroDataGrid } from './HeroVariants';

// ── Hero ───────────────────────────────────────────────────────────────────
export function Hero({ t, lang, glowIntensity = 1, heroStyle = "globe", accents, theme }) {
  const [liveIdx, setLiveIdx] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLiveIdx((i) => (i + 1) % t.hero.liveItems.length), 4200);
    return () => clearInterval(id);
  }, [t.hero.liveItems.length]);

  return (
    <section id="top" className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <GlowOrb className="-top-32 -left-24" color={`rgba(14,165,233,${0.18 * glowIntensity})`} size={620} />
        <GlowOrb className="top-40 -right-40" color={`rgba(16,185,129,${0.18 * glowIntensity})`} size={680} />
        <GlowOrb className="bottom-0 left-1/3" color={`rgba(37,99,235,${0.10 * glowIntensity})`} size={420} />
        <div
          className="absolute inset-0 opacity-[.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
          {/* LEFT: copy */}
          <div className="relative">
            <Tag color="emerald">{t.hero.tag}</Tag>

            <h1 className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1.02] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
              <span className="block">{t.hero.title1}</span>
              <span className="block">
                <span className="eco-gradient-text">
                  {t.hero.title2}
                </span>
              </span>
              <span className="block text-slate-900/90 dark:text-slate-100/90">{t.hero.title3}</span>
            </h1>

            <p className="mt-6 max-w-xl text-[15.5px] leading-[1.65] text-slate-600 dark:text-slate-400">
              {t.hero.sub}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white shadow-[0_10px_30px_-12px_rgba(14,165,233,.6)] hover:scale-[1.02] active:scale-[0.99] transition"
                style={{ backgroundImage: "linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)" }}
              >
                {t.hero.primary}
                <ArrowRight />
              </Link>
              <button onClick={() => setVideoOpen(true)} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-white/[.06] backdrop-blur-md border border-white/70 dark:border-white/[.1] ring-1 ring-slate-900/[.06] dark:ring-white/[.06] hover:bg-white dark:hover:bg-white/[.1] transition">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                  <svg className="h-2.5 w-2.5 translate-x-[.5px]" viewBox="0 0 8 8" fill="currentColor"><path d="M1 0v8l7-4z" /></svg>
                </span>
                {t.hero.secondary}
              </button>
            </div>

            {/* Live AI suggestion */}
            <div className="mt-10 max-w-md rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/60 dark:bg-white/[.04] backdrop-blur-xl p-3.5 pr-4 ring-1 ring-slate-900/[.04] dark:ring-white/[.06] shadow-[0_18px_60px_-30px_rgba(15,23,42,.25)]">
              <div className="flex items-center gap-3">
                <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-inner">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" /></svg>
                  <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[10.5px] uppercase tracking-[.12em] text-slate-500 font-semibold">{t.hero.live}</div>
                    <div className="text-[10px] text-emerald-700 font-mono">●  LIVE</div>
                  </div>
                  <div className="mt-1 text-[13px] text-slate-800 dark:text-slate-200 leading-snug min-h-[2.6em]">
                    <Typewriter key={liveIdx} text={t.hero.liveItems[liveIdx]} />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {t.hero.liveItems.map((_, i) => (
                  <span key={i} className={`h-[3px] flex-1 rounded-full transition-all ${i === liveIdx ? "bg-emerald-500" : "bg-slate-900/10"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: 3D globe */}
          <div className="relative">
            <div className="relative aspect-square w-full max-w-[560px] mx-auto lg:ml-auto lg:mr-0 min-h-[280px]">
              {/* Halo behind */}
              <div className="absolute inset-6 rounded-full blur-3xl opacity-60"
                style={{ background: "conic-gradient(from 90deg, rgba(14,165,233,.25), rgba(16,185,129,.22), rgba(14,165,233,.25))" }} />
              <div className="absolute inset-0">
                {heroStyle === "particles" && <HeroParticles cyan={accents?.cyan} emerald={accents?.emerald} dark={theme === "dark"} />}
                {heroStyle === "grid" && <HeroDataGrid cyan={accents?.cyan} emerald={accents?.emerald} />}
                {(heroStyle === "globe" || !heroStyle) && <EcoGlobe cyan={accents?.cyan} emerald={accents?.emerald} />}
              </div>

              {/* Floating annotation chips */}
              <FloatChip className="top-[14%] right-[6%]" delay="0s" color="cyan">
                <div className="text-[10px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">AI node</div>
                <div className="text-[12px] text-slate-800 dark:text-slate-200">İstanbul · 0.4W</div>
              </FloatChip>
              <FloatChip className="bottom-[18%] left-[2%]" delay=".8s" color="emerald">
                <div className="text-[10px] uppercase tracking-[.12em] text-emerald-700 dark:text-emerald-400 font-semibold">CO₂ saved</div>
                <div className="text-[12px] text-slate-800 dark:text-slate-200">+38 kg / hr</div>
              </FloatChip>
              <FloatChip className="bottom-[6%] right-[10%]" delay="1.6s" color="slate">
                <div className="text-[10px] uppercase tracking-[.12em] text-slate-500 dark:text-slate-400 font-semibold">Wearables</div>
                <div className="text-[12px] text-slate-800 dark:text-slate-200">8,431 online</div>
              </FloatChip>
            </div>
          </div>
        </div>

        {/* Real partner strip */}
        <div className="mt-16 lg:mt-24 relative">
          <div className="text-[11px] uppercase tracking-[.18em] text-slate-500 font-semibold mb-4 text-center">
            {t.hero.partnersTag || (lang === "tr" ? "Pilot ortakları & destek" : "Pilot partners & backers")}
          </div>
          <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
            <div className="flex items-center gap-10 lg:gap-14 animate-[marquee_42s_linear_infinite] whitespace-nowrap py-2">
              {(t.hero.partners || []).concat(t.hero.partners || []).map((p, i) => (
                <PartnerLogo key={i} name={p} idx={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video modal */}
      {videoOpen && <VideoModal t={t} lang={lang} onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

function FloatChip({ className, delay, color, children }) {
  const ring = color === "cyan" ? "ring-cyan-500/20" : color === "emerald" ? "ring-emerald-500/20" : "ring-slate-900/10";
  return (
    <div
      className={`absolute ${className} rounded-2xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] backdrop-blur-xl px-3 py-2 ring-1 ${ring} shadow-[0_10px_30px_-15px_rgba(15,23,42,.3)] animate-[float_6s_ease-in-out_infinite]`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

// ── PartnerLogo (mini lockup with placeholder mark + name) ─────────────────
function PartnerLogo({ name, idx }) {
  const shapes = ["circle", "square", "tri", "ring", "wave"];
  const colors = ["#0EA5E9", "#10B981", "#7C3AED", "#F59E0B", "#0F172A", "#E11D48"];
  const sh = shapes[idx % shapes.length];
  const c = colors[idx % colors.length];
  return (
    <div className="flex items-center gap-2.5 text-slate-500 hover:text-slate-800 transition opacity-90 hover:opacity-100">
      <svg viewBox="0 0 28 28" className="h-5 w-5 flex-none" fill="none">
        {sh === "circle" && <><circle cx="14" cy="14" r="9" fill={c} opacity=".18" /><circle cx="14" cy="14" r="5.5" fill={c} /></>}
        {sh === "square" && <><rect x="6" y="6" width="16" height="16" rx="4" fill={c} opacity=".18" /><rect x="9" y="9" width="10" height="10" rx="2" fill={c} /></>}
        {sh === "tri" && <><path d="M14 4 L24 22 L4 22 Z" fill={c} opacity=".18" /><path d="M14 9 L20 21 L8 21 Z" fill={c} /></>}
        {sh === "ring" && <><circle cx="14" cy="14" r="9" fill="none" stroke={c} strokeWidth="2.4" /><circle cx="14" cy="14" r="3" fill={c} /></>}
        {sh === "wave" && <><path d="M4 14 Q9 6 14 14 T24 14" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" /><circle cx="24" cy="14" r="2.4" fill={c} /></>}
      </svg>
      <span className="text-[14.5px] font-display tracking-tight">{name}</span>
    </div>
  );
}

// ── Typewriter (live AI suggestion text) ───────────────────────────────────
// Mount with a fresh `key` per message so each instance only types out
// its own `text` once — keeps the effect dependency-clean and matches
// the parent's existing `key={liveIdx}` rotation.
function Typewriter({ text, charMs = 26 }) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduceMotion ? text.length : 0);

  useEffect(() => {
    if (reduceMotion) return;
    let i = 0;
    let last = performance.now();
    let raf;
    const step = (now) => {
      if (now - last >= charMs) {
        i = Math.min(text.length, i + 1);
        setShown(i);
        last = now;
      }
      if (i < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [text, charMs, reduceMotion]);

  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && (
        <span className="inline-block w-[5px] h-[1em] bg-emerald-500/80 ml-[1px] align-text-bottom animate-pulse" aria-hidden />
      )}
    </>
  );
}

// ── VideoModal (placeholder for vision film) ───────────────────────────────
function VideoModal({ t, lang, onClose }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const titleId = "video-modal-title";
  const descId = "video-modal-desc";

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + (100 / 60 / 10))), 100);
    return () => clearInterval(id);
  }, [playing]);

  // Three scenes that cross-fade as the timeline advances
  const scene = progress < 33 ? 0 : progress < 66 ? 1 : 2;
  const sceneLabels = lang === "tr"
    ? ["Cihazı kur", "AI öğrenir", "Eyleme dök"]
    : ["Pair device", "AI learns", "Take action"];

  return (
    <Modal
      onClose={onClose}
      z="z-[80]"
      overlayClassName="grid place-items-center p-4 lg:p-8"
      backdropClassName="bg-slate-900/60 backdrop-blur-md"
      labelledBy={titleId}
      describedBy={descId}
      className="relative w-full max-w-4xl rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden animate-[fadeUp_.3s_ease]"
    >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-900/[.06]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-emerald-700">{lang === "tr" ? "Tanıtım" : "Intro"}</div>
            <h3 id={titleId} className="mt-1 font-display text-[22px] tracking-tight text-slate-900">{t.hero.videoTitle}</h3>
            <p id={descId} className="text-[12.5px] text-slate-500 mt-0.5">{t.hero.videoSub}</p>
          </div>
          <button onClick={onClose} aria-label={lang === "tr" ? "Kapat" : "Close"} className="h-8 w-8 rounded-full grid place-items-center text-slate-600 hover:bg-slate-900/[.05]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Video stage */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 aspect-video overflow-hidden">
          {/* Background ambient */}
          <div className="absolute inset-0 opacity-50" style={{
            background: "radial-gradient(circle at 20% 30%, rgba(14,165,233,.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(16,185,129,.3), transparent 40%)"
          }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[.15]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }} />

          {/* Scene 0 - Pair device */}
          <SceneFade visible={scene === 0}>
            <div className="grid place-items-center h-full text-white px-8">
              <div className="text-center">
                <svg viewBox="0 0 240 100" className="w-full max-w-xs mx-auto">
                  <rect x="10" y="40" width="50" height="32" rx="8" fill="#0EA5E9" opacity=".2" />
                  <rect x="10" y="40" width="50" height="32" rx="8" fill="none" stroke="#0EA5E9" strokeWidth="1.4" />
                  <rect x="180" y="20" width="50" height="64" rx="10" fill="#10B981" opacity=".2" />
                  <rect x="180" y="20" width="50" height="64" rx="10" fill="none" stroke="#10B981" strokeWidth="1.4" />
                  {[80, 110, 140, 170].map((x, i) => (
                    <circle key={i} cx={x} cy="56" r="3" fill="#0EA5E9">
                      <animate attributeName="opacity" values="0;1;0" dur="1.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                    </circle>
                  ))}
                  <path d="M195 50 l4 4 8-8" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4 font-display text-[28px] tracking-tight">{sceneLabels[0]}</div>
                <div className="mt-1 text-[13px] text-slate-300">{lang === "tr" ? "2 dakikada eşleştirme" : "Pair in 2 minutes"}</div>
              </div>
            </div>
          </SceneFade>

          {/* Scene 1 - AI learns */}
          <SceneFade visible={scene === 1}>
            <div className="grid place-items-center h-full text-white px-8">
              <div className="text-center">
                <svg viewBox="0 0 260 100" className="w-full max-w-sm mx-auto">
                  {[0, 1, 2, 3].map((layer) =>
                    [0, 1, 2, 3, 4].map((n) => (
                      <circle
                        key={`${layer}-${n}`}
                        cx={40 + layer * 60} cy={15 + n * 18}
                        r="3.5"
                        fill={layer === 0 || layer === 3 ? "#0EA5E9" : "#10B981"}
                      >
                        <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.4 + Math.random()}s`} repeatCount="indefinite" />
                      </circle>
                    ))
                  )}
                  {[0, 1, 2].flatMap((l) =>
                    [0, 1, 2, 3, 4].flatMap((a) =>
                      [0, 1, 2, 3, 4].map((b) => (
                        <line
                          key={`l-${l}-${a}-${b}`}
                          x1={40 + l * 60} y1={15 + a * 18}
                          x2={40 + (l + 1) * 60} y2={15 + b * 18}
                          stroke="#0EA5E9" strokeOpacity={0.06} strokeWidth="0.8"
                        />
                      ))
                    )
                  )}
                </svg>
                <div className="mt-4 font-display text-[28px] tracking-tight">{sceneLabels[1]}</div>
                <div className="mt-1 text-[13px] text-slate-300">{lang === "tr" ? "İlk hafta sonunda kişisel baseline" : "Your baseline in week one"}</div>
              </div>
            </div>
          </SceneFade>

          {/* Scene 2 - Take action */}
          <SceneFade visible={scene === 2}>
            <div className="grid place-items-center h-full text-white px-8">
              <div className="text-center max-w-md">
                <div className="rounded-2xl border border-white/20 bg-slate-800/60 backdrop-blur-md p-5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.6 4.6l2.1 2.1M13.3 13.3l2.1 2.1M4.6 15.4l2.1-2.1M13.3 6.7l2.1-2.1" strokeLinecap="round" /></svg>
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[.14em] text-emerald-300 font-semibold">AI tip</span>
                  </div>
                  <div className="mt-2 text-[14px] text-white">{lang === "tr" ? "Bugün bisikletle gidersen 1.4 kg CO₂ tasarrufu." : "Bike to work today → save 1.4 kg CO₂."}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="rounded-full bg-white text-slate-900 text-[11px] font-semibold px-3 py-1.5">✓ Apply</button>
                    <span className="text-[11px] text-slate-300">{lang === "tr" ? "Anında uygulanır" : "Applied instantly"}</span>
                  </div>
                </div>
                <div className="mt-4 font-display text-[28px] tracking-tight">{sceneLabels[2]}</div>
                <div className="mt-1 text-[13px] text-slate-300">{lang === "tr" ? "Topluluk + AI + sen" : "Community + AI + you"}</div>
              </div>
            </div>
          </SceneFade>

          {/* Center play/pause control */}
          <button
            onClick={() => setPlaying(!playing)}
            className="absolute bottom-4 left-4 h-10 w-10 rounded-full bg-white/90 text-slate-900 grid place-items-center shadow-lg hover:scale-105 transition"
            aria-label={playing ? t.a11y.pause : t.a11y.play}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor"><rect x="4" y="3" width="3" height="10" /><rect x="9" y="3" width="3" height="10" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-4 w-4 translate-x-[1px]" fill="currentColor"><path d="M4 3v10l9-5z" /></svg>
            )}
          </button>

          {/* Timestamp */}
          <div className="absolute bottom-5 left-16 text-white/80 text-[11px] font-mono">
            00:{String(Math.floor(progress * 0.6)).padStart(2, "0")} / 01:00
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Footer scene chips */}
        <div className="flex items-center justify-between p-4 gap-3">
          <div className="flex items-center gap-2">
            {sceneLabels.map((lab, i) => (
              <button
                key={i}
                onClick={() => setProgress(i * 33 + 5)}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-medium border transition ${scene === i ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-900/[.08] hover:bg-slate-50"}`}
              >
                <span className="font-mono text-[10px]">0{i + 1}</span>
                {lab}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-[12px] text-slate-500 hover:text-slate-900">{t.hero.videoClose} <span className="text-[10px] font-mono ml-1">ESC</span></button>
        </div>
    </Modal>
  );
}

function SceneFade({ visible, children }) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {children}
    </div>
  );
}
