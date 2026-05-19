import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { ROUTES } from '@/core/config/site';
import { Contact } from '@/features/contact';

const meta = ROUTES.find((r) => r.key === 'contact');

export default function ContactPage() {
  const { t, lang } = useApp();
  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? "Ecozyon Tech ile iletişime geçin — pilot, demo ve iş birliği için."
      : 'Get in touch with Ecozyon Tech — for pilots, demos and partnerships.',
  );
  return (
    <div className="pt-10">
      <Contact t={t} lang={lang} />
    </div>
  );
}
