import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowRight, Terminal, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n';
import PageLoader from './ui/PageLoader';
const VoxelBerlinBackground = React.lazy(() => import('./ui/VoxelBerlinBackground'));
import WeatherWidget from './ui/weather/WeatherWidget';
import { useWeatherStore } from '../stores/weatherStore';
import { motion } from 'framer-motion';
import { BerlinBear } from './ScavengerHunt/BerlinBear';

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

interface HeroProps {
    onReferences?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReferences }) => {
    const { t } = useI18n();
    const isNight = useWeatherStore(s => s.isNight);
    const [is3DLoaded, setIs3DLoaded] = useState(false);

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-32 pb-4 overflow-hidden">
            <PageLoader isLoading={!is3DLoaded} />
            <React.Suspense fallback={null}>
                <VoxelBerlinBackground onLoad={() => setIs3DLoaded(true)} />
            </React.Suspense>
            <div className="hidden md:block"><WeatherWidget /></div>

            {/* Scavenger Hunt Bear #0 — hidden on mobile */}
            <BerlinBear bearId={0} alwaysVisible className="absolute top-20 right-8 z-20 hidden md:block" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-center">
                <div className="flex flex-col items-center">

                    {/* Made in Berlin Badge — holographic shimmer + Berlin red dot */}
                    <div
                        className={`badge-holo inline-flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-md border mb-10 shadow-lg cursor-default transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                            isNight
                                ? 'bg-white/10 border-white/20 shadow-black/10 hover:shadow-white/10 hover:border-white/30'
                                : 'bg-white/95 border-indigo-100/80 shadow-indigo-900/5 hover:shadow-indigo-200/30 hover:border-indigo-200'
                        }`}
                    >
                        {/* Berlin red pulsing dot */}
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className={`text-xs font-mono font-bold uppercase tracking-[0.22em] select-none ${isNight ? 'text-gray-200' : 'text-gray-700'}`}>
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

                    {/* Headline - Now with mouse tracking shimmer */}
                    <div
                        className="relative mb-10 group/headline inline-block mx-auto cursor-default"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouseX', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouseY', `${e.clientY - rect.top}px`);
                        }}
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] select-none transition-opacity duration-300 group-hover/headline:opacity-80">
                            <motion.span
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
                                className={`block text-transparent bg-clip-text ${isNight ? 'bg-gradient-to-b from-white to-gray-300' : 'bg-gradient-to-b from-gray-900 to-gray-600'}`}
                                style={{ willChange: 'transform, opacity' }}
                            >
                                {t('hero.headline1')}
                            </motion.span>
                            <motion.span
                                initial={{ x: '-100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 pb-2"
                                style={{ willChange: 'transform, opacity' }}
                            >
                                {t('hero.headline2')}
                            </motion.span>
                        </h1>

                        {/* Mouse Tracking Shimmer Overlay */}
                        <h1
                            className="absolute inset-0 text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] select-none opacity-0 group-hover/headline:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(250px circle at var(--mouseX, 50%) var(--mouseY, 50%), #ffffff, transparent 80%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                            aria-hidden="true"
                        >
                            <span className="block">{t('hero.headline1')}</span>
                            <span className="inline-block pb-2">{t('hero.headline2')}</span>
                        </h1>
                    </div>

                    {/* Subtext — plain text, increased size */}
                    <div>
                        <p className={`max-w-2xl text-lg sm:text-xl md:text-3xl leading-relaxed mb-10 mx-auto font-light cursor-default ${isNight ? 'text-gray-300' : 'text-gray-500'}`}>
                            {t('hero.subtext')}
                        </p>
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

                        {/* Secondary — links to References */}
                        <a
                            href="#references"
                            onClick={(e) => {
                                if (onReferences) {
                                    e.preventDefault();
                                    onReferences();
                                }
                            }}
                            className={`relative group min-w-[180px] text-sm font-bold uppercase tracking-widest transition-all px-6 py-4 rounded-full border border-transparent flex items-center justify-center gap-2 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:-translate-y-0.5 duration-300 overflow-hidden ${
                                isNight
                                    ? 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg hover:border-white/20'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-lg hover:border-gray-100'
                            }`}
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
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isNight ? 'text-gray-500' : 'text-gray-400'}`}>{t('hero.scroll')}</span>
                <ChevronDown size={20} className={isNight ? 'text-gray-500' : 'text-gray-400'} />
            </div>

            {/* Footer Tech Stack — individual hover colors */}
            <div className="absolute bottom-6 left-0 w-full z-[16] hidden md:block" aria-hidden="true">
                <div className="flex justify-center gap-12 opacity-50 select-none grayscale hover:grayscale-0 transition-all duration-500 px-6">
                    {[
                        { name: 'React', color: 'hover:text-cyan-500 hover:border-cyan-200' },
                        { name: 'Next.js', color: 'hover:text-gray-900 hover:border-gray-300' },
                        { name: 'TypeScript', color: 'hover:text-blue-600 hover:border-blue-200' },
                        { name: 'Node.js', color: 'hover:text-green-600 hover:border-green-200' },
                        { name: 'Gemini', color: 'hover:text-purple-600 hover:border-purple-200' },
                    ].map((tech, i) => (
                        <span
                            key={tech.name}
                            className={`text-xs font-bold font-mono tracking-widest backdrop-blur-sm px-3 py-1 rounded-md shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:opacity-100 ${
                                isNight
                                    ? 'text-gray-400 bg-white/10 border-white/10'
                                    : `text-gray-400 bg-white/80 border-gray-100 ${tech.color}`
                            }`}
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
