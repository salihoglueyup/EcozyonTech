/** @type {import('tailwindcss').Config} */
import { BRAND } from './src/core/tokens.js';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand accents from the single token source (src/core/tokens.js).
        brand: { cyan: BRAND.cyan, emerald: BRAND.emerald },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
      },
      fontFamily: {
        // Driven by CSS vars that AppProvider updates from the tweak panel.
        sans: ['var(--font-body)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', '"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-3px)' },
          '40%, 60%': { transform: 'translateX(3px)' },
        },
        // Stroke-draw for SuccessCheck (path uses pathLength=1, dasharray=1).
        drawCheck: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .5s ease both',
        // Token-driven entrance utilities (durations/easing from index.css
        // :root) — the single source for overlay/menu enter timing.
        enter: 'fadeUp var(--dur-base) var(--ease-out) both',
        'enter-fast': 'fadeUp var(--dur-fast) var(--ease-out) both',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 42s linear infinite',
        shake: 'shake .32s ease',
        drawCheck: 'drawCheck 420ms var(--ease-out) forwards',
      },
    },
  },
  plugins: [],
}
