import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';

import HomePage from '@/pages/Home';
import ServicesPage from '@/pages/Services';
import ImpactPage from '@/pages/Impact';
import AboutPage from '@/pages/About';
import ContactPage from '@/pages/Contact';

const pages = {
  Home: HomePage,
  Services: ServicesPage,
  Impact: ImpactPage,
  About: AboutPage,
  Contact: ContactPage,
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
});
