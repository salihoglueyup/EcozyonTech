import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import { AppRoutes } from '@/app/router';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

describe('routing', () => {
  it('renders the 404 page for an unknown path', async () => {
    render(
      <AppProvider>
        <MemoryRouter initialEntries={['/definitely-not-a-route']}>
          <AppRoutes />
        </MemoryRouter>
      </AppProvider>,
    );
    expect(await screen.findByText('404')).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  it('renders a fallback when a child throws', () => {
    const Boom = () => {
      throw new Error('boom');
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <AppProvider>
        <MemoryRouter>
          <ErrorBoundary>
            <Boom />
          </ErrorBoundary>
        </MemoryRouter>
      </AppProvider>,
    );
    expect(screen.getByText(/something went wrong|bir şeyler ters gitti/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
