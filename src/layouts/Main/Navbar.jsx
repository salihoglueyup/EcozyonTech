import { GRADIENTS } from '@/core/tokens';
import { useState, useEffect, useRef, useId } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { EcoLogo } from '@/shared/ui/primitives';
import { NAV_GROUPS, routesInGroup } from '@/core/config/site';
import { useApp } from '@/app/providers/AppProvider';
import { track } from '@/core/lib/telemetry';

export default function Navbar() {
  const { lang, setLang, theme, setTheme, t } = useApp();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // active mega-menu group id

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc closes whatever navigation surface is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMobileOpen(false);
      setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Navigating closes any open menu/sheet (intentional reset on route change).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const cta = t.nav.cta;

  return (
    <>
      <header className="fixed top-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center gap-2 rounded-full pl-3 sm:pl-4 pr-2 py-2 transition-all duration-300 border border-white/60 dark:border-slate-700/60 ${
            scrolled
              ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_28px_-12px_rgba(15,23,42,.18)] dark:shadow-[0_8px_28px_-12px_rgba(0,0,0,.5)]'
              : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md'
          }`}
        >
          <EcoLogo />
          <nav className="hidden lg:flex items-center mx-3 gap-1">
            {NAV_GROUPS.map((g) => (
              <NavMenu
                key={g.id}
                group={g}
                lang={lang}
                pathname={pathname}
                open={openMenu === g.id}
                setOpen={setOpenMenu}
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 pl-2 sm:border-l sm:border-slate-900/10 dark:sm:border-white/10">
            <button
              type="button"
              onClick={() => { track('search_open', { source: 'navbar' }); window.dispatchEvent(new Event('ecozyon:cmdk')); }}
              className="eco-press hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-900/[.04] dark:bg-white/[.08] hover:bg-slate-900/[.07] dark:hover:bg-white/[.12] px-2.5 py-1.5 text-[11.5px] text-slate-500 dark:text-slate-400 transition"
              aria-label={t.cmd.placeholder}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
              </svg>
              <kbd className="font-sans font-medium">⌘K</kbd>
            </button>
            <ThemeToggle theme={theme} setTheme={setTheme} t={t} />
            <LangSwitch lang={lang} setLang={setLang} />
            <NavLink
              to="/pricing"
              viewTransition
              onClick={() => track('cta_click', { to: '/pricing', source: 'navbar' })}
              className="eco-press hidden sm:inline-flex relative items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-[0_6px_18px_-6px_rgba(14,165,233,.6)] hover:shadow-[0_10px_28px_-8px_rgba(16,185,129,.55)] transition-shadow"
              style={{ backgroundImage: GRADIENTS.cta }}
            >
              {cta}
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h6m-2-2 2 2-2 2" /></svg>
            </NavLink>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.04] dark:hover:bg-white/[.08]"
              aria-label={t.a11y.openMenu}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-3 top-3 left-3 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/70 dark:border-slate-700/50 shadow-2xl p-5 animate-[fadeUp_.25s_ease]">
            <div className="flex items-center justify-between mb-4">
              <EcoLogo />
              <button onClick={() => setMobileOpen(false)} aria-label={t.a11y.closeMenu} className="h-8 w-8 rounded-full grid place-items-center text-slate-600 dark:text-slate-400 hover:bg-slate-900/[.04] dark:hover:bg-white/[.08]">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" /></svg>
              </button>
            </div>
            <nav className="flex flex-col max-h-[64vh] overflow-y-auto -mr-2 pr-2">
              {NAV_GROUPS.map((g) => (
                <div key={g.id} className="mb-1">
                  <div className="px-1 pt-3 pb-1 text-[10.5px] uppercase tracking-[.14em] font-semibold text-slate-400 dark:text-slate-500">
                    {g.label[lang] || g.label.en}
                  </div>
                  {routesInGroup(g.id, ['nav']).map((it) => (
                    <NavLink
                      key={it.path}
                      to={it.path}
                      viewTransition
                      onClick={() => setMobileOpen(false)}
                      className="py-2.5 border-b border-slate-900/[.05] dark:border-white/[.06] last:border-0 text-[14.5px] text-slate-800 dark:text-slate-200 flex items-center justify-between"
                    >
                      {it.nav[lang] || it.nav.en}
                      <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h6m-2-2 2 2-2 2" /></svg>
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>
            <NavLink
              to="/pricing"
              viewTransition
              onClick={() => { track('cta_click', { to: '/pricing', source: 'mobile' }); setMobileOpen(false); }}
              className="eco-press mt-5 w-full inline-flex justify-center items-center gap-1.5 rounded-full px-3.5 py-3 text-[13px] font-medium text-white"
              style={{ backgroundImage: GRADIENTS.cta }}
            >
              {cta}
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}

// One navbar mega-menu: a pill trigger that reveals its group's pages on
// hover, click or keyboard. Only one menu is open at a time (state lives in
// Navbar). Implements the WAI-ARIA menu-button keyboard pattern: ↓/↑ on the
// trigger opens and lands focus on the first/last item; ↑↓/Home/End rove
// between items; Esc closes and restores focus to the trigger; tabbing out
// closes it. Matches the glass/pill design language of the bar.
function NavMenu({ group, lang, pathname, open, setOpen }) {
  const items = routesInGroup(group.id, ['nav']);
  const active = items.some((it) => it.path === pathname);
  const cols = items.length > 5 ? 'grid-cols-2' : 'grid-cols-1';
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  // When the menu is opened from the keyboard, remember which edge item to
  // focus once it has rendered ('first' on ↓, 'last' on ↑).
  const pendingFocus = useRef(null);

  const menuItems = () =>
    Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? []);

  // Apply any pending edge-focus after the menu opens.
  useEffect(() => {
    if (open && pendingFocus.current) {
      const els = menuItems();
      if (els.length) (pendingFocus.current === 'last' ? els.at(-1) : els[0]).focus();
    }
    pendingFocus.current = null;
  }, [open]);

  const onTriggerKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    pendingFocus.current = e.key === 'ArrowUp' ? 'last' : 'first';
    if (open) {
      // Already open: focus immediately (the effect only fires on open change).
      const els = menuItems();
      if (els.length) (pendingFocus.current === 'last' ? els.at(-1) : els[0]).focus();
      pendingFocus.current = null;
    } else {
      setOpen(group.id);
    }
  };

  const onMenuKey = (e) => {
    const els = menuItems();
    if (!els.length) return;
    const i = els.indexOf(document.activeElement);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); els[(i + 1) % els.length].focus(); break;
      case 'ArrowUp': e.preventDefault(); els[(i - 1 + els.length) % els.length].focus(); break;
      case 'Home': e.preventDefault(); els[0].focus(); break;
      case 'End': e.preventDefault(); els.at(-1).focus(); break;
      case 'Escape': setOpen(null); triggerRef.current?.focus(); break;
      default: break;
    }
  };

  // Close when focus leaves the whole menu (e.g. tabbing past the last item).
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen((cur) => (cur === group.id ? null : cur));
    }
  };

  const triggerClass = `inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] transition ${
    active || open
      ? 'text-slate-900 dark:text-white bg-slate-900/[.06] dark:bg-white/[.1]'
      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/[.04] dark:hover:bg-white/[.06]'
  }`;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(group.id)}
      onMouseLeave={() => setOpen((cur) => (cur === group.id ? null : cur))}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((cur) => (cur === group.id ? null : group.id))}
        onKeyDown={onTriggerKey}
        className={triggerClass}
      >
        {group.label[lang] || group.label.en}
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={group.label[lang] || group.label.en}
            onKeyDown={onMenuKey}
            className="w-max max-w-[min(86vw,30rem)] rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/70 dark:border-slate-700/50 shadow-[0_18px_44px_-18px_rgba(15,23,42,.4)] p-2 animate-[fadeUp_.18s_ease]"
          >
            <div className={`grid ${cols} gap-0.5`}>
              {items.map((it) => (
                <NavLink
                  key={it.path}
                  to={it.path}
                  role="menuitem"
                  viewTransition
                  onClick={() => setOpen(null)}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] transition ${
                      isActive
                        ? 'text-slate-900 dark:text-white bg-slate-900/[.06] dark:bg-white/[.1]'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/[.05] dark:hover:bg-white/[.07]'
                    }`
                  }
                >
                  <span className="flex-1 truncate">{it.nav[lang] || it.nav.en}</span>
                  <svg className="h-3 w-3 shrink-0 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 6h6m-2-2 2 2-2 2" /></svg>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ theme, setTheme, t }) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={() => { const next = dark ? 'light' : 'dark'; setTheme(next); track('theme_switch', { theme: next }); }}
      className="relative inline-flex items-center justify-center h-7 w-7 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-900/[.04] dark:hover:bg-white/[.08] transition"
      aria-label={t.a11y.toggleTheme}
      title={dark ? t.a11y.lightMode : t.a11y.darkMode}
    >
      <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition-all ${dark ? 'opacity-0 scale-50 absolute' : 'opacity-100 scale-100'}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M4.6 15.4l1.4-1.4M14 6l1.4-1.4" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition-all ${dark ? 'opacity-100 scale-100' : 'opacity-0 scale-50 absolute'}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M16 12.5A7 7 0 1 1 7.5 4a5.5 5.5 0 0 0 8.5 8.5Z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function LangSwitch({ lang, setLang }) {
  return (
    <div className="relative inline-flex items-center rounded-full bg-slate-900/[.05] dark:bg-white/[.08] p-[3px] text-[11px] font-semibold text-slate-600 dark:text-slate-400">
      <button onClick={() => { setLang('tr'); track('lang_switch', { lang: 'tr' }); }} aria-label="Türkçe" className={`relative z-10 px-2.5 py-1 rounded-full transition ${lang === 'tr' ? 'text-slate-900 dark:text-white' : ''}`}>TR</button>
      <button onClick={() => { setLang('en'); track('lang_switch', { lang: 'en' }); }} aria-label="English" className={`relative z-10 px-2.5 py-1 rounded-full transition ${lang === 'en' ? 'text-slate-900 dark:text-white' : ''}`}>EN</button>
      <span
        className="absolute top-[3px] bottom-[3px] w-[34px] rounded-full bg-white dark:bg-slate-700 shadow-sm transition-all"
        style={{ left: lang === 'tr' ? 3 : 37 }}
      />
    </div>
  );
}
