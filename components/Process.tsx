import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

interface ParallaxCardProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({ children, speed = 0, className = "" }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || speed === 0) return;

        let rafId: number;

        const updatePosition = () => {
            if (!ref.current) return;
            const scrollY = window.scrollY;
            const rect = ref.current.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const windowHeight = window.innerHeight;

            if (scrollY + windowHeight > elementTop - 100 && scrollY < elementTop + rect.height + 100) {
                const viewportCenter = scrollY + windowHeight / 2;
                const elementCenter = elementTop + rect.height / 2;
                const distance = viewportCenter - elementCenter;
                const offset = distance * speed;
                ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
            }

            rafId = requestAnimationFrame(updatePosition);
        };

        rafId = requestAnimationFrame(updatePosition);
        return () => { if (rafId) cancelAnimationFrame(rafId); };
    }, [speed]);

    return <div ref={ref} className={`${className} will-change-transform`}>{children}</div>;
};

// Staggered word reveal
const WordReveal: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className = '', delay = 0 }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.3 });

        const el = ref.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, []);

    return (
        <span
            ref={ref}
            className={`inline-block transition-all duration-[1200ms] ${className} ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-12 blur-sm'}`}
            style={{
                transitionDelay: `${delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {text}
        </span>
    );
};

export const Process: React.FC = () => {
    const { t } = useI18n();

    const steps = [
        { num: '01', titleKey: 'process.step1.title', descKey: 'process.step1.desc', textColor: 'text-blue-500', bgColor: 'bg-blue-500', borderHover: 'hover:border-blue-200', shadow: 'hover:shadow-blue-500/10', hoverNumColor: 'group-hover:text-blue-500', targetId: 'journal' },
        { num: '02', titleKey: 'process.step2.title', descKey: 'process.step2.desc', textColor: 'text-purple-500', bgColor: 'bg-purple-500', borderHover: 'hover:border-purple-200', shadow: 'hover:shadow-purple-500/10', hoverNumColor: 'group-hover:text-purple-500', targetId: 'ai-lab' },
        { num: '03', titleKey: 'process.step3.title', descKey: 'process.step3.desc', textColor: 'text-pink-500', bgColor: 'bg-pink-500', borderHover: 'hover:border-pink-200', shadow: 'hover:shadow-pink-500/10', hoverNumColor: 'group-hover:text-pink-500', targetId: 'work' },
        { num: '04', titleKey: 'process.step4.title', descKey: 'process.step4.desc', textColor: 'text-orange-500', bgColor: 'bg-orange-500', borderHover: 'hover:border-orange-200', shadow: 'hover:shadow-orange-500/10', hoverNumColor: 'group-hover:text-orange-500', targetId: 'work' },
        { num: '05', titleKey: 'process.step5.title', descKey: 'process.step5.desc', textColor: 'text-green-500', bgColor: 'bg-green-500', borderHover: 'hover:border-green-200', shadow: 'hover:shadow-green-500/10', hoverNumColor: 'group-hover:text-green-500', targetId: 'contact' },
    ];

    const handleScrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative z-10 py-32 border-y border-transparent overflow-visible">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] -z-10" aria-hidden="true" />

            <div className="absolute inset-0 -z-20 opacity-30 pointer-events-none mix-blend-multiply" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:20px_20px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-purple-50/40 to-orange-50/40 animate-pulse-slow" style={{ animationDuration: '8s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-24">
                    <Reveal width="100%">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-black/10 pb-8 mb-12">
                            <span className="text-blue-600 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true"></span>
                                {t('process.badge')}
                            </span>
                            <span className="text-gray-400 text-sm font-mono hidden md:block">{t('process.est')}</span>
                        </div>
                    </Reveal>

                    {/* Staggered Word Reveal — NO bg-clip-text on Digitale to avoid descender clipping */}
                    <div className="relative py-4 pb-12 overflow-visible">
                        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.3] overflow-visible">
                            <WordReveal text={t('process.headline1')} className="text-ink" delay={0} /> <br />
                            <WordReveal text={t('process.headline2')} className="text-gray-300 pb-4" delay={0.15} /> <br />
                            <WordReveal text={t('process.headline3')} className="text-ink" delay={0.3} />
                        </h2>
                    </div>
                </div>

                {/* Process step cards — unique hover: number scales up + rotates, bar fills, background gradient floods in */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="h-full">
                            <ParallaxCard speed={idx % 2 === 0 ? 0.05 : -0.05} className="h-full">
                                <Reveal delay={idx * 0.1} width="100%" className="h-full">
                                    <div
                                        onClick={() => handleScrollTo(step.targetId)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${t(step.titleKey)}: ${t(step.descKey)}`}
                                        className={`
                                            group relative p-8 h-full min-h-[380px] rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-md 
                                            transition-all duration-500 ease-out cursor-pointer
                                            hover:-translate-y-3 hover:scale-[1.03] hover:bg-white
                                            hover:shadow-2xl ${step.shadow} ${step.borderHover}
                                            flex flex-col justify-between overflow-hidden
                                            focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                            active:scale-[0.98]
                                        `}
                                    >
                                        <div>
                                            {/* Colored overlay that floods in */}
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 ${step.bgColor} pointer-events-none rounded-3xl`} />

                                            {/* Bar that expands with spring effect */}
                                            <div className={`w-10 h-1.5 mb-6 rounded-full group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${step.bgColor}`} />

                                            {/* Number that scales and rotates */}
                                            <div className={`text-5xl font-mono font-bold mb-6 text-gray-200 transition-all duration-500 ${step.hoverNumColor} group-hover:scale-125 group-hover:-rotate-6 origin-left`}>
                                                {step.num}
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 text-ink transition-all duration-300 group-hover:translate-x-2">
                                                {t(step.titleKey)}
                                            </h3>
                                            <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                                                {t(step.descKey)}
                                            </p>
                                        </div>
                                        <div className={`flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 ${step.textColor}`} aria-hidden="true">
                                            <div className={`w-10 h-10 rounded-full ${step.bgColor} bg-opacity-10 flex items-center justify-center`}>
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            </ParallaxCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}