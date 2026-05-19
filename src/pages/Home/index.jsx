import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES, SITE } from '@/core/config/site';
import { Hero } from '@/features/hero';
import { Metrics } from '@/features/metrics';

const meta = ROUTES.find((r) => r.key === 'home');

export default function HomePage() {
  const { t, lang, prefs, accents } = useApp();
  useDocumentMeta(meta.title[lang], SITE.description);
  return (
    <>
      <Hero
        t={t}
        lang={lang}
        glowIntensity={prefs.glowIntensity}
        heroStyle={prefs.heroStyle}
        accents={accents}
        theme={prefs.theme}
      />
      <Metrics t={t} />
    </>
  );
}
