import React from 'react';

/**
 * Marquee - Infinite horizontal scrolling list
 * @param {Object} props
 * @param {React.ReactNode} props.children - Items to scroll. Will be duplicated to create the infinite effect.
 * @param {string} [props.className] - Container wrapper classes
 * @param {string} [props.speed="30s"] - Animation duration
 * @param {boolean} [props.pauseOnHover=true] - Pause animation on hover
 */
export function Marquee({ children, className = '', speed = '40s', pauseOnHover = true }) {
  return (
    <div className={`relative flex w-full overflow-hidden ${className}`}>
      <div 
        className={`flex w-max min-w-full shrink-0 animate-marquee items-center justify-around gap-4 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{ animationDuration: speed }}
      >
        {children}
      </div>
      <div 
        className={`flex w-max min-w-full shrink-0 animate-marquee items-center justify-around gap-4 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{ animationDuration: speed }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
