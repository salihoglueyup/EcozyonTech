import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';

import HomePage from '@/pages/Home';
import ServicesPage from '@/pages/Services';
import PricingPage from '@/pages/Pricing';
import ImpactPage from '@/pages/Impact';
import AboutPage from '@/pages/About';
import BlogPage from '@/pages/Blog';
import CareersPage from '@/pages/Careers';
import ContactPage from '@/pages/Contact';
import LegalPage from '@/pages/Legal';

const pages = {
  Home: HomePage,
  Services: ServicesPage,
  Pricing: PricingPage,
  Impact: ImpactPage,
  About: AboutPage,
  Blog: BlogPage,
  Careers: CareersPage,
  Contact: ContactPage,
  Legal: LegalPage,
};

function renderPage(Page) {
  return render(
    <AppProvider>
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    </AppProvider>,
  );
}

describe('page smoke render', () => {
  for (const [name, Page] of Object.entries(pages)) {
    it(`${name} mounts without throwing and renders a section`, () => {
      const { container } = renderPage(Page);
      expect(container.querySelector('section')).toBeTruthy();
    });
  }

  it('Home sets the document title', () => {
    renderPage(HomePage);
    expect(document.title).toContain('Ecozyon Tech');
  });

  it('About renders the journey timeline with all milestones', () => {
    const { getByText, getAllByText } = renderPage(AboutPage);
    expect(getByText('// Yolculuğumuz')).toBeTruthy(); // eyebrow (default tr)
    expect(getByText('Kuruluş')).toBeTruthy();
    expect(getByText('Bugün')).toBeTruthy();
    expect(getAllByText('2025')).toHaveLength(2); // two milestones share 2025
  });
});
