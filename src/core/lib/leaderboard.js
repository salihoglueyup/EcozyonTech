// Pure ranking model for the /leaderboard page. Ranks the city network by one
// of three metrics, with an optional join-year cutoff (mirrors the impact-map
// time scrubber). Deterministic — name is the tie-break — so the page, tests
// and prerender all agree.

export const METRICS = ['co2', 'efficiency', 'users'];

// Value of a city for a metric: total CO₂ (kg/day), per-user efficiency
// (CO₂/user, 3 decimals), or active users.
export function metricValue(city, metric) {
  if (metric === 'users') return city.users;
  if (metric === 'efficiency') return Math.round((city.co2 / Math.max(city.users, 1)) * 1000) / 1000;
  return city.co2;
}

// Ranked list: [{ city, value, rank }], highest first, name as tie-break.
// `year` keeps only cities joined by then; `limit` caps the rows.
export function rankCities(cities, { metric = 'co2', year = 2026, limit = 12 } = {}) {
  const m = METRICS.includes(metric) ? metric : 'co2';
  return cities
    .filter((c) => c.since <= year)
    .map((c) => ({ city: c, value: metricValue(c, m) }))
    .sort((a, b) => b.value - a.value || a.city.name.localeCompare(b.city.name))
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
