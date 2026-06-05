import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionNav } from './SectionNav';

const sections = [
  { id: 'how', label: 'How it works' },
  { id: 'tech', label: 'Technology' },
  { id: 'faq', label: 'FAQ' },
];

beforeEach(() => {
  // jsdom doesn't implement scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
  // Target sections the nav scrolls to.
  document.body.innerHTML = '<div id="how"></div><div id="tech"></div><div id="faq"></div>';
});

describe('SectionNav', () => {
  it('renders a labelled button per section', () => {
    render(<SectionNav sections={sections} />);
    expect(screen.getByRole('navigation', { name: /navigasyon/i })).toBeInTheDocument();
    sections.forEach((s) => {
      expect(screen.getByRole('button', { name: s.label })).toBeInTheDocument();
    });
  });

  it('marks the first section active by default', () => {
    render(<SectionNav sections={sections} />);
    expect(screen.getByRole('button', { name: 'How it works' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Technology' })).not.toHaveAttribute('aria-current');
  });

  it('smooth-scrolls to a section on click', () => {
    render(<SectionNav sections={sections} />);
    fireEvent.click(screen.getByRole('button', { name: 'FAQ' }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ block: 'start' }),
    );
  });

  it('keeps inactive labels visible when alwaysLabels is set', () => {
    render(<SectionNav sections={sections} alwaysLabels />);
    // Inactive labels are dimmed-but-shown (opacity-70) rather than hidden
    // (opacity-0) so the rail reads as a table of contents.
    const inactive = screen.getByText('Technology');
    expect(inactive.className).toContain('opacity-70');
    expect(inactive.className).not.toContain('opacity-0');
  });
});
