import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { SectionNav } from '@/shared/ui/SectionNav';
import { HowItWorks } from '@/features/how-it-works';
import { TechEcosystem } from '@/features/tech-ecosystem';
import { UseCases } from '@/features/use-cases';
import { DashboardPreview } from '@/features/dashboard';
import { Calculator } from '@/features/calculator';
import { FAQ } from '@/features/faq';

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
  return (
    <div className="pt-10">
      <SectionNav sections={sections} />
      <HowItWorks t={t} lang={lang} />
      <TechEcosystem t={t} />
      <UseCases t={t} lang={lang} />
      <Calculator t={t} />
      <FAQ t={t} />
      <DashboardPreview t={t} lang={lang} />
    </div>
  );
}
