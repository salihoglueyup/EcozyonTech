import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { RelatedRoutes } from '@/shared/ui/primitives';
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

      {/* Turn the story page into a next action: who's behind it →
          join (careers), cover us (press), or just reach out (contact).
          Labels come from the route table, so no per-link i18n is needed. */}
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
        <RelatedRoutes title={t.related.related} routeKeys={['careers', 'press', 'contact']} lang={lang} className="mt-0" />
      </div>
    </div>
  );
}
