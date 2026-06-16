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
import AboutPage from '@/pages/About';
import BlogPage from '@/pages/Blog';
import CasesPage from '@/pages/Cases';
import CareersPage from '@/pages/Careers';
import ContactPage from '@/pages/Contact';
import ResourcesPage from '@/pages/Resources';
import RoiPage from '@/pages/Roi';
import IntegrationsPage from '@/pages/Integrations';
import LegalPage from '@/pages/Legal';
import AssessmentPage from '@/pages/Assessment';

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
  ['About', <AboutPage />],
  ['Blog', <BlogPage />],
  ['Cases', <CasesPage />],
  ['Careers', <CareersPage />],
  ['Contact', <ContactPage />],
  ['Resources', <ResourcesPage />],
  ['Roi', <RoiPage />],
  ['Integrations', <IntegrationsPage />],
  ['Legal', <LegalPage />],
  ['Assessment', <AssessmentPage />],
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

// Heading-structure invariant: every route page owns exactly one <h1> (its
// title). Guards the shared PageHeader migration and a clean document outline.
describe('heading structure', () => {
  for (const [name, ui] of PAGES) {
    it(`${name} page renders exactly one h1`, () => {
      const { container } = renderPage(ui);
      expect(container.querySelectorAll('h1')).toHaveLength(1);
    });
  }
});
