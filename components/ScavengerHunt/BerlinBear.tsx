import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHuntStore } from '@/stores/huntStore';

interface BerlinBearProps {
  bearId: number;
  className?: string;
  style?: React.CSSProperties;
  alwaysVisible?: boolean;
}

const BearSVG: React.FC<{ found: boolean }> = ({ found }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Ears */}
    <circle cx="11" cy="12" r="6" fill={found ? '#c0392b' : '#555'} />
    <circle cx="29" cy="12" r="6" fill={found ? '#c0392b' : '#555'} />
    <circle cx="11" cy="12" r="3.5" fill={found ? '#e74c3c' : '#777'} />
    <circle cx="29" cy="12" r="3.5" fill={found ? '#e74c3c' : '#777'} />
    {/* Head */}
    <circle cx="20" cy="23" r="13" fill={found ? '#c0392b' : '#555'} />
    {/* Snout */}
    <ellipse cx="20" cy="27.5" rx="5.5" ry="4" fill={found ? '#922b21' : '#444'} />
    {/* Eyes */}
    <circle cx="15.5" cy="20" r="2.5" fill="white" />
    <circle cx="24.5" cy="20" r="2.5" fill="white" />
    <circle cx="16" cy="20.5" r="1.5" fill={found ? '#1a1a2e' : '#222'} />
    <circle cx="25" cy="20.5" r="1.5" fill={found ? '#1a1a2e' : '#222'} />
    {/* Nose */}
    <ellipse cx="20" cy="25.5" rx="2.5" ry="2" fill={found ? '#1a1a2e' : '#222'} />
    {/* Shine on eyes */}
    {found && (
      <>
        <circle cx="16.8" cy="19.8" r="0.6" fill="white" opacity="0.8" />
        <circle cx="25.8" cy="19.8" r="0.6" fill="white" opacity="0.8" />
      </>
    )}
  </svg>
);

export const BerlinBear: React.FC<BerlinBearProps> = ({ bearId, className = '', style, alwaysVisible }) => {
  const { foundBears, findBear } = useHuntStore();
  const [justFound, setJustFound] = useState(false);
  const isFound = foundBears.includes(bearId);

  const handleClick = () => {
    if (isFound || alwaysVisible) return;
    setJustFound(true);
    findBear(bearId);
    setTimeout(() => setJustFound(false), 800);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-10 h-10 rounded-full p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${className}`}
      style={{
        cursor: isFound || alwaysVisible ? 'default' : 'pointer',
        filter: isFound ? 'drop-shadow(0 0 8px rgba(192,57,43,0.7))' : undefined,
        ...style,
      }}
      animate={{
        opacity: alwaysVisible ? 1 : (isFound ? 1 : 0.18),
        scale: justFound ? [1, 1.5, 1] : 1,
      }}
      whileHover={!isFound && !alwaysVisible ? { opacity: 0.85, scale: 1.15 } : {}}
      transition={{ duration: 0.35 }}
      aria-label={isFound ? `Berliner Bär #${bearId + 1} bereits gefunden` : 'Versteckter Berliner Bär'}
      title={isFound ? `🐻 Bär #${bearId + 1} gefunden!` : ''}
    >
      <div className="relative w-full h-full">
        <BearSVG found={isFound} />
        {isFound && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-md"
            style={{ fontSize: '8px' }}
          >
            ✓
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
