import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { RelatedRoutes } from '@/shared/ui/primitives';
import { SectionNav, useScrollSpy } from '@/shared/ui/SectionNav';
import { HowItWorks } from '@/features/how-it-works';
import { ProcessTimeline } from '@/features/process-timeline';
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
    { id: 'process', label: tr ? 'Süreç' : 'Process' },
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

  // Focus Mode Logic
  const activeSection = useScrollSpy(sections.map((s) => s.id), { rootMargin: '-30% 0px -40% 0px' });
  const getFocusClass = (id) => {
    if (!activeSection) return "transition-opacity duration-700 opacity-100";
    return `transition-opacity duration-700 ease-in-out ${activeSection === id ? 'opacity-100' : 'opacity-40 filter blur-[1px]'}`;
  };

  return (
    <div className="pt-10">
      <SectionNav sections={sections} />
      <div className={getFocusClass('how')}><HowItWorks t={t} lang={lang} /></div>
      <div className={getFocusClass('process')}><ProcessTimeline /></div>
      <div className={getFocusClass('tech')}><TechEcosystem t={t} /></div>
      <div className={getFocusClass('usecases')}><UseCases t={t} lang={lang} /></div>
      <div className={getFocusClass('calculator')}><Calculator t={t} /></div>
      <div className={getFocusClass('faq')}><FAQ t={t} faq={servicesFaq} moreTo="/help" moreLabel={tr ? 'Tüm soruları gör' : 'See all questions'} /></div>
      <div className={getFocusClass('dashboard')}><DashboardPreview t={t} lang={lang} /></div>

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
