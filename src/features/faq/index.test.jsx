import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQ } from './index';
import { ECO_I18N } from '@/core/i18n/dictionary';

const t = ECO_I18N.tr;
const items = t.faq.items;

describe('FAQ', () => {
  it('renders every question as a toggle button', () => {
    render(<FAQ t={t} />);
    items.forEach((item) => {
      expect(screen.getByRole('button', { name: item.q })).toBeInTheDocument();
    });
  });

  it('toggles aria-expanded when a question is clicked', () => {
    render(<FAQ t={t} />);
    const btn = screen.getByRole('button', { name: items[0].q });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders nothing without faq data', () => {
    const { container } = render(<FAQ t={{}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
