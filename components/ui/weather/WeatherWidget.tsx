import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../../../stores/weatherStore';
import type { WeatherCondition } from '../../../types';

// Simple SVG weather icons
const WeatherIcon: React.FC<{ condition: WeatherCondition; isNight: boolean; size?: number }> = ({ condition, isNight, size = 20 }) => {
  const s = size;
  const half = s / 2;

  switch (condition) {
    case 'clear':
      if (isNight) {
        // Moon
        return (
          <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      }
      // Sun
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case 'clouds_few':
    case 'clouds_heavy':
      // Cloud
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      );
    case 'rain':
    case 'drizzle':
      // Cloud with rain
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M16 13V4a2 2 0 0 0-4 0" opacity="0" />
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          <line x1="8" y1="21" x2="8" y2="23" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="16" y1="21" x2="16" y2="23" />
        </svg>
      );
    case 'snow':
      // Snowflake
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      );
    case 'thunderstorm':
      // Lightning bolt
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          <path d="M13 11l-2 4h3l-2 4" />
        </svg>
      );
    case 'fog':
      // Fog lines
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="8" x2="21" y2="8" /><line x1="5" y1="12" x2="19" y2="12" /><line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      );
    default:
      return null;
  }
};

export default function WeatherWidget() {
  const raw = useWeatherStore(s => s.raw);
  const weatherCondition = useWeatherStore(s => s.weatherCondition);
  const isNight = useWeatherStore(s => s.isNight);

  return (
    <AnimatePresence>
      {raw && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`
            absolute top-4 right-4 z-20
            flex items-center gap-2 px-3 py-1.5 rounded-full
            backdrop-blur-md border
            ${isNight
              ? 'bg-white/10 border-white/20 text-white/90'
              : 'bg-black/10 border-black/10 text-gray-800'
            }
            text-sm font-medium tracking-tight
            pointer-events-auto select-none
          `}
        >
          <WeatherIcon condition={weatherCondition} isNight={isNight} size={18} />
          <span>{raw.temp}°C</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
