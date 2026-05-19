// Development-only design tweak panel. Mounted by MainLayout behind
// import.meta.env.DEV so it never ships to production.
import {
  TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakSelect, TweakColor,
} from './index.jsx';
import {
  useApp, FONT_OPTIONS_DISPLAY, FONT_OPTIONS_BODY, BG_TINTS, ACCENT_PALETTES,
} from '@/app/providers/AppProvider';

export function DevTweaks() {
  const { prefs, setTweak, lang, accents, bgColor } = useApp();

  return (
    <TweaksPanel>
      <TweakSection label={lang === 'tr' ? 'Genel' : 'General'} />
      <TweakRadio
        label={lang === 'tr' ? 'Dil' : 'Language'}
        value={lang}
        options={['tr', 'en']}
        onChange={(v) => setTweak('lang', v)}
      />
      <TweakRadio
        label={lang === 'tr' ? 'Tema' : 'Theme'}
        value={prefs.theme}
        options={['light', 'dark']}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakSection label="Hero" />
      <TweakRadio
        label={lang === 'tr' ? 'Hero stili' : 'Hero style'}
        value={prefs.heroStyle}
        options={['globe', 'particles', 'grid']}
        onChange={(v) => setTweak('heroStyle', v)}
      />
      <TweakSlider
        label={lang === 'tr' ? 'Glow yoğunluğu' : 'Glow intensity'}
        value={prefs.glowIntensity}
        min={0} max={2} step={0.1}
        onChange={(v) => setTweak('glowIntensity', v)}
      />
      <TweakSection label={lang === 'tr' ? 'Renk' : 'Color'} />
      <TweakColor
        label={lang === 'tr' ? 'Aksan paleti' : 'Accent palette'}
        value={[accents.cyan, accents.emerald]}
        options={[
          ['#0EA5E9', '#10B981'],
          ['#2563EB', '#7C3AED'],
          ['#0D9488', '#65A30D'],
          ['#0284C7', '#E11D48'],
        ]}
        onChange={(arr) => {
          const key =
            Object.entries(ACCENT_PALETTES).find(([, v]) => v.cyan === arr[0])?.[0] ||
            'cyan-emerald';
          setTweak('accentMix', key);
        }}
      />
      <TweakColor
        label={lang === 'tr' ? 'Arka plan tonu' : 'Background tint'}
        value={bgColor}
        options={Object.values(BG_TINTS[prefs.theme] || BG_TINTS.light)}
        onChange={(v) => {
          const map = BG_TINTS[prefs.theme] || BG_TINTS.light;
          const key = Object.entries(map).find(([, val]) => val === v)?.[0] || 'slate';
          setTweak('bgTint', key);
        }}
      />
      <TweakSection label={lang === 'tr' ? 'Tipografi' : 'Typography'} />
      <TweakSelect
        label={lang === 'tr' ? 'Başlık fontu' : 'Display font'}
        value={prefs.displayFont}
        options={FONT_OPTIONS_DISPLAY}
        onChange={(v) => setTweak('displayFont', v)}
      />
      <TweakSelect
        label={lang === 'tr' ? 'Gövde fontu' : 'Body font'}
        value={prefs.bodyFont}
        options={FONT_OPTIONS_BODY}
        onChange={(v) => setTweak('bodyFont', v)}
      />
    </TweaksPanel>
  );
}
