import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';

import HelpPage from '@/pages/Help';
import PricingPage from '@/pages/Pricing';
import StatusPage from '@/pages/Status';
import SearchPage from '@/pages/Search';
import ChangelogPage from '@/pages/Changelog';
import PressPage from '@/pages/Press';
import StyleguidePage from '@/pages/Styleguide';
import NotFoundPage from '@/pages/NotFound';
import ComparePage from '@/pages/Compare';
import LeaderboardPage from '@/pages/Leaderboard';
import SitemapPage from '@/pages/Sitemap';
import AccessibilityPage from '@/pages/Accessibility';
import DevelopersPage from '@/pages/Developers';
import GlossaryPage from '@/pages/Glossary';

expect.extend(toHaveNoViolations);

// Static, non-3D pages — rendered in isolation within the app providers and a
// router. (3D-globe pages are excluded: jsdom has no WebGL/IntersectionObserver
// and the globe is decorative + aria-hidden anyway.)
const PAGES = [
  ['Help', <HelpPage />],
  ['Pricing', <PricingPage />],
  ['Status', <StatusPage />],
  ['Search', <SearchPage />],
  ['Changelog', <ChangelogPage />],
  ['Press', <PressPage />],
  ['Styleguide', <StyleguidePage />],
  ['NotFound', <NotFoundPage />],
  ['Compare', <ComparePage />],
  ['Leaderboard', <LeaderboardPage />],
  ['Sitemap', <SitemapPage />],
  ['Accessibility', <AccessibilityPage />],
  ['Developers', <DevelopersPage />],
  ['Glossary', <GlossaryPage />],
];

function renderPage(ui, route = '/') {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AppProvider>,
  );
}

describe('accessibility (axe)', () => {
  for (const [name, ui] of PAGES) {
    it(`${name} page has no detectable axe violations`, async () => {
      const { container } = renderPage(ui);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  }
});
