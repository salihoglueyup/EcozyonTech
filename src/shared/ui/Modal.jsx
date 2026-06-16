import { useEffect, useRef } from 'react';
import { useFocusTrap } from '@/shared/ui/useFocusTrap';

// Accessible modal shell: a fixed overlay + click-to-dismiss backdrop + a
// focus-trapped `role=dialog` panel that closes on Escape. Mount it
// conditionally — it's "open" whenever rendered, and unmounting restores focus
// to the opener via useFocusTrap. The caller styles the panel (`className`) and
// may override the overlay alignment/padding (`overlayClassName`), the backdrop
// (`backdropClassName`) and the stacking context (`z`). Labelling: pass
// `labelledBy`/`describedBy` (ids inside the panel) or a plain `label`. Locks
// background scroll while open (`lockScroll`, default on).
export function Modal({
  onClose,
  className = '',
  overlayClassName = 'flex items-center justify-center p-4',
  backdropClassName = 'bg-slate-900/40 backdrop-blur-sm',
  z = 'z-[100]',
  labelledBy,
  describedBy,
  label,
  lockScroll = true,
  children,
}) {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [lockScroll]);

  return (
    <div className={`fixed inset-0 ${z} ${overlayClassName}`.trim()}>
      <div className={`absolute inset-0 ${backdropClassName}`.trim()} aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-label={label}
        className={className}
      >
        {children}
      </div>
    </div>
  );
}
