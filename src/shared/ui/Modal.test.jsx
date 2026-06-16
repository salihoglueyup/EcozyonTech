import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

afterEach(() => {
  document.body.style.overflow = '';
});

function open(props = {}) {
  const onClose = vi.fn();
  render(
    <Modal onClose={onClose} label="Test dialog" {...props}>
      <button>First</button>
      <button>Second</button>
    </Modal>,
  );
  return { onClose, dialog: screen.getByRole('dialog') };
}

describe('Modal', () => {
  it('renders an aria-modal dialog and focuses the first element', () => {
    const { dialog } = open();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Test dialog');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First' }));
  });

  it('closes on Escape and on backdrop click', () => {
    const { onClose, dialog } = open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    // The backdrop is the dialog's previous sibling (aria-hidden overlay).
    fireEvent.click(dialog.previousSibling);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('locks body scroll while open and restores it on unmount', () => {
    const { unmount } = render(
      <Modal onClose={() => {}} label="x"><button>ok</button></Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('leaves scroll untouched when lockScroll is false', () => {
    render(<Modal onClose={() => {}} label="x" lockScroll={false}><button>ok</button></Modal>);
    expect(document.body.style.overflow).toBe('');
  });
});
