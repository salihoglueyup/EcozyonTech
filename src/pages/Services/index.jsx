import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { RelatedRoutes } from '@/shared/ui/primitives';
import { SectionNav } from '@/shared/ui/SectionNav';
import { HowItWorks } from '@/features/how-it-works';
import { TechEcosystem } from '@/features/tech-ecosystem';
import { UseCases } from '@/features/use-cases';
import { DashboardPreview } from '@/features/dashboard';
import { Calculator } from '@/features/calculator';
import { FAQ } from '@/features/faq';
import { featuredHelp } from '@/core/data/help';

const meta = ROUTES.find((r) => r.key === 'services');

export default function ServicesPage() {
  const { t, lang } = useApp();
  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? 'Ecozyon Tech çözümleri: nasıl çalışır, teknoloji ekosistemi, kullanım senaryoları ve canlı dashboard.'
      : 'Ecozyon Tech solutions: how it works, the technology ecosystem, use cases and a live dashboard.',
  );
  const tr = lang === 'tr';
  const sections = [
    { id: 'how', label: tr ? 'Nasıl çalışır' : 'How it works' },
    { id: 'tech', label: tr ? 'Teknoloji' : 'Technology' },
    { id: 'usecases', label: tr ? 'Senaryolar' : 'Use cases' },
    { id: 'calculator', label: tr ? 'Hesaplayıcı' : 'Calculator' },
    { id: 'faq', label: tr ? 'SSS' : 'FAQ' },
    { id: 'dashboard', label: tr ? 'Panel' : 'Dashboard' },
  ];
  // A short, curated FAQ here; the full searchable list lives on /help.
  const servicesFaq = {
    title: t.faq.title,
    items: featuredHelp().map((e) => ({ q: e.q[lang], a: e.a[lang] })),
  };
  return (
    <div className="pt-10">
      <SectionNav sections={sections} />
      <HowItWorks t={t} lang={lang} />
      <TechEcosystem t={t} />
      <UseCases t={t} lang={lang} />
      <Calculator t={t} />
      <FAQ t={t} faq={servicesFaq} moreTo="/help" moreLabel={tr ? 'Tüm soruları gör' : 'See all questions'} />
      <DashboardPreview t={t} lang={lang} />

      {/* The product story ends at the dashboard with no commercial next step.
          Route the convinced reader on: what it costs (pricing), the proof
          (impact), and a way to talk (contact). Labels come from the route
          table, so no per-link i18n is needed. */}
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
        <RelatedRoutes title={t.related.related} routeKeys={['pricing', 'impact', 'contact']} lang={lang} className="mt-0" />
      </div>
    </div>
  );
}
