import React, { useRef, useCallback } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  gradientColor = 'rgba(59, 130, 246, 0.15)'
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 3D tilt calculation
    const tiltX = ((y - centerY) / centerY) * -4;
    const tiltY = ((x - centerX) / centerX) * 4;
    divRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;

    // Dynamic border glow
    if (borderRef.current) {
      borderRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.5), transparent 40%)`;
    }
    // Mouse-follow inner glow
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${gradientColor}, transparent 40%)`;
    }
  }, [gradientColor]);

  const handleMouseEnter = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
    if (divRef.current) {
      divRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      className={`
        card-3d relative rounded-[2rem] border border-gray-100/60 bg-white/80 backdrop-blur-xl overflow-hidden 
        group
        hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),0_0_40px_rgba(99,102,241,0.08)]
        ${className}
      `}
      style={{ transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.5s ease' }}
    >
      {/* 1. Rotating Border Beam Effect (Visible on Hover) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(99,102,241,0.6)_360deg)] animate-spin-slow opacity-30" />
      </div>

      {/* 2. Dynamic Gradient Border Mask */}
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-[2rem] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* 3. Mouse Follow Inner Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 z-10"
        style={{ opacity: 0 }}
      />

      {/* Content Container */}
      <div className="relative h-full z-20 bg-white/50 group-hover:bg-white/20 transition-colors duration-500 rounded-[2rem]">
        {children}
      </div>
    </div>
  );
};