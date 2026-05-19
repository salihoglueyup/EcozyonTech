import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import { AppRoutes } from '@/app/router';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { POSTS } from '@/core/data/posts';

function renderAt(path) {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>,
  );
}

describe('routing', () => {
  it('renders the 404 page for an unknown path', async () => {
    renderAt('/definitely-not-a-route');
    expect(await screen.findByText('404')).toBeInTheDocument();
  });

  it('renders a blog post by slug param', async () => {
    const post = POSTS[0];
    renderAt(`/blog/${post.slug}`);
    expect(await screen.findByRole('heading', { level: 1, name: post.title.tr })).toBeInTheDocument();
  });

  it('handles an unknown blog slug gracefully', async () => {
    renderAt('/blog/no-such-post');
    expect(await screen.findByText(/bulunamadı/i)).toBeInTheDocument();
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
