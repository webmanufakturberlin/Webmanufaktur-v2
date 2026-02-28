import React, { useState, useRef, useCallback } from 'react';
import { ArrowRight, Terminal, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n';
import { Waves } from './ui/wave-background';
import { motion } from 'framer-motion';

// Magnetic CTA button — follows cursor slightly with spring return
const MagneticBtn: React.FC<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
}> = ({ children, className = '', onClick, strength = 8 }) => {
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength * 2;
        ref.current.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = 'translate(0, 0)';
    }, []);

    return (
        <button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{ transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
            {children}
        </button>
    );
};

// Shimmer text — each word shimmers on hover with stagger
const ShimmerText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
    const [active, setActive] = useState(false);
    const words = text.split(' ');

    return (
        <p
            className={className}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            {words.map((word, i) => (
                <React.Fragment key={i}>
                    <span
                        className={`shimmer-word${active ? ' active' : ''}`}
                        style={{ animationDelay: active ? `${i * 40}ms` : '0ms' }}
                    >
                        {word}
                    </span>
                    {i < words.length - 1 ? ' ' : ''}
                </React.Fragment>
            ))}
        </p>
    );
};

export const Hero: React.FC = () => {
    const { t } = useI18n();

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-4 overflow-hidden">
            {/* WAVES BACKGROUND */}
            <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none select-none">
                <Waves strokeColor="#334155" backgroundColor="transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center">
                <div className="flex flex-col items-center">

                    {/* Made in Berlin Badge — holographic shimmer + Berlin red dot */}
                    <div
                        className="badge-holo inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-indigo-100/80 mb-10 shadow-lg shadow-indigo-900/5 cursor-default transition-all duration-300 hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-200 hover:scale-105"
                    >
                        {/* Berlin red pulsing dot */}
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="text-xs font-mono font-bold uppercase tracking-[0.22em] text-gray-700 select-none">
                            Made in Berlin
                        </span>
                        {/* CRT scanline overlay */}
                        <span
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)',
                                animation: 'scanline 3s ease infinite',
                            }}
                            aria-hidden="true"
                        />
                    </div>

                    {/* Headline */}
                    <div className="relative mb-8">
                        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] select-none">
                            <motion.span
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600"
                            >
                                {t('hero.headline1')}
                            </motion.span>
                            <motion.span
                                initial={{ x: '-100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 pb-2"
                            >
                                {t('hero.headline2')}
                            </motion.span>
                        </h1>
                    </div>

                    {/* Subtext — word-by-word shimmer on hover */}
                    <div>
                        <ShimmerText
                            text={t('hero.subtext')}
                            className="max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 mx-auto font-light cursor-default"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">

                        {/* Primary — Magnetic + pulse glow */}
                        <MagneticBtn
                            onClick={scrollToContact}
                            className="rainbow-btn group min-w-[220px] px-10 py-5 rounded-full shadow-2xl hover:shadow-[0_20px_60px_-10px_rgba(99,102,241,0.55)] active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-lg font-bold tracking-wide text-white">{t('nav.startProject')}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300 text-white" aria-hidden="true" />
                            </div>
                        </MagneticBtn>

                        {/* Secondary — sliding gradient underline */}
                        <a
                            href="#work"
                            className="relative group min-w-[180px] text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all px-6 py-4 hover:bg-white hover:shadow-lg rounded-full border border-transparent hover:border-gray-100 flex items-center justify-center gap-2 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:-translate-y-0.5 duration-300 overflow-hidden"
                        >
                            <span
                                className="absolute bottom-3 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-2/3 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
                                aria-hidden="true"
                            />
                            <Terminal size={16} aria-hidden="true" className="group-hover:text-blue-500 transition-colors duration-300" />
                            {t('hero.caseStudies')}
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[16] flex flex-col items-center gap-2 animate-bounce pointer-events-none" style={{ animationDuration: '2s' }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('hero.scroll')}</span>
                <ChevronDown size={20} className="text-gray-400" />
            </div>

            {/* Footer Tech Stack — individual hover colors */}
            <div className="absolute bottom-6 left-0 w-full z-[16] hidden md:block" aria-hidden="true">
                <div className="flex justify-center gap-12 opacity-50 select-none grayscale hover:grayscale-0 transition-all duration-500 px-6">
                    {[
                        { name: 'React',      color: 'hover:text-cyan-500 hover:border-cyan-200' },
                        { name: 'Next.js',    color: 'hover:text-gray-900 hover:border-gray-300' },
                        { name: 'TypeScript', color: 'hover:text-blue-600 hover:border-blue-200' },
                        { name: 'Node.js',    color: 'hover:text-green-600 hover:border-green-200' },
                        { name: 'Gemini',     color: 'hover:text-purple-600 hover:border-purple-200' },
                    ].map((tech, i) => (
                        <span
                            key={tech.name}
                            className={`text-xs font-bold font-mono tracking-widest text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:opacity-100 ${tech.color}`}
                            style={{ transitionDelay: `${i * 40}ms` }}
                        >
                            {tech.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};
