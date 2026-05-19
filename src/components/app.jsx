import React, { useState, useEffect, useMemo } from 'react';
import { ECO_I18N } from './i18n';
import { Navbar, Hero, Metrics } from './sections-a';
import { TechEcosystem } from './sections-b';
import { DashboardPreview } from './sections-c';
import { AboutBento, Contact, Footer } from './sections-d';
import { HowItWorks, UseCases } from './sections-e';
import { ImpactMap } from './sections-f';
import { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakSelect, TweakColor } from './tweaks-panel';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "tr",
  "theme": "light",
  "heroStyle": "globe",
  "glowIntensity": 1,
  "displayFont": "Space Grotesk",
  "bodyFont": "Inter",
  "bgTint": "slate",
  "accentMix": "cyan-emerald"
}/*EDITMODE-END*/;

const FONT_OPTIONS_DISPLAY = ["Space Grotesk", "Syne", "Sora", "DM Sans"];
const FONT_OPTIONS_BODY = ["Inter", "Plus Jakarta Sans", "DM Sans", "Manrope"];

const BG_TINTS = {
  light: {
    slate: "#F8FAFC",
    mint:  "#F4F7F6",
    cream: "#F8F6F2",
    sky:   "#F4F8FC",
  },
  dark: {
    slate: "#0B1220",
    mint:  "#0B1410",
    cream: "#13110D",
    sky:   "#0A101C",
  },
};

const ACCENT_PALETTES = {
  "cyan-emerald": { cyan: "#0EA5E9", emerald: "#10B981" },
  "blue-violet":  { cyan: "#2563EB", emerald: "#7C3AED" },
  "teal-lime":    { cyan: "#0D9488", emerald: "#65A30D" },
  "sky-rose":     { cyan: "#0284C7", emerald: "#E11D48" },
};

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sc = document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      setP(max > 0 ? (sc.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[70] h-[2.5px] pointer-events-none">
      <div
        className="h-full origin-left"
        style={{
          width: `${p}%`,
          background: "linear-gradient(90deg, var(--ec-cyan, #0EA5E9) 0%, var(--ec-emerald, #10B981) 100%)",
          boxShadow: "0 0 12px rgba(14,165,233,.6)",
          transition: "width .08s linear",
        }}
      />
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = t.lang;
  const setLang = (v) => setTweak("lang", v);
  const setTheme = (v) => setTweak("theme", v);

  const dict = ECO_I18N[lang];
  const accents = ACCENT_PALETTES[t.accentMix] || ACCENT_PALETTES["cyan-emerald"];
  const isDark = t.theme === "dark";
  const bgColor = (BG_TINTS[t.theme] || BG_TINTS.light)[t.bgTint] || BG_TINTS.light.slate;

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark"); else html.classList.remove("dark");
    html.style.setProperty("--bg", bgColor);
    html.style.setProperty("--font-display", `"${t.displayFont}", ui-sans-serif, system-ui, sans-serif`);
    html.style.setProperty("--font-body", `"${t.bodyFont}", ui-sans-serif, system-ui, sans-serif`);
    html.style.setProperty("--ec-cyan", accents.cyan);
    html.style.setProperty("--ec-emerald", accents.emerald);
  }, [isDark, bgColor, t.displayFont, t.bodyFont, accents.cyan, accents.emerald]);

  useEffect(() => {
    if (window.__ecoGreeted) return;
    window.__ecoGreeted = true;
    const css1 = "background:linear-gradient(120deg,#0EA5E9,#10B981);color:white;padding:4px 10px;border-radius:99px;font-weight:600;";
    const css2 = "color:#0F172A;font-weight:600";
    const css3 = "color:#64748B;";
    console.log("%cEcozyon Tech%c\n\n   .-~~-.\n  /  o o \\   towards a smarter,\n  \\  ‿‿  /   cleaner future.\n   '-..-'\n\n%c→ hello@ecozyon.tech · We're hiring engineers.", css1, css2, css3);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 font-body transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <ScrollProgress />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[.18] mix-blend-multiply"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.45'/></svg>\")" }} />
      <div className="relative z-10">
        <Navbar
          t={dict} lang={lang} setLang={setLang}
          theme={t.theme} setTheme={setTheme}
          primary={t.accentMix.startsWith("cyan") ? "emerald" : "cyan"}
        />
        <main>
          <Hero
            t={dict} lang={lang}
            glowIntensity={t.glowIntensity}
            heroStyle={t.heroStyle}
            accents={accents}
            theme={t.theme}
          />
          <Metrics t={dict} />
          <ImpactMap t={dict} lang={lang} />
          <HowItWorks t={dict} lang={lang} />
          <TechEcosystem t={dict} />
          <UseCases t={dict} lang={lang} />
          <DashboardPreview t={dict} lang={lang} />
          <AboutBento t={dict} lang={lang} />
          <Contact t={dict} lang={lang} />
        </main>
        <Footer t={dict} lang={lang} />
      </div>

      <TweaksPanel>
        <TweakSection label={lang === "tr" ? "Genel" : "General"} />
        <TweakRadio
          label={lang === "tr" ? "Dil" : "Language"}
          value={lang}
          options={["tr", "en"]}
          onChange={(v) => setLang(v)}
        />
        <TweakRadio
          label={lang === "tr" ? "Tema" : "Theme"}
          value={t.theme}
          options={["light", "dark"]}
          onChange={(v) => setTheme(v)}
        />
        <TweakSection label={lang === "tr" ? "Hero" : "Hero"} />
        <TweakRadio
          label={lang === "tr" ? "Hero stili" : "Hero style"}
          value={t.heroStyle}
          options={["globe", "particles", "grid"]}
          onChange={(v) => setTweak("heroStyle", v)}
        />
        <TweakSlider
          label={lang === "tr" ? "Glow yoğunluğu" : "Glow intensity"}
          value={t.glowIntensity}
          min={0} max={2} step={0.1}
          onChange={(v) => setTweak("glowIntensity", v)}
        />
        <TweakSection label={lang === "tr" ? "Renk" : "Color"} />
        <TweakColor
          label={lang === "tr" ? "Aksan paleti" : "Accent palette"}
          value={[accents.cyan, accents.emerald]}
          options={[
            ["#0EA5E9", "#10B981"],
            ["#2563EB", "#7C3AED"],
            ["#0D9488", "#65A30D"],
            ["#0284C7", "#E11D48"],
          ]}
          onChange={(arr) => {
            const key = Object.entries(ACCENT_PALETTES).find(([_, v]) => v.cyan === arr[0])?.[0] || "cyan-emerald";
            setTweak("accentMix", key);
          }}
        />
        <TweakColor
          label={lang === "tr" ? "Arka plan tonu" : "Background tint"}
          value={bgColor}
          options={Object.values(BG_TINTS[t.theme] || BG_TINTS.light)}
          onChange={(v) => {
            const map = BG_TINTS[t.theme] || BG_TINTS.light;
            const key = Object.entries(map).find(([_, val]) => val === v)?.[0] || "slate";
            setTweak("bgTint", key);
          }}
        />
        <TweakSection label={lang === "tr" ? "Tipografi" : "Typography"} />
        <TweakSelect
          label={lang === "tr" ? "Başlık fontu" : "Display font"}
          value={t.displayFont}
          options={FONT_OPTIONS_DISPLAY}
          onChange={(v) => setTweak("displayFont", v)}
        />
        <TweakSelect
          label={lang === "tr" ? "Gövde fontu" : "Body font"}
          value={t.bodyFont}
          options={FONT_OPTIONS_BODY}
          onChange={(v) => setTweak("bodyFont", v)}
        />
      </TweaksPanel>
    </div>
  );
}

export default App;
