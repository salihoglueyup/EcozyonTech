import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppProvider';
import { useFocusTrap } from '@/shared/ui/useFocusTrap';
import { ROUTES, SITE } from '@/core/config/site';
import { POSTS } from '@/core/data/posts';
import { JOBS } from '@/core/data/jobs';
import { readRecents } from '@/core/lib/recents';
import { readSaved, isSaved } from '@/core/lib/saved';
import { buildSearchDocs, searchDocs } from '@/core/lib/search';
import { track } from '@/core/lib/telemetry';
import { useToast } from '@/shared/ui/Toast';
import { buildCommands, filterCommands, orderByRecents } from './commands';

// Site-wide ⌘K / Ctrl+K palette. Mounted once in the layout; renders nothing
// until opened, so it adds nothing to the prerendered HTML.
export default function CommandPalette() {
  const { lang, t, theme, setTheme, setLang } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recentSlugs, setRecentSlugs] = useState([]);
  const [savedSlugs, setSavedSlugs] = useState([]);
  const dialogRef = useRef(null);
  const listId = useId();
  useFocusTrap(dialogRef, open);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const copyCurrentLink = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(`${SITE.url}${window.location.pathname}`);
      toast({ message: t.cmd.linkCopied, type: 'success' });
    } catch {
      toast({ message: t.blog.copyError, type: 'error' });
    }
  }, [toast, t]);

  // Action items carry handlers; data items (pages/posts) carry `to`. Saved
  // posts get a `saved` flag so the list can mark them.
  const items = useMemo(() => {
    const data = buildCommands({ routes: ROUTES, posts: POSTS, jobs: JOBS, lang }).map((it) =>
      it.type === 'post' && isSaved(savedSlugs, it.to.slice('/blog/'.length)) ? { ...it, saved: true } : it,
    );
    const actions = [
      {
        id: 'action:theme',
        type: 'action',
        label: t.cmd.toggleTheme,
        keywords: ['theme', 'tema', 'dark', 'light', 'karanlık', 'aydınlık'],
        run: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'action:lang',
        type: 'action',
        label: lang === 'tr' ? 'English' : 'Türkçe',
        keywords: ['language', 'dil', 'tr', 'en', 'türkçe', 'english'],
        run: () => setLang(lang === 'tr' ? 'en' : 'tr'),
      },
      {
        id: 'action:copy-link',
        type: 'action',
        label: t.cmd.copyLink,
        keywords: ['copy', 'link', 'url', 'kopyala', 'bağlantı', 'share', 'paylaş'],
        run: copyCurrentLink,
      },
    ];
    return [...data, ...actions];
  }, [lang, t, theme, setTheme, setLang, savedSlugs, copyCurrentLink]);

  // Full-content search index (pages + posts + help + cases + changelog +
  // roles), rebuilt only when the language changes.
  const searchIndex = useMemo(
    () => buildSearchDocs({ routes: ROUTES, lang }),
    [lang],
  );

  // Empty query → recently-viewed posts float to the top. With a query → rank
  // the whole content index (matching body text, not just titles) and append
  // any matching actions (theme/lang/copy).
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return orderByRecents(items, recentSlugs);
    const content = searchDocs(searchIndex, q).map((d) => {
      const base = { id: d.id, type: d.type, label: d.title, hint: d.hint, to: d.to };
      if (d.type === 'post' && isSaved(savedSlugs, d.to.slice('/blog/'.length))) return { ...base, saved: true };
      return base;
    });
    const actions = filterCommands(items.filter((it) => it.type === 'action'), q);
    const out = [...content, ...actions];
    // When there are content hits, offer a deep-link to the full results page.
    if (content.length) {
      out.push({ id: 'search:all', type: 'search', label: t.cmd.viewAll.replace('{q}', q), to: `/search?q=${encodeURIComponent(q)}` });
    }
    return out;
  }, [items, query, recentSlugs, searchIndex, savedSlugs, t]);

  const kindLabel = {
    page: t.cmd.pages,
    post: t.cmd.posts,
    help: t.cmd.help,
    term: t.cmd.glossary,
    case: t.cmd.cases,
    integration: t.cmd.integrations,
    changelog: t.cmd.changelog,
    job: t.cmd.roles,
    action: t.cmd.actions,
  };

  const run = useCallback(
    (item) => {
      if (!item) return;
      track('search_select', { type: item.type || 'action' });
      if (item.run) item.run();
      else if (item.to) navigate(item.to, { viewTransition: true });
      close();
    },
    [navigate, close],
  );

  // Global open/close shortcut (⌘K / Ctrl+K) + a custom event so UI affordances
  // (e.g. the navbar button) can open the palette without lifting state.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setRecentSlugs(readRecents()); // refresh from storage on each toggle
        setSavedSlugs(readSaved());
        setOpen((v) => !v);
      }
    };
    const onOpen = () => { setRecentSlugs(readRecents()); setSavedSlugs(readSaved()); setOpen(true); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('ecozyon:cmdk', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ecozyon:cmdk', onOpen);
    };
  }, []);

  if (!open) return null;

  const onListKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={close} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.cmd.placeholder}
        onKeyDown={onListKey}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/70 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-[0_40px_120px_-30px_rgba(15,23,42,.55)] animate-[fadeUp_.2s_ease-out]"
      >
        <div className="flex items-center gap-3 border-b border-slate-900/[.07] dark:border-white/[.08] px-4">
          <svg className="h-4 w-4 text-slate-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" /><path d="m11 11 3 3" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder={t.cmd.placeholder}
            className="w-full bg-transparent py-3.5 text-[14px] text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <ul id={listId} role="listbox" className="max-h-[52vh] overflow-y-auto py-1.5">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-[13px] text-slate-500">{t.cmd.noResults}</li>
          )}
          {results.map((item, i) => (
            <li
              key={item.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onClick={() => run(item)}
              onMouseEnter={() => setActive(i)}
              className={`mx-1.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] ${
                i === active ? 'bg-slate-900 dark:bg-white/[.12] text-white' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className={`shrink-0 ${i === active ? 'text-white/70' : 'text-slate-400'}`} aria-hidden="true">
                {item.recent
                  ? '↺'
                  : item.type === 'search'
                    ? '⌕'
                    : item.type === 'action'
                      ? '⌘'
                    : item.type === 'post'
                      ? '✎'
                      : item.type === 'help'
                        ? '?'
                        : item.type === 'term'
                          ? '¶'
                        : item.type === 'case'
                          ? '◆'
                          : item.type === 'integration'
                            ? '⊞'
                            : item.type === 'changelog'
                            ? '⊙'
                            : item.type === 'job'
                              ? '⊕'
                              : '→'}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.saved && (
                <svg viewBox="0 0 16 16" className={`h-3 w-3 shrink-0 ${i === active ? 'text-white/70' : 'text-cyan-500'}`} fill="currentColor" aria-hidden="true"><path d="M4 2.5h8v11l-4-2.6-4 2.6z" /></svg>
              )}
              {item.hint && (
                <span className={`text-[11px] ${i === active ? 'text-white/60' : 'text-slate-400'}`}>{item.hint}</span>
              )}
              <span className={`text-[10.5px] uppercase tracking-wide ${i === active ? 'text-white/50' : 'text-slate-300'}`}>
                {kindLabel[item.type]}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-900/[.07] dark:border-white/[.08] px-4 py-2 text-[11px] text-slate-400 dark:text-slate-500">{t.cmd.hint}</div>
      </div>
    </div>
  );
}
