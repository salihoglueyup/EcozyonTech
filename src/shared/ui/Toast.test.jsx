import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './Toast';

function Trigger({ opts }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast(opts)}>
      go
    </button>
  );
}

function setup(opts) {
  render(
    <ToastProvider>
      <Trigger opts={opts} />
    </ToastProvider>,
  );
  act(() => {
    fireEvent.click(screen.getByText('go'));
  });
}

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('success toast draws in the SuccessCheck', () => {
    setup({ message: 'Saved', type: 'success', duration: 0 });
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Saved');
    expect(status.querySelector('path.animate-drawCheck')).not.toBeNull();
  });

  it('animates out (animate-leave) then removes on dismiss', () => {
    setup({ message: 'Bye', type: 'info', duration: 0 });
    const status = screen.getByRole('status');
    expect(status.className).toContain('animate-enter');

    act(() => {
      fireEvent.click(screen.getByLabelText('Dismiss'));
    });
    // Still mounted, now playing the exit animation.
    expect(screen.getByRole('status').className).toContain('animate-leave');

    act(() => vi.advanceTimersByTime(220));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('renders a countdown bar only when duration > 0', () => {
    setup({ message: 'Timed', type: 'info', duration: 4000 });
    expect(screen.getByRole('status').querySelector('.animate-countdown')).not.toBeNull();
  });

  it('renders no countdown bar for a sticky toast (duration 0)', () => {
    setup({ message: 'Sticky', type: 'info', duration: 0 });
    expect(screen.getByRole('status').querySelector('.animate-countdown')).toBeNull();
  });

  it('auto-dismisses after its duration', () => {
    setup({ message: 'Auto', type: 'info', duration: 1000 });
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000)); // duration elapses → leaving
    expect(screen.getByRole('status').className).toContain('animate-leave');
    act(() => vi.advanceTimersByTime(220)); // exit animation → removed
    expect(screen.queryByRole('status')).toBeNull();
  });
});
