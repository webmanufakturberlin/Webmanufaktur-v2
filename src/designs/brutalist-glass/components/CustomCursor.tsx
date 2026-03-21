import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { isHoveringInteractive } = useAppStore();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center mix-blend-difference ${
        isHoveringInteractive ? 'scale-[3] bg-white' : 'scale-100 border-2 border-[#CCFF00] bg-transparent'
      }`}
    >
        {isHoveringInteractive && <div className="w-1 h-1 bg-black rounded-full" />}
    </div>
  );
};
