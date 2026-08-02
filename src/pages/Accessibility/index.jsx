import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { SpotlightCard } from '@/shared/ui/SpotlightCard';
import { GridPattern } from '@/shared/ui/GridPattern';

const meta = routeByKey('accessibility');

// Bilingual content kept inline (like the Legal page) so the parity-checked
// dictionary stays lean. Each section: heading + paragraphs (or a bullet list).
const SECTIONS = [
  {
    heading: { tr: 'Hedefimiz', en: 'Our goal' },
    body: {
      tr: ['Ecozyon Tech, herkesin kullanabileceği bir deneyim sunmayı hedefler. Tasarım ve geliştirme süreçlerimizde WCAG 2.1 AA seviyesini referans alıyoruz.'],
      en: ['Ecozyon Tech aims to provide an experience everyone can use. We reference WCAG 2.1 AA throughout our design and development.'],
    },
  },
  {
    heading: { tr: 'Neler yapıyoruz', en: 'What we do' },
    list: {
      tr: [
        'Anlamsal HTML ve doğru ARIA rolleri (önemli bölgeler, listeler, tablolar, diyaloglar).',
        'Tam klavye erişimi ve her etkileşimli öğede tutarlı bir :focus-visible halkası.',
        'prefers-reduced-motion desteği: animasyonlar ve sayfa geçişleri nötrlenir.',
        'Etiketli form alanları, canlı bölge (aria-live) bildirimleri ve atlama bağlantısı.',
        'Renk kontrastına dikkat; karanlık/aydınlık temada okunabilirlik.',
      ],
      en: [
        'Semantic HTML and correct ARIA roles (landmarks, lists, tables, dialogs).',
        'Full keyboard access with a consistent :focus-visible ring on every interactive element.',
        'prefers-reduced-motion support: animations and page transitions are neutralized.',
        'Labelled form fields, live-region (aria-live) announcements and a skip link.',
        'Attention to color contrast and readability across dark/light themes.',
      ],
    },
  },
  {
    heading: { tr: 'Otomatik testler', en: 'Automated testing' },
    body: {
      tr: ['Sürekli entegrasyon hattımız her değişiklikte statik sayfalarda axe-core erişilebilirlik denetimi çalıştırır; bir ihlal bulunursa derleme başarısız olur. Böylece erişilebilirlik bir kerelik değil, kalıcı bir güvence olur.'],
      en: ['Our continuous-integration pipeline runs axe-core accessibility checks on static pages for every change; a violation fails the build. This keeps accessibility a standing guarantee, not a one-off.'],
    },
  },
  {
    heading: { tr: 'Bilinen sınırlar', en: 'Known limitations' },
    body: {
      tr: ['3D etki haritası dekoratif bir görselleştirmedir ve ekran okuyuculardan gizlenir (aria-hidden); aynı veriye liderlik tablosu ve metin listeleri üzerinden erişilebilir. Üçüncü taraf gömülü içerikler kapsam dışında olabilir.'],
      en: ['The 3D impact map is a decorative visualization and is hidden from screen readers (aria-hidden); the same data is reachable via the leaderboard and text lists. Third-party embedded content may fall outside our control.'],
    },
  },
];

export default function AccessibilityPage() {
  const { lang, t } = useApp();
  const a = t.accessibility;
  const tr = lang === 'tr';
  useDocumentMeta(meta.title[lang], tr ? 'Ecozyon Tech erişilebilirlik beyanı.' : 'Ecozyon Tech accessibility statement.');

  return (
    <article className="relative py-20 lg:py-28 pt-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 mask-radial-faded">
        <GridPattern />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        <Tag color="cyan">// {a.eyebrow}</Tag>
        <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          {a.title}
          <span className="eco-gradient-text">
            {a.titleAccent}
          </span>
        </h1>
        <p className="mt-3 text-[12px] text-slate-400">{a.updated}: 2026-06-13</p>

        <div className="mt-12 space-y-6">
          {SECTIONS.map((sec) => (
            <SpotlightCard key={sec.heading.en} className="p-6 md:p-8 border-l-4 border-l-emerald-500">
              <h2 className="font-display text-[20px] tracking-tight text-slate-900 dark:text-slate-100 mb-4">{sec.heading[lang]}</h2>
              {sec.body?.[lang].map((p, i) => (
                <p key={i} className="text-[14.5px] text-slate-700 dark:text-slate-300 leading-[1.75] mb-2">{p}</p>
              ))}
              {sec.list && (
                <ul className="space-y-3 mt-4">
                  {sec.list[lang].map((li, i) => (
                    <li key={i} className="flex gap-3 text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <svg className="mt-1 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7.5 6 10l5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-cyan-50 dark:bg-cyan-900/10 p-6 md:p-8 text-[14px] text-slate-700 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            {tr ? 'Bir erişim engeliyle karşılaştın mı? ' : 'Ran into an access barrier? '}
          </p>
          <Link to="/contact?from=accessibility" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-medium hover:underline">
            {tr ? 'Bize bildir' : 'Let us know'}
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
