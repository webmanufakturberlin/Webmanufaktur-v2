import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
  variant?: 'bottom' | 'left' | 'right' | 'scale' | 'blur' | 'clip-up' | 'clip-left' | 'rotate-in' | 'parallax-up';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = 'fit-content',
  delay = 0,
  className = "",
  variant = 'bottom'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Bidirectional: true when entering, false when leaving
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (variant) {
        case 'bottom': return 'translateY(75px)';
        case 'left': return 'translateX(-75px)';
        case 'right': return 'translateX(75px)';
        case 'scale': return 'scale(0.9)';
        case 'blur': return 'scale(1.05)';
        case 'clip-up': return 'translateY(40px)';
        case 'clip-left': return 'translateX(-40px)';
        case 'rotate-in': return 'perspective(1200px) rotateY(-25deg) translateX(-40px)';
        case 'parallax-up': return 'translateY(120px) scale(0.95)';
        default: return 'translateY(75px)';
      }
    }
    return 'translate(0) scale(1) rotateY(0deg)';
  };

  const getFilter = () => {
    if (!isVisible && (variant === 'blur' || variant === 'scale')) {
      return 'blur(12px)';
    }
    return 'blur(0px)';
  };

  const getClipPath = () => {
    if (!isVisible) {
      if (variant === 'clip-up') return 'inset(100% 0 0 0)';
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
          transition: 'all 1200ms cubic-bezier(0.25, 1, 0.3, 1)',
          transitionDelay: `${delay}s`,
          willChange: isVisible ? 'auto' : 'transform, opacity, filter',
        }}
      >
        {children}
      </div>
    </div>
  );
};
