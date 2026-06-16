import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ArrowRight, EmptyState, FilterPills, PageHeader, ResultCount, SearchInput, SectionHeader, StatusBadge } from './primitives';

describe('StatusBadge', () => {
  it('tints the label and the decorative dot with the accent colour', () => {
    const { container } = render(<StatusBadge accent="rgb(16, 185, 129)" label="Operational" />);
    const badge = screen.getByText('Operational');
    expect(badge).toHaveStyle({ color: 'rgb(16, 185, 129)' });
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toHaveStyle({ backgroundColor: 'rgb(16, 185, 129)' });
    expect(dot).toHaveClass('h-2', 'w-2', 'rounded-full');
  });

  it('allows the text size and dot size to be overridden', () => {
    const { container } = render(
      <StatusBadge accent="#000" label="Beta" className="text-[11px]" dotClassName="h-1.5 w-1.5" />,
    );
    expect(screen.getByText('Beta')).toHaveClass('text-[11px]');
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveClass('h-1.5', 'w-1.5');
  });

  it('adds a reduced-motion-aware pulse ring only when pulse is set', () => {
    const { container, rerender } = render(<StatusBadge accent="#10B981" label="Live" pulse />);
    const ping = container.querySelector('.animate-ping');
    expect(ping).toBeTruthy();
    expect(ping).toHaveClass('motion-reduce:animate-none');
    rerender(<StatusBadge accent="#10B981" label="Live" />);
    expect(container.querySelector('.animate-ping')).toBeNull();
  });
});

describe('ResultCount', () => {
  it('renders an aria-live count line with default spacing', () => {
    const { container } = render(<ResultCount>3 sonuç</ResultCount>);
    const el = container.firstChild;
    expect(el).toHaveTextContent('3 sonuç');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveClass('mb-4', 'uppercase');
  });

  it('accepts a spacing override', () => {
    const { container } = render(<ResultCount className="mt-4 mb-2">x</ResultCount>);
    expect(container.firstChild).toHaveClass('mt-4', 'mb-2');
    expect(container.firstChild).not.toHaveClass('mb-4');
  });
});

describe('EmptyState', () => {
  it('renders an eco-card box with muted text by default', () => {
    const { container } = render(<EmptyState>Sonuç yok</EmptyState>);
    const box = container.firstChild;
    expect(box).toHaveTextContent('Sonuç yok');
    expect(box).toHaveClass('eco-card', 'rounded-2xl', 'p-8', 'text-center');
  });

  it('lets the shape className be overridden', () => {
    const { container } = render(<EmptyState className="rounded-xl p-6">x</EmptyState>);
    expect(container.firstChild).toHaveClass('eco-card', 'rounded-xl', 'p-6');
    expect(container.firstChild).not.toHaveClass('text-center');
  });

  it('renders optional icon and action slots (absent by default)', () => {
    const { container, rerender } = render(<EmptyState>nothing</EmptyState>);
    expect(container.querySelector('[data-testid="ic"]')).toBeNull();
    rerender(
      <EmptyState icon={<svg data-testid="ic" />} action={<button type="button">Clear</button>}>
        nothing
      </EmptyState>,
    );
    expect(container.querySelector('[data-testid="ic"]')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });
});

describe('FilterPills', () => {
  const opts = [
    { id: 'a', label: { tr: 'Tarım', en: 'Agri' } },
    { id: 'b', label: { tr: 'Enerji', en: 'Energy' } },
  ];

  it('prepends an All pill, marks the active one, and reports ids on click', () => {
    const onChange = vi.fn();
    render(
      <FilterPills
        options={opts}
        allLabel="Hepsi"
        value={null}
        onChange={onChange}
        lang="tr"
        label="Filter"
      />,
    );
    const group = screen.getByRole('group', { name: 'Filter' });
    const pills = within(group).getAllByRole('button');
    expect(pills.map((p) => p.textContent)).toEqual(['Hepsi', 'Tarım', 'Enerji']);
    // value=null → the All pill is pressed.
    expect(pills[0]).toHaveAttribute('aria-pressed', 'true');
    expect(pills[1]).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(pills[1]);
    expect(onChange).toHaveBeenCalledWith('a');
    fireEvent.click(pills[0]);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('omits the All pill when allLabel is absent and renders children after the pills', () => {
    render(
      <FilterPills options={opts} value="b" onChange={() => {}} lang="en" label="F">
        <button type="button">Saved</button>
      </FilterPills>,
    );
    const pills = within(screen.getByRole('group', { name: 'F' })).getAllByRole('button');
    expect(pills.map((p) => p.textContent)).toEqual(['Agri', 'Energy', 'Saved']);
    // value='b' → second pill active (no All pill prepended).
    expect(pills[1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('is a single tab stop with roving tabindex + arrow/Home/End navigation', () => {
    render(
      <FilterPills options={opts} allLabel="Hepsi" value="a" onChange={() => {}} lang="tr" label="Filter" />,
    );
    const pills = within(screen.getByRole('group', { name: 'Filter' })).getAllByRole('button');
    // value='a' → the 'Tarım' pill (index 1) is the only tab stop.
    expect(pills[1]).toHaveAttribute('tabindex', '0');
    expect(pills[0]).toHaveAttribute('tabindex', '-1');
    expect(pills[2]).toHaveAttribute('tabindex', '-1');

    pills[1].focus();
    fireEvent.keyDown(pills[1], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(pills[2]);
    fireEvent.keyDown(pills[2], { key: 'ArrowRight' }); // wraps to first
    expect(document.activeElement).toBe(pills[0]);
    fireEvent.keyDown(pills[0], { key: 'End' });
    expect(document.activeElement).toBe(pills[2]);
    fireEvent.keyDown(pills[2], { key: 'Home' });
    expect(document.activeElement).toBe(pills[0]);
  });
});

describe('SearchInput', () => {
  it('renders a labelled search box and reports the raw value on change', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} placeholder="Ara…" label="Site search" />);
    const input = screen.getByRole('searchbox', { name: 'Site search' });
    expect(input).toHaveAttribute('placeholder', 'Ara…');
    fireEvent.change(input, { target: { value: 'solar' } });
    expect(onChange).toHaveBeenCalledWith('solar');
  });

  it('applies wrapper and input size overrides', () => {
    const { container } = render(
      <SearchInput value="" onChange={() => {}} label="x" className="mb-5 max-w-sm" inputClassName="py-3 text-[14px]" />,
    );
    expect(container.firstChild).toHaveClass('relative', 'mb-5', 'max-w-sm');
    expect(screen.getByRole('searchbox')).toHaveClass('py-3', 'text-[14px]');
  });

  it('shows a clear button only when non-empty, clearing on click and Escape', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SearchInput value="" onChange={onChange} label="Search" clearLabel="Clear search" />,
    );
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();

    rerender(<SearchInput value="solar" onChange={onChange} label="Search" clearLabel="Clear search" />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');

    onChange.mockClear();
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('SectionHeader', () => {
  it('renders an h2 by default', () => {
    render(<SectionHeader eyebrow="x" title="Section" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument();
  });

  it('can render as an h1 via the `as` prop (page-primary heading)', () => {
    render(<SectionHeader as="h1" eyebrow="x" title="Page" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page' })).toBeInTheDocument();
  });
});

describe('ArrowRight', () => {
  it('is decorative (aria-hidden) with sensible defaults', () => {
    const { container } = render(<ArrowRight />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('h-3.5', 'w-3.5');
    expect(svg).toHaveAttribute('stroke-width', '1.6');
  });

  it('accepts className and strokeWidth overrides', () => {
    const { container } = render(<ArrowRight className="h-3 w-3" strokeWidth={1.8} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-3', 'w-3');
    expect(svg).not.toHaveClass('h-3.5');
    expect(svg).toHaveAttribute('stroke-width', '1.8');
  });
});

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
