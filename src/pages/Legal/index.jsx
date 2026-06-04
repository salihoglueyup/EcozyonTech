import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';

const meta = routeByKey('legal');

const SECTIONS = [
  {
    id: 'privacy',
    title: { tr: 'Gizlilik Politikası (KVKK)', en: 'Privacy Policy' },
    body: {
      tr: [
        'Ecozyon Tech, 6698 sayılı KVKK kapsamında veri sorumlusudur. Topladığımız veriler yalnızca hizmeti sağlamak için işlenir.',
        'İletişim formundan ilettiğin ad, şirket ve e-posta yalnızca talebine yanıt vermek için kullanılır; üçüncü taraflara satılmaz.',
        'Cihaz verileri kişisel baseline ve öneriler için işlenir; mümkün olduğunda cihaz üstünde tutulur. Dilediğin zaman silinmesini talep edebilirsin.',
        'Talepler için: hello@ecozyon.tech',
      ],
      en: [
        'Ecozyon Tech is the data controller. Data we collect is processed solely to provide the service.',
        'Name, company and email from the contact form are used only to reply to your request and are never sold to third parties.',
        'Device data is processed for the personal baseline and suggestions, kept on-device where possible. You may request deletion at any time.',
        'Requests: hello@ecozyon.tech',
      ],
    },
  },
  {
    id: 'terms',
    title: { tr: 'Kullanım Şartları', en: 'Terms of Service' },
    body: {
      tr: [
        'Bu site bir tanıtım/demo amacıyla sunulmaktadır. İçerik bilgilendirme amaçlıdır ve önceden haber verilmeksizin değiştirilebilir.',
        'Pilot dönem hizmetleri "olduğu gibi" sunulur. Erişim, kötüye kullanım durumunda kısıtlanabilir.',
        'Marka ve içerik hakları Ecozyon Tech’e aittir.',
      ],
      en: [
        'This site is provided as a portfolio/demo. Content is informational and may change without notice.',
        'Pilot-period services are provided "as is". Access may be restricted in case of abuse.',
        'Brand and content rights belong to Ecozyon Tech.',
      ],
    },
  },
];

export default function LegalPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  useDocumentMeta(
    meta.title[lang],
    tr ? 'Gizlilik politikası (KVKK) ve kullanım şartları.' : 'Privacy policy and terms of service.',
  );

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-3xl px-6">
        <Tag color="slate">// {tr ? 'Yasal' : 'Legal'}</Tag>
        <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.06] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          {tr ? 'Gizlilik & Şartlar' : 'Privacy & Terms'}
        </h1>
        <p className="mt-2 text-[12.5px] text-slate-500 dark:text-slate-400">
          {tr ? 'Son güncelleme: Mayıs 2026' : 'Last updated: May 2026'}
        </p>

        <div className="mt-10 space-y-12">
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-[22px] tracking-tight text-slate-900 dark:text-slate-100">{s.title[lang]}</h2>
              <div className="mt-4 space-y-4">
                {s.body[lang].map((p, i) => (
                  <p key={i} className="text-[14.5px] text-slate-700 dark:text-slate-300 leading-[1.7]">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
