// Sustainability self-assessment — pure scoring logic, language-agnostic. Holds
// only ids + numeric scores; all copy (questions, options, profiles, tips)
// lives in the i18n `assessment` namespace and is looked up by these ids. Unit
// -tested; the /assessment page is a thin UI over this.

// Four categories, four options each, scored 0–100 (higher = lower footprint).
export const QUESTIONS = [
  {
    id: 'transport',
    options: [
      { id: 'car', score: 0 },
      { id: 'mixed', score: 40 },
      { id: 'transit', score: 70 },
      { id: 'active', score: 100 },
    ],
  },
  {
    id: 'diet',
    options: [
      { id: 'meat', score: 0 },
      { id: 'some', score: 45 },
      { id: 'flexi', score: 70 },
      { id: 'plant', score: 100 },
    ],
  },
  {
    id: 'energy',
    options: [
      { id: 'grid', score: 20 },
      { id: 'efficient', score: 55 },
      { id: 'partial', score: 80 },
      { id: 'renew', score: 100 },
    ],
  },
  {
    id: 'consumption',
    options: [
      { id: 'high', score: 10 },
      { id: 'average', score: 45 },
      { id: 'conscious', score: 75 },
      { id: 'minimal', score: 100 },
    ],
  },
];

// Score band → profile id (descending). Used for the headline result.
export const PROFILE_BANDS = [
  { id: 'leader', min: 80 },
  { id: 'good', min: 60 },
  { id: 'starter', min: 40 },
  { id: 'beginner', min: 0 },
];

const optionScore = (q, optId) => q.options.find((o) => o.id === optId)?.score;

// `answers`: { [questionId]: optionId }. Average of the answered categories
// (0 when nothing is answered yet), rounded to a whole 0–100.
export function scoreAssessment(answers = {}) {
  const vals = QUESTIONS.map((q) => optionScore(q, answers[q.id])).filter((v) => v != null);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function isComplete(answers = {}) {
  return QUESTIONS.every((q) => answers[q.id] != null);
}

export function profileFor(score) {
  return PROFILE_BANDS.find((b) => score >= b.min)?.id || 'beginner';
}

// The lowest-scoring answered categories (most room to improve), excluding
// already-perfect ones — these drive the personalized tips. Returns question ids.
export function recommendationsFor(answers = {}, n = 3) {
  return QUESTIONS.map((q) => ({ id: q.id, score: optionScore(q, answers[q.id]) }))
    .filter((x) => x.score != null && x.score < 100)
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map((x) => x.id);
}

// Per-category 0–100 breakdown for the result chart (answered → score, else 0).
export function categoryBreakdown(answers = {}) {
  return QUESTIONS.map((q) => ({ id: q.id, score: optionScore(q, answers[q.id]) ?? 0 }));
}
