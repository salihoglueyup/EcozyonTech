import { Children, cloneElement, isValidElement } from 'react';
import { useInView } from '@/shared/ui/useInView';

// Drawable SVG shapes whose stroke we normalize + draw in.
const SHAPES = new Set(['path', 'line', 'circle', 'polyline', 'polygon', 'rect', 'ellipse']);

// AnimatedIcon — draws a line icon's strokes in when it scrolls into view,
// generalizing the SuccessCheck stroke-draw to any inline SVG. Pass a single
// <svg> as the child; every drawable shape (even nested in <g>) gets
// pathLength="1" injected so the .eco-draw dash math is length-independent — no
// hand-annotating the icon. The `is-drawn` class (added in-view) triggers the
// draw; `stagger` cascades the shapes. Reduced-motion / no-IO (via useInView
// resolving true immediately) → drawn at once. Decorative by default; set
// `label` to expose it (role=img + aria-label).
export function AnimatedIcon({ children, className = '', stagger = 0, threshold = 0.4, label }) {
  const [ref, inView] = useInView(threshold);
  const svg = Children.only(children);

  let shapeIndex = 0;
  const decorate = (node) => {
    if (!isValidElement(node)) return node;
    const kids =
      node.props.children != null ? Children.map(node.props.children, decorate) : node.props.children;
    if (typeof node.type === 'string' && SHAPES.has(node.type)) {
      const delay = stagger ? { transitionDelay: `${shapeIndex++ * stagger}ms` } : null;
      return cloneElement(
        node,
        { pathLength: 1, ...(delay ? { style: { ...node.props.style, ...delay } } : null) },
        kids,
      );
    }
    return cloneElement(node, undefined, kids);
  };

  const drawClass = `eco-draw ${inView ? 'is-drawn' : ''}`.trim();
  return cloneElement(
    svg,
    {
      ref,
      className: `${svg.props.className || ''} ${drawClass} ${className}`.replace(/\s+/g, ' ').trim(),
      ...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }),
    },
    Children.map(svg.props.children, decorate),
  );
}
