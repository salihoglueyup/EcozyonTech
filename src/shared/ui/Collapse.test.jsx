import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Collapse, Disclosure } from './Collapse';

describe('Collapse', () => {
  it('open → 1fr rows + full opacity; closed → 0fr + opacity 0', () => {
    const { container, rerender } = render(
      <Collapse open>
        <p>body</p>
      </Collapse>,
    );
    const grid = container.firstChild;
    expect(grid.style.gridTemplateRows).toBe('1fr');
    expect(grid.style.opacity).toBe('1');

    rerender(
      <Collapse open={false}>
        <p>body</p>
      </Collapse>,
    );
    expect(grid.style.gridTemplateRows).toBe('0fr');
    expect(grid.style.opacity).toBe('0');
  });
});

describe('Disclosure', () => {
  it('renders summary + children and toggles aria-expanded on click', () => {
    render(<Disclosure summary="Question?">Answer.</Disclosure>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Question?')).toBeInTheDocument();
    expect(screen.getByText('Answer.')).toBeInTheDocument();

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts expanded with defaultOpen', () => {
    render(<Disclosure summary="Q" defaultOpen>A</Disclosure>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders the aside slot in the header row', () => {
    render(
      <Disclosure summary="Q" aside={<a href="#x" data-testid="link">#</a>}>
        A
      </Disclosure>,
    );
    expect(screen.getByTestId('link')).toBeInTheDocument();
  });
});
