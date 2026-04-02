import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHuntStore } from '@/stores/huntStore';

const DISCOUNT_CODE = 'BERLIN10';

// Deterministic star positions to avoid hydration mismatch
const STARS = Array.from({ length: 35 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 61 + 7) % 100}%`,
  duration: 2 + (i % 3),
  delay: (i % 5) * 0.4,
  size: i % 4 === 0 ? 2 : 1,
}));

export const SecretPage: React.FC = () => {
  const closeSecretPage = useHuntStore((s) => s.closeSecretPage);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = DISCOUNT_CODE;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99995] flex items-center justify-center p-4 font-sans overflow-auto"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0d0519 50%, #060010 100%)',
      }}
    >
      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {STARS.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.15, 0.9, 0.15] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

      <div className="relative text-center max-w-md w-full py-8">
        {/* Bear trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.15 }}
          className="text-7xl mb-5 leading-none"
        >
          🐻
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {/* Title badge */}
          <div className="inline-flex items-center gap-2 border border-yellow-500/40 text-yellow-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 bg-yellow-500/10">
            ✦ Berliner Entdecker ✦
          </div>

          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Du hast alle<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f6d365, #fda085)' }}
            >
              5 Berliner Bären
            </span>
            <br />gefunden!
          </h1>

          <p className="text-white/50 text-sm mb-8 leading-relaxed px-4">
            Als Belohnung für deine Entdeckungsreise durch alle unsere Designs erhältst du{' '}
            <span className="text-white/80 font-semibold">10 % Rabatt</span> auf dein erstes Projekt.
          </p>

          {/* Discount code box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5 mx-2">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3">Dein Rabattcode</p>
            <div className="text-3xl font-black font-mono text-white tracking-[0.25em] mb-5">
              {DISCOUNT_CODE}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={copyCode}
              className="w-full py-3 rounded-xl font-bold text-sm text-white cursor-pointer transition-all"
              style={{
                background: copied
                  ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                  : 'linear-gradient(135deg, #f6d365, #fda085)',
              }}
            >
              {copied ? '✓ Kopiert!' : '📋 Code kopieren'}
            </motion.button>
          </div>

          <p className="text-white/30 text-xs mb-6 px-4">
            Schreib uns mit dem Code:{' '}
            <span className="text-white/50 font-mono">webmanufaktur.berlin@googlemail.com</span>
          </p>

          <button
            onClick={closeSecretPage}
            className="text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer underline underline-offset-4"
          >
            Zurück zur Website
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
