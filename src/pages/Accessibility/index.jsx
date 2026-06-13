import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';

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
    <article className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-2xl px-6">
        <Tag color="cyan">// {a.eyebrow}</Tag>
        <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          {a.title}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
            {a.titleAccent}
          </span>
        </h1>
        <p className="mt-3 text-[12px] text-slate-400">{a.updated}: 2026-06-13</p>

        <div className="mt-8 space-y-9">
          {SECTIONS.map((sec) => (
            <section key={sec.heading.en}>
              <h2 className="font-display text-[18px] tracking-tight text-slate-900 dark:text-slate-100 mb-3">{sec.heading[lang]}</h2>
              {sec.body?.[lang].map((p, i) => (
                <p key={i} className="text-[14.5px] text-slate-700 dark:text-slate-300 leading-[1.75] mb-2">{p}</p>
              ))}
              {sec.list && (
                <ul className="space-y-2">
                  {sec.list[lang].map((li, i) => (
                    <li key={i} className="flex gap-2.5 text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-500" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7.5 6 10l5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-900/[.07] dark:border-white/[.08] pt-7 text-[14px] text-slate-600 dark:text-slate-400">
          {tr ? 'Bir erişim engeliyle karşılaştın mı? ' : 'Ran into an access barrier? '}
          <Link to="/contact?from=accessibility" className="text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-cyan-500 decoration-2">
            {tr ? 'Bize bildir' : 'Let us know'}
          </Link>
        </div>
      </div>
    </article>
  );
}
