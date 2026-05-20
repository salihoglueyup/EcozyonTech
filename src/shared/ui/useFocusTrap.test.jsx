import { describe, it, expect } from 'vitest';
import { useRef } from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFocusTrap } from './useFocusTrap';

function Dialog({ enabled = true, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref, enabled);
  return (
    <div ref={ref} role="dialog" aria-modal="true">
      <button>first</button>
      <button>middle</button>
      <button onClick={onClose}>close</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses the first interactive element on mount', async () => {
    const { getByText } = render(<Dialog />);
    await act(async () => {});
    expect(document.activeElement).toBe(getByText('first'));
  });

  it('cycles Tab from the last back to the first', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Dialog />);
    await act(async () => {});
    getByText('close').focus();
    await user.tab();
    expect(document.activeElement).toBe(getByText('first'));
  });

  it('cycles Shift+Tab from the first to the last', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Dialog />);
    await act(async () => {});
    getByText('first').focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(getByText('close'));
  });

  it('restores focus to the previously focused element on unmount', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'open';
    document.body.appendChild(opener);
    opener.focus();
    expect(document.activeElement).toBe(opener);

    const { unmount } = render(<Dialog />);
    await act(async () => {});
    unmount();
    expect(document.activeElement).toBe(opener);
    document.body.removeChild(opener);
  });
});
