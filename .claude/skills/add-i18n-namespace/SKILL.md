---
name: add-i18n-namespace
description: Scaffold a new bilingual i18n namespace for the Ecozyon Tech site. Use when adding a new page/feature that needs its own copy block, or when asked to "add an i18n namespace / translation block". Creates src/core/i18n/ns/<name>.js with matching TR/EN trees and wires nothing else (dictionary.js auto-assembles).
---

# Add an i18n namespace

The site is fully bilingual TR/EN. Each namespace is one file; `dictionary.js`
assembles them automatically via `import.meta.glob`, and a Vitest test enforces
**deep (nested) TR/EN key parity**. Adding a namespace = dropping one file.

## Steps

1. **Pick a name** — short camelCase matching how pages will read it
   (`t.<name>.*`). Look at existing names in `src/core/i18n/ns/` to avoid
   collisions and to match style (e.g. `howItWorks`, `impactMap`, `useCases`).

2. **Create `src/core/i18n/ns/<name>.js`** with this exact shape:

   ```js
   // i18n namespace: <name> (TR/EN). Keep TR and EN keys in deep parity
   // (enforced by src/core/i18n/dictionary.test.js).
   export default {
     tr: {
       eyebrow: '…',
       title: '…',
       sub: '…',
       // nested groups are fine — just mirror them under `en`
     },
     en: {
       eyebrow: '…',
       title: '…',
       sub: '…',
     },
   };
   ```

3. **Mirror every key in both languages.** Same nested structure under `tr` and
   `en`; only the string values differ. This is the #1 thing that breaks the
   parity test. (The PostToolUse `i18n-parity.mjs` hook will flag drift on save.)

4. **Consume it** in the page/feature: pages read from `useApp()`/`useI18n()`
   and pass the active dictionary down as the `t` prop; the section reads
   `t.<name>.title` etc.

5. **Verify**: `npx vitest run src/core/i18n/dictionary.test.js` (or delegate a
   full audit to the `i18n-auditor` subagent).

## Don'ts

- Don't edit `dictionary.js` — the glob picks the file up automatically.
- Don't put copy inline in components; all user-facing strings live in a namespace.
- Don't add a key to one language only.
