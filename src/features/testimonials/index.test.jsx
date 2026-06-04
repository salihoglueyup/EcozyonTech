import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Testimonials } from './index';
import { ECO_I18N } from '@/core/i18n/dictionary';

const t = ECO_I18N.tr;
const items = t.testimonials.items;

afterEach(() => vi.useRealTimers());

describe('Testimonials', () => {
  it('renders the first testimonial by default', () => {
    render(<Testimonials t={t} />);
    expect(screen.getByText(items[0].quote, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(items[0].name)).toBeInTheDocument();
  });

  it('shows the selected testimonial when its dot is clicked', () => {
    render(<Testimonials t={t} />);
    fireEvent.click(screen.getByLabelText('Testimonial 2'));
    expect(screen.getByText(items[1].quote, { exact: false })).toBeInTheDocument();
  });

  it('auto-rotates to the next testimonial after the interval', () => {
    vi.useFakeTimers();
    render(<Testimonials t={t} />);
    expect(screen.getByText(items[0].quote, { exact: false })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText(items[1].quote, { exact: false })).toBeInTheDocument();
  });

  it('renders nothing when there is no testimonial data', () => {
    const { container } = render(<Testimonials t={{}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
