import React, { useRef, useCallback } from 'react';
import { ArrowUpRight, ExternalLink, TrendingUp, Eye } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';
import { motion } from 'framer-motion';

// --- Icon animations use Framer Motion variants propagated from parent ---

const arrowVariants = {
    idle: { y: 0, scale: 1, rotate: 0 },
    hovered: {
        y: [0, -10, -4, 0],
        scale: [1, 1.25, 1.1, 1],
        rotate: [0, -12, -6, 0],
        transition: { duration: 0.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.3 },
    },
};

const clockHourVariants = {
    idle: { rotate: 0 },
    hovered: {
        rotate: 360,
        transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
    },
};

const clockMinuteVariants = {
    idle: { rotate: 0 },
    hovered: {
        rotate: 360,
        transition: { duration: 0.35, repeat: Infinity, ease: 'linear' },
    },
};

const eyeVariants = {
    idle: { rotateY: 0, scaleY: 1 },
    hovered: {
        rotateY: [0, -25, 25, 0, 0],
        scaleY: [1, 1, 1, 1, 0.08, 1],
        transition: {
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.7, 0.85, 1],
        },
    },
};

const cardVariants = {
    idle: {},
    hovered: {},
};

// --- MagneticTiltCard: 3D tilt + magnetic drag + glow on hover ---
const MagneticTiltCard: React.FC<{
    children: React.ReactNode;
    className: string;
    glowColor: string;
    borderColor: string;
}> = ({ children, className, glowColor, borderColor }) => {
    const ref = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -10;
        const rotateY = (x - 0.5) * 10;
        // Magnetic drag: translate towards cursor (max ~8px)
        const dragX = (x - 0.5) * 16;
        const dragY = (y - 0.5) * 12;
        ref.current.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${dragX}px, ${dragY}px) translateY(-6px) scale(1.02)`;

        if (glowRef.current) {
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            glowRef.current.style.background = `radial-gradient(400px circle at ${px}px ${py}px, ${glowColor}, transparent 40%)`;
            glowRef.current.style.opacity = '1';
        }
    }, [glowColor]);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translate(0, 0) scale(1)';
        if (glowRef.current) {
            glowRef.current.style.opacity = '0';
        }
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
            }}
        >
            {/* Animated gradient border on hover */}
            <div
                className="absolute inset-0 rounded-3xl p-[2px] opacity-0 hover-parent-glow transition-opacity duration-500 pointer-events-none z-0 glow-border-rotate"
                style={{
                    background: `conic-gradient(from var(--border-angle, 0deg), ${borderColor}, transparent 40%, ${borderColor})`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                }}
            />
            <div
                ref={glowRef}
                className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500 z-0"
                style={{ opacity: 0 }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export const ImpactData: React.FC = () => {
    const { t } = useI18n();

    return (
        <section className="relative z-20 py-24 bg-white/60 border-b border-gray-100 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    <div className="md:w-1/3">
                        <Reveal variant="left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                                <TrendingUp size={12} aria-hidden="true" />
                                {t('impact.badge')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6">
                                {t('impact.headline1')}<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">{t('impact.headline2')}</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 font-light text-lg">
                                {t('impact.desc')}
                            </p>
                            <a href="https://credibility.stanford.edu/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-gray-300 underline-offset-4 hover:decoration-blue-500 transition-all hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                                {t('impact.source')} <ExternalLink size={12} aria-hidden="true" />
                            </a>
                        </Reveal>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Card 1 — Arrow bounce */}
                        <Reveal delay={0.1} variant="parallax-up">
                            <MagneticTiltCard
                                className="bg-gradient-to-br from-white to-purple-50/40 p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-2 border-purple-300 hover:shadow-[0_8px_30px_rgba(147,51,234,0.25)] hover:border-purple-500 transition-[box-shadow,border-color] duration-300 cursor-default h-full relative overflow-hidden"
                                glowColor="rgba(147, 51, 234, 0.15)"
                                borderColor="#a855f7"
                            >
                                <motion.div variants={cardVariants} initial="idle" whileHover="hovered" className="h-full">
                                    <div className="mb-4 bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <motion.div variants={arrowVariants}>
                                            <ArrowUpRight size={24} className="text-purple-600" />
                                        </motion.div>
                                    </div>
                                    <div className="text-5xl font-extrabold text-ink mb-3 tracking-tight">{t('impact.stat1.value')}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{t('impact.stat1.desc')}</p>
                                </motion.div>
                            </MagneticTiltCard>
                        </Reveal>

                        {/* Card 2 — Clock speed burst */}
                        <Reveal delay={0.2} variant="parallax-up">
                            <MagneticTiltCard
                                className="bg-gradient-to-br from-white to-blue-50/40 p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-2 border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] hover:border-blue-500 transition-[box-shadow,border-color] duration-300 cursor-default h-full relative overflow-hidden"
                                glowColor="rgba(59, 130, 246, 0.15)"
                                borderColor="#3b82f6"
                            >
                                <motion.div variants={cardVariants} initial="idle" whileHover="hovered" className="h-full">
                                    <div className="mb-4 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <div className="relative w-6 h-6 border-2 border-blue-600 rounded-full flex items-center justify-center">
                                            <motion.div
                                                variants={clockHourVariants}
                                                className="absolute w-0.5 h-2 bg-blue-600 rounded-full origin-bottom"
                                                style={{ bottom: '50%' }}
                                            />
                                            <motion.div
                                                variants={clockMinuteVariants}
                                                className="absolute w-0.5 h-2.5 bg-blue-600 rounded-full origin-bottom"
                                                style={{ bottom: '50%' }}
                                            />
                                            <div className="w-1 h-1 bg-blue-600 rounded-full z-10" />
                                        </div>
                                    </div>
                                    <div className="text-5xl font-extrabold text-ink mb-3 tracking-tight">{t('impact.stat2.value')}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{t('impact.stat2.desc')}</p>
                                </motion.div>
                            </MagneticTiltCard>
                        </Reveal>

                        {/* Card 3 — Eye scan + blink */}
                        <Reveal delay={0.3} variant="parallax-up">
                            <MagneticTiltCard
                                className="bg-gradient-to-br from-white to-orange-50/40 p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-2 border-orange-300 hover:shadow-[0_8px_30px_rgba(249,115,22,0.25)] hover:border-orange-500 transition-[box-shadow,border-color] duration-300 cursor-default h-full relative overflow-hidden"
                                glowColor="rgba(249, 115, 22, 0.15)"
                                borderColor="#f97316"
                            >
                                <motion.div variants={cardVariants} initial="idle" whileHover="hovered" className="h-full">
                                    <div className="mb-4 bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                        <motion.div variants={eyeVariants} style={{ perspective: 200 }}>
                                            <Eye size={24} className="text-orange-600" />
                                        </motion.div>
                                    </div>
                                    <div className="text-5xl font-extrabold text-ink mb-3 tracking-tight">{t('impact.stat3.value')}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{t('impact.stat3.desc')}</p>
                                </motion.div>
                            </MagneticTiltCard>
                        </Reveal>

                    </div>
                </div>
            </div>
        </section>
    );
};
