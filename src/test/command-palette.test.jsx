import { describe, it, expect } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import CommandPalette from '@/shared/ui/CommandPalette';

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname}</div>;
}

function setup() {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={['/']}>
        <CommandPalette />
        <LocationProbe />
      </MemoryRouter>
    </AppProvider>,
  );
}

describe('CommandPalette', () => {
  it('renders nothing until opened', () => {
    setup();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens on Ctrl/⌘+K and closes on Escape', async () => {
    setup();
    act(() => { fireEvent.keyDown(window, { key: 'k', ctrlKey: true }); });
    expect(await screen.findByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens via the ecozyon:cmdk event (navbar affordance)', async () => {
    setup();
    act(() => { window.dispatchEvent(new Event('ecozyon:cmdk')); });
    expect(await screen.findByRole('combobox')).toBeTruthy();
  });

  it('filters by query and navigates to the chosen page', async () => {
    const user = userEvent.setup();
    setup();
    act(() => { window.dispatchEvent(new Event('ecozyon:cmdk')); });

    await user.type(await screen.findByRole('combobox'), 'fiyat'); // tr: Fiyatlandırma
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    await user.click(options[0]);

    expect(screen.getByTestId('loc')).toHaveTextContent('/pricing');
    expect(screen.queryByRole('dialog')).toBeNull(); // closes after navigating
  });

  it('shows a no-results message for an unmatched query', async () => {
    const user = userEvent.setup();
    setup();
    act(() => { window.dispatchEvent(new Event('ecozyon:cmdk')); });
    await user.type(await screen.findByRole('combobox'), 'zzzznotfound');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText(/sonuç bulunamadı/i)).toBeTruthy();
  });
});
