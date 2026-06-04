import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the trigger and the (initially hidden) tooltip label', () => {
    render(<Tooltip label="Copy link"><button>icon</button></Tooltip>);
    expect(screen.getByRole('button', { name: 'icon' })).toBeInTheDocument();
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Copy link');
    expect(tip.className).toContain('opacity-0');
  });

  it('shows the tooltip and links it via aria-describedby on hover', () => {
    render(<Tooltip label="Copy link"><button>icon</button></Tooltip>);
    const tip = screen.getByRole('tooltip');
    const wrapper = tip.parentElement;

    fireEvent.mouseEnter(wrapper);
    expect(tip.className).toContain('opacity-100');
    expect(screen.getByRole('button', { name: 'icon' })).toHaveAttribute('aria-describedby', tip.id);

    fireEvent.mouseLeave(wrapper);
    expect(tip.className).toContain('opacity-0');
  });
});
