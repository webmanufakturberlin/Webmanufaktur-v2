import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHuntStore } from '@/stores/huntStore';

export const ClueModal: React.FC = () => {
  const { pendingClue, dismissClue, openSecretPage, foundBears } = useHuntStore();

  const handleAction = () => {
    dismissClue();
    if (pendingClue?.isLast) {
      openSecretPage();
    }
  };

  return (
    <AnimatePresence>
      {pendingClue && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99990]"
            onClick={!pendingClue.isLast ? handleAction : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="fixed inset-0 flex items-center justify-center z-[99991] p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center pointer-events-auto">
              {/* Animated bear */}
              <motion.div
                animate={{ rotate: [0, -12, 12, -12, 0] }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="text-6xl mb-4 leading-none"
              >
                🐻
              </motion.div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                ✓ Berliner Bär gefunden! ({foundBears.length}/5)
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                {pendingClue.isLast ? '🎉 Alle Bären entdeckt!' : `Bär #${pendingClue.bearId + 1} entdeckt!`}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {pendingClue.clue}
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAction}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm cursor-pointer"
                style={{
                  background: pendingClue.isLast
                    ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {pendingClue.isLast ? '🎁 Zur Geheimseite!' : 'Weiter suchen →'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
