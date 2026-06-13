// i18n assembly point. Translations live in per-namespace modules under
// ./ns/<namespace>.js — each default-exports { tr, en } for one namespace.
// This file glues them into the ECO_I18N { tr, en } shape the app consumes, so
// adding a namespace means dropping a new file in ./ns (no edits here). TR/EN
// key parity (including nested keys) is enforced by dictionary.test.js.
const modules = import.meta.glob('./ns/*.js', { eager: true });

const tr = {};
const en = {};
for (const [path, mod] of Object.entries(modules)) {
  const name = path.slice(path.lastIndexOf('/') + 1, -3); // "./ns/<name>.js" → "<name>"
  tr[name] = mod.default.tr;
  en[name] = mod.default.en;
}

export const ECO_I18N = { tr, en };
