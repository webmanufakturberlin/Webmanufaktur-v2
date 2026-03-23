import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '../store';

export const LiquidCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { cursorState } = useStore();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (cursorState === 'hover') {
      gsap.to(cursor, {
        scale: 4,
        backgroundColor: 'transparent',
        border: '1px solid #09090B',
        backdropFilter: 'invert(1)',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else if (cursorState === 'hidden') {
      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
      });
    } else {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: '#09090B',
        border: 'none',
        backdropFilter: 'none',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [cursorState]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#09090B] pointer-events-none z-[9999] mix-blend-difference"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
};
