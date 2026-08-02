import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES, SITE } from '@/core/config/site';
import { Hero } from '@/features/hero';
import { Metrics } from '@/features/metrics';
import { Testimonials } from '@/features/testimonials';
import { TrustBand, FeaturedCase, CtaBand } from '@/features/home-extras';

import { DashboardPreview } from '@/features/home-extras/DashboardPreview';
import { TechMarquee } from '@/features/home-extras/TechMarquee';
import { FeatureBento } from '@/features/home-extras/FeatureBento';
import { DeveloperPreview } from '@/features/home-extras/DeveloperPreview';

const meta = ROUTES.find((r) => r.key === 'home');

export default function HomePage() {
  const { t, lang } = useApp();
  useDocumentMeta(meta.title[lang], SITE.description);
  
  return (
    <>
      <Hero />
      <DashboardPreview />
      <TechMarquee />
      <FeatureBento />
      <TrustBand />
      <DeveloperPreview />
      <Metrics />
      <FeaturedCase />
      <Testimonials />
      <CtaBand />
    </>
  );
}
