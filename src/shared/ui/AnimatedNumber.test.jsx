import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AnimatedNumber } from './AnimatedNumber';

// play=false → component renders the final value immediately (no tween),
// so the rendered text matches the parsed prefix + numeric portion + suffix.
describe('AnimatedNumber', () => {
  it('keeps the trailing suffix (e.g., "K")', () => {
    const { container } = render(<AnimatedNumber value="8.4K" play={false} />);
    expect(container.textContent).toBe('8.4K');
  });

  it('keeps a leading non-numeric prefix (e.g., Turkish "%92")', () => {
    const { container } = render(<AnimatedNumber value="%92" play={false} />);
    expect(container.textContent).toBe('%92');
  });

  it('handles a plain numeric string', () => {
    const { container } = render(<AnimatedNumber value="164" play={false} />);
    expect(container.textContent).toBe('164');
  });

  it('handles a numeric value (non-string input)', () => {
    const { container } = render(<AnimatedNumber value={27} play={false} />);
    expect(container.textContent).toBe('27');
  });
});
