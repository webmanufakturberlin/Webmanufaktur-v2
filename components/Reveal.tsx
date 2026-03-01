import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
  variant?: 'bottom' | 'left' | 'right' | 'scale' | 'blur' | 'clip-up' | 'clip-left' | 'rotate-in' | 'parallax-up';
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = 'fit-content',
  delay = 0,
  className = "",
  variant = 'bottom',
  once = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (once && hasAnimated.current) return;
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (once) hasAnimated.current = true;
      } else if (!once) {
        setIsVisible(false);
      }
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -10% 0px',
    });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [once]);

  const getTransform = () => {
    if (!isVisible) {
      switch (variant) {
        case 'bottom':      return 'translateY(35px)';
        case 'left':        return 'translateX(-35px)';
        case 'right':       return 'translateX(35px)';
        case 'scale':       return 'scale(0.95)';
        case 'blur':        return 'scale(1.02)';
        case 'clip-up':     return 'translateY(20px)';
        case 'clip-left':   return 'translateX(-20px)';
        case 'rotate-in':   return 'perspective(1200px) rotateY(-12deg) translateX(-15px)';
        case 'parallax-up': return 'translateY(50px) scale(0.97)';
        default:            return 'translateY(60px)';
      }
    }
    return 'translate(0) scale(1) rotateY(0deg)';
  };

  const getFilter = () => {
    if (!isVisible && (variant === 'blur' || variant === 'scale')) {
      return 'blur(10px)';
    }
    return 'blur(0px)';
  };

  const getClipPath = () => {
    if (!isVisible) {
      if (variant === 'clip-up')   return 'inset(100% 0 0 0)';
      if (variant === 'clip-left') return 'inset(0 100% 0 0)';
    }
    return 'inset(0 0 0 0)';
  };

  const isClipVariant = variant === 'clip-up' || variant === 'clip-left';

  return (
    <div ref={ref} className={`${width === '100%' ? 'w-full' : ''} ${className} relative overflow-hidden md:overflow-visible`}>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: getTransform(),
          filter: getFilter(),
          ...(isClipVariant ? { clipPath: getClipPath() } : {}),
          // In animation: respect delay for enter
          // Out animation: no delay — reverse fires immediately and smoothly
          transition: isVisible
            ? `all 700ms cubic-bezier(0.25, 1, 0.3, 1) ${delay}s`
            : 'all 500ms cubic-bezier(0.4, 0, 0.6, 1) 0s',
          willChange: isVisible ? 'auto' : 'transform, opacity, filter',
        }}
      >
        {children}
      </div>
    </div>
  );
};
