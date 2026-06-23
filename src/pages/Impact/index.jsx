import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { RelatedRoutes } from '@/shared/ui/primitives';
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

      {/* The globe dominates the page; give readers a proof/next-step exit
          instead of relying on the navbar. Labels come from the route table. */}
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
        <RelatedRoutes title={t.related.related} routeKeys={['leaderboard', 'cases', 'contact']} lang={lang} className="mt-0" />
      </div>
    </div>
  );
}
