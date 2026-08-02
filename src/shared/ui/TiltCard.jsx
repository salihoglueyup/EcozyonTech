import React, { useRef, useState } from 'react';

export function TiltCard({ children, className = '', tiltMaxAngleX = 10, tiltMaxAngleY = 10, perspective = 1000 }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const percentX = x / width;
    const percentY = y / height;

    const tiltX = (percentY - 0.5) * tiltMaxAngleX * -2;
    const tiltY = (percentX - 0.5) * tiltMaxAngleY * 2;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ ...style, willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
