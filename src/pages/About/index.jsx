import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { AboutBento } from '@/features/about';

const meta = ROUTES.find((r) => r.key === 'about');

export default function AboutPage() {
  const { t, lang } = useApp();
  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? 'Ecozyon Tech ekibi, misyonu, vizyonu ve değerleri.'
      : 'The Ecozyon Tech team, mission, vision and values.',
  );
  return (
    <div className="pt-10">
      <AboutBento t={t} lang={lang} />
    </div>
  );
}
