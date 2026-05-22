import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import BackToTop from './BackToTop';

function setScrollY(y) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
}

afterEach(() => {
  setScrollY(0);
  vi.restoreAllMocks();
});

describe('BackToTop', () => {
  it('is hidden until the scroll passes the threshold', () => {
    setScrollY(0);
    render(<BackToTop label="Back to top" threshold={600} />);
    expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();

    setScrollY(700);
    act(() => { fireEvent.scroll(window); });
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeTruthy();
  });

  it('scrolls to the top when clicked', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    setScrollY(900);
    render(<BackToTop label="Back to top" threshold={600} />);
    act(() => { fireEvent.scroll(window); });

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
  });
});
