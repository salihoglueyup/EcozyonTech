---
name: add-content-entry
description: Add a content record (glossary term, help/FAQ entry, or case-study metadata) to the Ecozyon Tech data files following the exact bilingual schema, cross-links, and tests. Use when asked to enrich the glossary, help center, or case studies. Content search/command-palette pick new records up automatically via the registry.
---

# Add a content entry

All content lives in bilingual `{ tr, en }` data files under `src/core/data/`.
A test guards each file's schema; content search auto-derives from
`src/core/content/registry.js`, so a new record is searchable with no extra wiring.

## Glossary term — `src/core/data/glossary.js`

Schema (flat record):
```js
{
  id: 'kebab-case-unique',
  term: { tr: '…', en: '…' },
  category: { tr: '…', en: '…' },   // category id === category.en (helper relies on it)
  definition: { tr: '…', en: '…' },
  related: ['other-id', '…'],        // optional cross-links; every id MUST resolve
}
```
- `glossaryCategories()` derives categories automatically — a new `category.en`
  becomes a new filter pill.
- `related` renders a chip row on `/glossary`; clicking a chip clears the active
  filter/search then scrolls to the target. **Every `related` id must resolve to
  a real term** — the test enforces no dangling links.

## Help / FAQ entry — `src/core/data/help.js`

- Add a record with a unique `id`, bilingual `q`/`a`, a `category` (bilingual;
  new categories appear as pills automatically), and optional `featured: true`.
- `featured` entries also surface in the curated `/services` FAQ via
  `featuredHelp()`. The `/help` page (useFilteredList + Disclosure) and
  search/registry pick everything up automatically — **no page or i18n edits**.

## Case-study metadata — `src/core/data/cases.js`

- **Hard constraint**: `cases.test.js` enforces a partner-city ↔ case
  **one-to-one** mirror. Do NOT add a new case (it would require editing
  `cities.js` + the globe arcs). Only enrich the **existing** cases with optional
  fields (e.g. `durationMonths`, `teamSize` — positive integers), then render them
  on `src/pages/CaseStudy/index.jsx` and assert them in `cases.test.js`.

## After any addition

1. Extend the matching test in `src/core/data/*.test.js` (unique ids; bilingual
   fields present; `related`/cross-links resolve; numbers positive).
2. If you added labels for a page (e.g. a "Related terms" heading), add them to
   the page's i18n namespace in **both** languages.
3. Verify: `npx vitest run`, `npm run lint`. The `i18n-auditor` subagent can
   confirm bilingual parity across data fields.

## Don'ts

- Don't break the glossary `id` regex / uniqueness or the cases one-to-one mirror.
- Don't add a bilingual field in one language only.
