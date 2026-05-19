import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { ImpactMap } from '@/features/impact-map';

const meta = ROUTES.find((r) => r.key === 'impact');

export default function ImpactPage() {
  const { t, lang } = useApp();
  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? "Ecozyon Tech'in dünya genelindeki pilot şehirleri ve karbon tasarrufu etki haritası."
      : "Ecozyon Tech's worldwide pilot cities and carbon-savings impact map.",
  );
  return (
    <div className="pt-10">
      <ImpactMap t={t} lang={lang} />
    </div>
  );
}
