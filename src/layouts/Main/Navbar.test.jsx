import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppProvider';
import Navbar from '@/layouts/Main/Navbar';

function setup() {
  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    </AppProvider>,
  );
  // The mega-menu triggers are the buttons that own a popup.
  const triggers = screen
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-haspopup') === 'true');
  // Pick the first group that has at least two items (needed for roving tests).
  return triggers[0];
}

describe('Navbar mega-menu keyboard a11y', () => {
  it('trigger advertises a controllable popup that starts collapsed', () => {
    const trigger = setup();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('ArrowDown opens the menu and focuses the first item', async () => {
    const trigger = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const menu = await screen.findByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(document.activeElement).toBe(items[0]));
  });

  it('ArrowUp opens the menu and focuses the last item', async () => {
    const trigger = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    const menu = await screen.findByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    await waitFor(() => expect(document.activeElement).toBe(items.at(-1)));
  });

  it('roves with ArrowDown/ArrowUp/Home/End', async () => {
    const trigger = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const menu = await screen.findByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);

    fireEvent.keyDown(items[1], { key: 'End' });
    expect(document.activeElement).toBe(items.at(-1));

    // Wraps from last back to first.
    fireEvent.keyDown(items.at(-1), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]);

    fireEvent.keyDown(items[0], { key: 'End' });
    fireEvent.keyDown(items.at(-1), { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);
  });

  it('Escape closes the menu and restores focus to the trigger', async () => {
    const trigger = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const menu = await screen.findByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    fireEvent.keyDown(items[0], { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
