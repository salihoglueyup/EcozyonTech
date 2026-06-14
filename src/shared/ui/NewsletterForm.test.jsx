import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsletterForm from './NewsletterForm';

afterEach(() => vi.restoreAllMocks());

const mockFetch = (impl) => vi.spyOn(globalThis, 'fetch').mockImplementation(impl);

function submit(email = 'a@b.com') {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
}

describe('NewsletterForm', () => {
  it('shows a success state after a successful subscribe', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ ok: true }) }));
    render(<NewsletterForm lang="en" placeholder="Email" />);
    submit();
    expect(await screen.findByText(/Subscribed/i)).toBeInTheDocument();
  });

  it('marks the field invalid on a server error', async () => {
    mockFetch(async () => ({ ok: false, status: 500, json: async () => ({}) }));
    render(<NewsletterForm lang="en" placeholder="Email" />);
    submit();
    await waitFor(() => expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true'));
  });

  it('surfaces a rate-limit message on a 429', async () => {
    mockFetch(async () => ({ ok: false, status: 429, json: async () => ({ retryAfterMs: 30000 }) }));
    render(<NewsletterForm lang="en" placeholder="Email" />);
    submit();
    // The limited branch wires the input to a live rate-limit message.
    await waitFor(() => expect(screen.getByLabelText('Email')).toHaveAttribute('aria-describedby'));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('recovers to idle when the user edits after an error', async () => {
    mockFetch(async () => ({ ok: false, status: 500, json: async () => ({}) }));
    render(<NewsletterForm lang="en" placeholder="Email" />);
    submit();
    const input = screen.getByLabelText('Email');
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    fireEvent.change(input, { target: { value: 'new@b.com' } });
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
