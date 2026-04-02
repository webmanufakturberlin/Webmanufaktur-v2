import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHuntStore } from '@/stores/huntStore';

export const HuntHUD: React.FC = () => {
  const { foundBears, isCompleted, openSecretPage, resetHunt } = useHuntStore();
  const [showInfo, setShowInfo] = useState(false);
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-[9999] font-sans select-none">
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[110%] left-0 mb-2 bg-black/90 text-white text-xs p-4 rounded-2xl w-60 shadow-2xl border border-white/10 pointer-events-none"
          >
            <p className="font-bold mb-1 text-sm">🐻 Berliner Bär Hunt</p>
            <p className="text-white/70 leading-relaxed">
              5 Berliner Bären verstecken sich in den verschiedenen Website-Designs. Finde alle!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-2 shadow-[0_0_24px_rgba(0,0,0,0.6)]">
        {/* Bear progress icons */}
        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((id) => {
            const found = foundBears.includes(id);
            return (
              <span
                key={id}
                className="text-base leading-none transition-all duration-500"
                style={{
                  filter: found ? 'none' : 'grayscale(1) brightness(0.4)',
                  opacity: found ? 1 : 0.5,
                }}
                title={found ? `Bär #${id + 1} gefunden ✓` : `Bär #${id + 1} noch nicht gefunden`}
              >
                🐻
              </span>
            );
          })}
        </div>

        {/* Count */}
        <span className="text-white/60 text-xs font-mono min-w-[24px] text-center">
          {foundBears.length}/5
        </span>

        {/* Reward button when completed */}
        <AnimatePresence>
          {isCompleted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={openSecretPage}
              className="ml-1 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #f6d365, #fda085)' }}
            >
              🎁 Reward
            </motion.button>
          )}
        </AnimatePresence>

        {/* Info toggle */}
        <button
          onClick={() => setShowInfo((p) => !p)}
          onDoubleClick={() => setShowReset((p) => !p)}
          className="text-white/40 hover:text-white/80 text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white/20 hover:border-white/40 transition-all ml-0.5 cursor-pointer leading-none"
        >
          ?
        </button>

        {/* Reset button (shown after double-click on ?, for testing) */}
        <AnimatePresence>
          {showReset && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { resetHunt(); setShowReset(false); }}
              className="text-red-400 hover:text-red-300 text-[10px] ml-0.5 cursor-pointer font-mono"
            >
              ↺
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
