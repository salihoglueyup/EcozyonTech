import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import CareersPage from '@/pages/Careers';
import { ECO_I18N } from '@/core/i18n/dictionary';
import { JOBS } from '@/core/data/jobs';

const t = ECO_I18N.tr;
const c = t.careers;

function setup() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <CareersPage />
      </MemoryRouter>
    </AppProvider>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('Careers apply modal', () => {
  it('opens the apply dialog for a job with its title in the heading', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getAllByRole('button', { name: c.apply })[0]);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent(JOBS[0].title.tr);
  });

  it('submits to /api/apply with the role and shows success', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole('button', { name: c.apply })[0]);
    await user.type(screen.getByPlaceholderText(c.nameP), 'Grace Hopper');
    await user.type(screen.getByPlaceholderText(c.emailP), 'grace@navy.mil');
    await user.click(screen.getByRole('button', { name: new RegExp(c.submit, 'i') }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/alındı/i));
    expect(fetchMock).toHaveBeenCalledWith('/api/apply', expect.objectContaining({ method: 'POST' }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.role).toBe(JOBS[0].title.en); // canonical English role
    expect(sent.name).toBe('Grace Hopper');
  });

  it('shows an error message when the API rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, errors: { email: 'invalid' } }),
    });
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole('button', { name: c.apply })[0]);
    await user.type(screen.getByPlaceholderText(c.nameP), 'Ada');
    await user.type(screen.getByPlaceholderText(c.emailP), 'ada@x.co');
    await user.click(screen.getByRole('button', { name: new RegExp(c.submit, 'i') }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/gönderilemedi/i));
  });
});
