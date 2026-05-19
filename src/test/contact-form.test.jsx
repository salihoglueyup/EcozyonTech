import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import { Contact } from '@/features/contact';
import { ECO_I18N } from '@/core/i18n/dictionary';

const t = ECO_I18N.tr;

function setup() {
  return render(
    <AppProvider>
      <MemoryRouter>
        <Contact t={t} lang="tr" />
      </MemoryRouter>
    </AppProvider>,
  );
}

afterEach(() => vi.restoreAllMocks());

describe('Contact form', () => {
  it('submits to /api/contact and shows a success message', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText(t.contact.nameP), 'Ada Lovelace');
    await user.type(screen.getByPlaceholderText(t.contact.companyP), 'Acme');
    await user.type(screen.getByPlaceholderText(t.contact.emailP), 'ada@acme.co');
    await user.click(screen.getByRole('button', { name: new RegExp(t.contact.submit, 'i') }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/teşekkürler/i));
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }));
  });

  it('shows an error message when the API rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, errors: { email: 'invalid' } }),
    });
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText(t.contact.nameP), 'Ada');
    await user.type(screen.getByPlaceholderText(t.contact.companyP), 'Acme');
    await user.type(screen.getByPlaceholderText(t.contact.emailP), 'ada@acme.co');
    await user.click(screen.getByRole('button', { name: new RegExp(t.contact.submit, 'i') }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/gönderilemedi/i));
  });
});
