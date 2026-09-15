import React, { useRef, useState } from 'react';

/**
 * GlassCard
 * Sci-fi metallic card with subtle 3D tilt, cyber corner brackets, and emerald glow on hover
 */
export const GlassCard = ({
  children,
  className = '',
  enableTilt = true,
  glowOnHover = true,
  bracketStyle = true,
  ...props
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 5;
    const rotY = (x / (rect.width / 2)) * 5;

    setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`);
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out' }}
      className={`relative bg-gradient-to-b from-metallic-900/90 to-doom-950/95 backdrop-blur-md border border-doom-500/20 rounded-lg p-6 group transition-all duration-300 ${
        glowOnHover ? 'hover:border-doom-plasma/50 hover:shadow-[0_0_25px_rgba(0,255,136,0.2)]' : ''
      } ${className}`}
      {...props}
    >
      {/* Corner Brackets */}
      {bracketStyle && (
        <>
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-doom-plasma/50 group-hover:border-doom-plasma transition-colors" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-doom-plasma/50 group-hover:border-doom-plasma transition-colors" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-doom-plasma/50 group-hover:border-doom-plasma transition-colors" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-doom-plasma/50 group-hover:border-doom-plasma transition-colors" />
        </>
      )}

      {/* Top subtle metallic rim highlight */}
      <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-doom-plasma/30 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
