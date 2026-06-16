import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './primitives';

describe('PageHeader', () => {
  it('renders the eyebrow, an h1 title, the gradient accent and the intro', () => {
    render(
      <PageHeader
        eyebrow="Pricing"
        title="Priced for "
        titleAccent="impact"
        intro="Free during the pilot."
      />,
    );
    // Eyebrow tag prefixes the label with the "// " comment marker.
    expect(screen.getByText('// Pricing')).toBeInTheDocument();
    const h1 = screen.getByRole('heading', { level: 1 });
    // Title + accent compose without an injected space (gaps come from data).
    expect(h1).toHaveTextContent('Priced for impact');
    const accent = h1.querySelector('.eco-gradient-text');
    expect(accent).toHaveTextContent('impact');
    expect(screen.getByText('Free during the pilot.')).toBeInTheDocument();
  });

  it('omits the accent span and intro paragraph when not provided', () => {
    const { container } = render(<PageHeader eyebrow="Blog" title="Notes" />);
    expect(container.querySelector('.eco-gradient-text')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });

  it('passes className to the wrapper and lets introClassName override the width', () => {
    const { container } = render(
      <PageHeader
        eyebrow="x"
        title="t"
        intro="i"
        className="max-w-3xl mb-12"
        introClassName="max-w-xl"
      />,
    );
    expect(container.firstChild).toHaveClass('max-w-3xl', 'mb-12');
    expect(container.querySelector('p')).toHaveClass('max-w-xl');
  });
});
