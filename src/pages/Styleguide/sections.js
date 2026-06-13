// In-page section registry for the styleguide. Drives the SectionNav rail and
// the section headings, so the nav and the rendered sections stay in lockstep.
// Bilingual labels; ids are the scroll anchors. Pure + unit-tested.
export const SECTIONS = [
  { id: 'colors', label: { tr: 'Renkler', en: 'Colors' } },
  { id: 'typography', label: { tr: 'Tipografi', en: 'Typography' } },
  { id: 'tags', label: { tr: 'Etiketler', en: 'Tags' } },
  { id: 'buttons', label: { tr: 'Butonlar', en: 'Buttons' } },
  { id: 'cards', label: { tr: 'Kartlar', en: 'Cards' } },
  { id: 'skeletons', label: { tr: 'İskeletler', en: 'Skeletons' } },
  { id: 'forms', label: { tr: 'Formlar', en: 'Forms' } },
];

// The ordered list of section ids (anchors / scroll-spy targets).
export const sectionIds = (sections = SECTIONS) => sections.map((s) => s.id);
