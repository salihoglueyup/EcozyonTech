import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from './index';
import { ECO_I18N } from '@/core/i18n/dictionary';

const t = ECO_I18N.tr;

function setup() {
  return render(<Calculator t={t} />);
}

describe('Calculator', () => {
  it('exposes a labelled range input per lifestyle factor', () => {
    setup();
    expect(screen.getByLabelText(t.calc.car)).toHaveAttribute('type', 'range');
    expect(screen.getByLabelText(t.calc.energy)).toHaveAttribute('type', 'range');
    expect(screen.getByLabelText(t.calc.diet)).toHaveAttribute('type', 'range');
  });

  it('updates the live total when an input changes', () => {
    const { container } = setup();
    const total = container.querySelector('[aria-live="polite"]');
    const before = total.textContent;

    const car = screen.getByLabelText(t.calc.car);
    fireEvent.change(car, { target: { value: '600' } });

    expect(total.textContent).not.toBe(before); // recomputed
    expect(total.textContent).toMatch(/CO₂e/);
  });

  it('shows a potential-savings figure', () => {
    setup();
    expect(screen.getByText(t.calc.savingsNote)).toBeTruthy();
    expect(screen.getByText(/^−/)).toBeTruthy(); // savings rendered with a leading minus
  });
});
