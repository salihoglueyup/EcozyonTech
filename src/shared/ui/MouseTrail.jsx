import React, { useEffect, useState } from 'react';

export function MouseTrail() {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    let timeoutId;
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const newDot = { x: clientX, y: clientY, id: Date.now() + Math.random() };
      
      setTrail((prev) => [...prev.slice(-15), newDot]); // keep last 15 points
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setTrail([]); // clear if mouse stops
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {trail.map((dot, i) => {
        const isLast = i === trail.length - 1;
        const opacity = (i + 1) / trail.length;
        return (
          <div
            key={dot.id}
            className="absolute rounded-full bg-cyan-400 blur-[2px] transition-opacity duration-300"
            style={{
              left: dot.x,
              top: dot.y,
              width: isLast ? 8 : 4,
              height: isLast ? 8 : 4,
              opacity: isLast ? 1 : opacity * 0.5,
              transform: 'translate(-50%, -50%)',
              boxShadow: isLast ? '0 0 10px 2px rgba(34,211,238,0.5)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
