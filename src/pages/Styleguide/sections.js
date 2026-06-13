// In-page section registry for the styleguide. Drives the SectionNav rail and
// the section headings, so the nav and the rendered sections stay in lockstep.
// Bilingual labels; ids are the scroll anchors. Pure + unit-tested.
export const SECTIONS = [
  { id: 'colors', label: { tr: 'Renkler', en: 'Colors' } },
  { id: 'typography', label: { tr: 'Tipografi', en: 'Typography' } },
];

// The ordered list of section ids (anchors / scroll-spy targets).
export const sectionIds = (sections = SECTIONS) => sections.map((s) => s.id);
