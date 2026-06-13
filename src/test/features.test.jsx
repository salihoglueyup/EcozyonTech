import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import { ECO_I18N } from '@/core/i18n/dictionary';

import { Metrics } from '@/features/metrics';
import { UseCases } from '@/features/use-cases';
import { HowItWorks } from '@/features/how-it-works';
import { AboutBento } from '@/features/about';
import { TechEcosystem } from '@/features/tech-ecosystem';

// Render smoke tests for the non-3D home/feature sections (previously excluded
// from coverage). They take the dictionary as a prop; we render each within the
// app providers + a router and assert it produces a real section with a heading.
const t = ECO_I18N.tr;
const renderFeature = (ui) =>
  render(
    <AppProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AppProvider>,
  );

const CASES = [
  ['Metrics', <Metrics t={t} />],
  ['UseCases', <UseCases t={t} lang="tr" />],
  ['HowItWorks', <HowItWorks t={t} lang="tr" />],
  ['AboutBento', <AboutBento t={t} lang="tr" />],
  ['TechEcosystem', <TechEcosystem t={t} lang="tr" />],
];

describe('feature sections render', () => {
  for (const [name, ui] of CASES) {
    it(`${name} renders a section with a heading`, () => {
      const { container } = renderFeature(ui);
      expect(container.querySelector('section'), `${name} section`).toBeTruthy();
      expect(container.querySelector('h1, h2, h3'), `${name} heading`).toBeTruthy();
      expect(container.textContent.trim().length).toBeGreaterThan(30);
    });
  }

  it('Metrics shows its title text', () => {
    const { container } = renderFeature(<Metrics t={t} />);
    expect(container.textContent).toContain(t.metrics.title);
  });
});
