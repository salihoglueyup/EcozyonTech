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
    // Savings render as a leading minus + mass (kg/t); preset badges use % so
    // we anchor on the unit to target the savings figure specifically.
    expect(screen.getByText(/^−[\d.]+\s(kg|t)$/)).toBeTruthy();
  });

  it('applies a quick-scenario preset to the inputs', () => {
    setup();
    const diet = screen.getByLabelText(t.calc.diet);
    expect(Number(diet.value)).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t.calc.presets.veg) }));
    expect(Number(diet.value)).toBe(0); // vegetarian week zeroes meat meals
  });
});
