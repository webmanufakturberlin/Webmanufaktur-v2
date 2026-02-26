import React, { useEffect, useState } from 'react';
import { ArrowRight, Terminal, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n';
import { Waves } from './ui/wave-background';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    const { t } = useI18n();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

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
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 mb-10 shadow-lg shadow-blue-900/5 cursor-default transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.6s' }}>
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gray-600">
                            Made in Berlin
                        </span>
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

                    {/* Subtext */}
                    <div className={`transition-all duration-[1400ms] ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`} style={{ transitionDelay: '0.5s' }}>
                        <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 mx-auto font-light">
                            {t('hero.subtext')}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center gap-6 mb-12 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.7s' }}>
                        <button
                            onClick={scrollToContact}
                            className="rainbow-btn group min-w-[220px] px-10 py-5 rounded-full shadow-2xl hover:shadow-[0_20px_60px_-10px_rgba(99,102,241,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-lg font-bold tracking-wide text-white">{t('nav.startProject')}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-white" aria-hidden="true" />
                            </div>
                        </button>

                        <a
                            href="#work"
                            className="min-w-[180px] text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-ink transition-all px-6 py-4 hover:bg-white hover:shadow-lg rounded-full border border-transparent hover:border-gray-100 flex items-center justify-center gap-2 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:-translate-y-0.5 duration-300"
                        >
                            <Terminal size={16} aria-hidden="true" />
                            {t('hero.caseStudies')}
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[16] flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '2s' }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('hero.scroll')}</span>
                <ChevronDown size={20} className="text-gray-400" />
            </div>

            {/* Footer Tech Stack */}
            <div className="absolute bottom-6 left-0 w-full z-[16] hidden md:block" aria-hidden="true">
                <div className="flex justify-center gap-12 opacity-50 select-none grayscale hover:grayscale-0 transition-all duration-500 px-6">
                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'Gemini'].map((tech) => (
                        <span key={tech} className="text-xs font-bold font-mono tracking-widest text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md shadow-sm border border-gray-100">{tech}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};