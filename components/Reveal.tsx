import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
  variant?: 'bottom' | 'left' | 'right' | 'scale' | 'blur';
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
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
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
        default: return 'translateY(75px)';
      }
    }
    return 'translate(0) scale(1)';
  };

  const getFilter = () => {
    if (!isVisible && (variant === 'blur' || variant === 'scale')) {
      return 'blur(12px)';
    }
    return 'blur(0px)';
  };

  return (
    <div ref={ref} className={`${width === '100%' ? 'w-full' : ''} ${className} relative overflow-hidden md:overflow-visible`}>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: getTransform(),
          filter: getFilter(),
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