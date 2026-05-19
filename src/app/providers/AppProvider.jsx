import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ECO_I18N } from '@/core/i18n/dictionary';

// ── Design tokens (moved out of the old monolithic app.jsx) ─────────────────
const DEFAULTS = {
  lang: 'tr',
  theme: 'light',
  heroStyle: 'globe',
  glowIntensity: 1,
  displayFont: 'Space Grotesk',
  bodyFont: 'Inter',
  bgTint: 'slate',
  accentMix: 'cyan-emerald',
};

export const FONT_OPTIONS_DISPLAY = ['Space Grotesk', 'Syne', 'Sora', 'DM Sans'];
export const FONT_OPTIONS_BODY = ['Inter', 'Plus Jakarta Sans', 'DM Sans', 'Manrope'];

export const BG_TINTS = {
  light: { slate: '#F8FAFC', mint: '#F4F7F6', cream: '#F8F6F2', sky: '#F4F8FC' },
  dark: { slate: '#0B1220', mint: '#0B1410', cream: '#13110D', sky: '#0A101C' },
};

export const ACCENT_PALETTES = {
  'cyan-emerald': { cyan: '#0EA5E9', emerald: '#10B981' },
  'blue-violet': { cyan: '#2563EB', emerald: '#7C3AED' },
  'teal-lime': { cyan: '#0D9488', emerald: '#65A30D' },
  'sky-rose': { cyan: '#0284C7', emerald: '#E11D48' },
};

const STORAGE_KEY = 'ecozyon.prefs';

function loadPrefs() {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs);

  const setTweak = useCallback((keyOrEdits, val) => {
    const edits =
      typeof keyOrEdits === 'object' && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val };
    setPrefs((prev) => {
      const next = { ...prev, ...edits };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — keep in-memory only */
      }
      return next;
    });
  }, []);

  const lang = prefs.lang;
  const dict = ECO_I18N[lang] || ECO_I18N.tr;
  const accents = ACCENT_PALETTES[prefs.accentMix] || ACCENT_PALETTES['cyan-emerald'];
  const isDark = prefs.theme === 'dark';
  const bgColor =
    (BG_TINTS[prefs.theme] || BG_TINTS.light)[prefs.bgTint] || BG_TINTS.light.slate;

  // Apply theme + typography + accent CSS variables to <html>.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
    html.setAttribute('lang', lang);
    html.style.setProperty('--bg', bgColor);
    html.style.setProperty('--font-display', `"${prefs.displayFont}", ui-sans-serif, system-ui, sans-serif`);
    html.style.setProperty('--font-body', `"${prefs.bodyFont}", ui-sans-serif, system-ui, sans-serif`);
    html.style.setProperty('--ec-cyan', accents.cyan);
    html.style.setProperty('--ec-emerald', accents.emerald);
  }, [isDark, lang, bgColor, prefs.displayFont, prefs.bodyFont, accents.cyan, accents.emerald]);

  const value = useMemo(
    () => ({
      prefs,
      setTweak,
      lang,
      setLang: (v) => setTweak('lang', v),
      theme: prefs.theme,
      setTheme: (v) => setTweak('theme', v),
      dict,
      t: dict,
      accents,
      isDark,
      bgColor,
    }),
    [prefs, setTweak, lang, dict, accents, isDark, bgColor],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}

// Convenience: just the active-language dictionary.
export function useI18n() {
  return useApp().dict;
}
