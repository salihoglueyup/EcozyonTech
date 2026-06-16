import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('is an accessible status spinner with size + ring overrides', () => {
    render(<Spinner size="h-3 w-3" className="border-white/40 border-t-white" label="Sending" />);
    const sp = screen.getByRole('status', { name: 'Sending' });
    expect(sp).toHaveClass('h-3', 'w-3', 'animate-spin', 'rounded-full', 'border-t-white');
  });

  it('defaults to an h-4 w-4 "Loading" spinner', () => {
    render(<Spinner />);
    const sp = screen.getByRole('status', { name: 'Loading' });
    expect(sp).toHaveClass('h-4', 'w-4', 'animate-spin');
  });
});
