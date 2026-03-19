import React, { useRef, useCallback, useState } from 'react';
import { useAnimationFrame } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  gradientColor = 'rgba(59, 130, 246, 0.15)',
  onMouseEnter,
  onMouseLeave
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRotateRef1 = useRef<HTMLDivElement>(null);
  const borderRotateRef2 = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // JS-driven border rotation — works in all browsers (replaces @property --border-angle)
  useAnimationFrame((time) => {
    if (!isCardHovered) return;
    const angle = (time / 1000 * 120) % 360;
    const gradient = `conic-gradient(from ${angle}deg, #3b82f6, #8b5cf6, #ec4899, #f97316, #3b82f6)`;
    if (borderRotateRef1.current) borderRotateRef1.current.style.background = gradient;
    if (borderRotateRef2.current) borderRotateRef2.current.style.background = gradient;
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 2D Magnetic logic
    const magneticX = ((x - centerX) / centerX) * 8;
    const magneticY = ((y - centerY) / centerY) * 12;
    divRef.current.style.transform = `translate(${magneticX}px, ${magneticY}px) scale(1.02)`;

    // Dynamic border glow
    if (borderRef.current) {
      borderRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.5), transparent 40%)`;
    }
    // Mouse-follow inner glow
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${gradientColor}, transparent 40%)`;
    }
  }, [gradientColor]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsCardHovered(true);
    if (glowRef.current) glowRef.current.style.opacity = '1';
    if (onMouseEnter) onMouseEnter();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsCardHovered(false);
    if (glowRef.current) glowRef.current.style.opacity = '0';
    if (divRef.current) {
      divRef.current.style.transform = 'translate(0px, 0px) scale(1)';
    }
    if (onMouseLeave) onMouseLeave();
  }, [onMouseLeave]);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      className={`
        relative rounded-[2rem] border border-gray-300 bg-white backdrop-blur-xl overflow-hidden
        shadow-[0_4px_24px_rgba(0,0,0,0.1)]
        group
        hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15),0_0_40px_rgba(99,102,241,0.12)]
        ${className}
      `}
      style={{
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.5s ease, border-color 0.5s ease',
        willChange: 'transform',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(59,130,246,0.9)_320deg,rgba(139,92,246,1)_340deg,rgba(249,115,22,0.9)_355deg,transparent_360deg)] animate-spin-slow opacity-80" />
      </div>

      {/* Outer blurred intense aura — JS-driven rotation */}
      <div
        ref={borderRotateRef2}
        className="absolute -inset-2 rounded-[2.5rem] p-[4px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-[1] blur-xl"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f97316, #3b82f6)'
        }}
      />

      {/* Main thicker vibrant border layer — JS-driven rotation */}
      <div
        ref={borderRotateRef1}
        className="absolute inset-0 rounded-[2rem] p-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[5]"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f97316, #3b82f6)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* 3. Dynamic Gradient Border Mask (mouse-follow) */}
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

      {/* 4. Mouse Follow Inner Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 z-10"
        style={{ opacity: 0 }}
      />

      {/* Content Container */}
      <div className="relative h-full z-20 bg-white/70 group-hover:bg-white/20 transition-colors duration-500 rounded-[2rem]">
        {children}
      </div>
    </div>
  );
};
