import { Link } from 'react-router-dom';
import { EcoLogo } from '@/shared/ui/primitives';
import { FOOTER_GROUPS, routesInGroup } from '@/core/config/site';
import { useApp } from '@/app/providers/AppProvider';
import NewsletterForm from '@/shared/ui/NewsletterForm';

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400 mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} viewTransition className="text-[13px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { t, lang } = useApp();
  const newsletterP = t.contact.emailP;

  // One column per IA group. The legal column folds in the privacy/terms
  // anchors and drops the bare "Legal" link (the anchors already cover it).
  const columns = FOOTER_GROUPS.map((g) => {
    const routes = routesInGroup(g.id, ['nav', 'footer']);
    let links = routes.map((r) => ({ to: r.path, label: r.nav[lang] || r.nav.en }));
    if (g.id === 'legal') {
      links = [
        { to: '/legal#privacy', label: t.footer.privacy },
        { to: '/legal#terms', label: t.footer.terms },
        ...links.filter((l) => l.to !== '/legal'),
      ];
    }
    return { id: g.id, title: g.label[lang] || g.label.en, links };
  });

  return (
    <footer className="relative pt-16 pb-10 mt-8 border-t border-slate-900/[.08] dark:border-white/[.08]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <EcoLogo />
            <p className="mt-4 max-w-sm text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[.06] border border-slate-900/[.08] dark:border-white/[.1] px-3 py-1.5 text-[12px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M3.5 5h2v8h-2zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 4.5 2Zm3 3h2v1.2c.3-.5 1.1-1.4 2.6-1.4 1.8 0 2.4 1 2.4 2.7V13h-2V9.4c0-1.1-.3-1.7-1.2-1.7s-1.5.6-1.5 1.6V13h-2V5Z" /></svg>
                LinkedIn
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[.06] border border-slate-900/[.08] dark:border-white/[.1] px-3 py-1.5 text-[12px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">X</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[.06] border border-slate-900/[.08] dark:border-white/[.1] px-3 py-1.5 text-[12px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">GitHub</a>
            </div>
          </div>

          <nav aria-label={t.footer.nav} className="col-span-12 lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((c) => (
              <FooterCol key={c.id} title={c.title} links={c.links} />
            ))}
          </nav>

          <div className="col-span-12 lg:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-500 dark:text-slate-400 mb-3">
              {t.footer.newsletterTitle}
            </div>
            <NewsletterForm lang={lang} placeholder={newsletterP} />
            <div className="mt-4 text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.footer.newsletterNote}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-900/[.06] dark:border-white/[.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[11.5px] text-slate-500 dark:text-slate-400">{t.footer.rights}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">v1.0.0 · build 2026.05</div>
        </div>
      </div>
    </footer>
  );
}
