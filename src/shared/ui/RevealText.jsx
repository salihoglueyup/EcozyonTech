import { Fragment } from 'react';
import { EASING, DURATION } from '@/core/motion';
import { useInView } from '@/shared/ui/useInView';

// RevealText — reveals a string word-by-word: each word fades + rises with a
// per-word stagger once the element scrolls into view. Reduced-motion / no-IO
// (via useInView resolving true immediately) → all words shown at once, no
// transform. The full string stays in the DOM in order (selectable + read
// normally by screen readers); spaces between words wrap naturally.
export function RevealText({
  text,
  as: Tag = 'span',
  step = 60,
  y = 14,
  duration = DURATION.reveal,
  className = '',
  ...rest
}) {
  const [ref, inView] = useInView(0.2);
  const words = String(text).split(' ');
  return (
    <Tag ref={ref} className={className} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span
            className="inline-block"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : `translateY(${y}px)`,
              transition: `opacity ${duration}ms ${EASING.out} ${i * step}ms, transform ${duration}ms ${EASING.out} ${i * step}ms`,
              willChange: inView ? 'auto' : 'opacity, transform',
            }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  );
}
