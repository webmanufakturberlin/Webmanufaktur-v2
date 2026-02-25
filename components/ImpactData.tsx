import React, { useRef, useCallback, useState } from 'react';
import { TrendingUp, Clock, Eye, ExternalLink } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

// Magnetic hover card — card follows mouse slightly
const MagnetCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.10;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.10;
        ref.current.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = 'translate(0, 0) scale(1)';
    }, []);

    return (
        <div ref={ref} className={`transition-transform duration-500 ease-out ${className}`}
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {children}
        </div>
    );
};

// Animated SVG graph that grows like a stock ticker on hover
const AnimatedGraph: React.FC<{ hovered: boolean }> = ({ hovered }) => (
    <div className="mb-4 bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-all duration-500 overflow-hidden">
        {hovered ? (
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-purple-600">
                <polyline
                    points="2,20 6,16 10,18 14,10 18,12 22,4 26,6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                    style={{ animation: 'graph-draw 1s ease-out forwards' }}
                />
            </svg>
        ) : (
            <TrendingUp size={24} className="text-purple-600" />
        )}
    </div>
);

// Animated clock with spinning hands on hover
const AnimatedClock: React.FC<{ hovered: boolean }> = ({ hovered }) => (
    <div className="mb-4 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-all duration-500">
        {hovered ? (
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-600">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                {/* Hour hand */}
                <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transformOrigin: '12px 12px', animation: 'clock-spin 2s linear infinite' }} />
                {/* Minute hand */}
                <line x1="12" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    style={{ transformOrigin: '12px 12px', animation: 'clock-spin 0.5s linear infinite' }} />
                {/* Center dot */}
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
        ) : (
            <Clock size={24} className="text-blue-600" />
        )}
    </div>
);

// Animated blinking eye on hover
const AnimatedEye: React.FC<{ hovered: boolean }> = ({ hovered }) => (
    <div className="mb-4 bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-all duration-500">
        <Eye size={24} className={`text-orange-600 transition-transform duration-300 ${hovered ? 'animate-eye-blink' : ''}`} />
    </div>
);

export const ImpactData: React.FC = () => {
    const { t } = useI18n();
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <section className="relative z-20 py-24 bg-white/60 border-b border-gray-100 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    <div className="md:w-1/3">
                        <Reveal>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                                <TrendingUp size={12} aria-hidden="true" />
                                {t('impact.badge')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6">
                                {t('impact.headline1')}<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">{t('impact.headline2')}</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed mb-6 font-light text-lg">
                                {t('impact.desc')}
                            </p>
                            <a href="https://captology.stanford.edu/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-gray-300 underline-offset-4 hover:decoration-blue-500 transition-all hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                                {t('impact.source')} <ExternalLink size={12} aria-hidden="true" />
                            </a>
                        </Reveal>
                    </div>

                    {/* Cards with magnetic hover */}
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Reveal delay={0.1}>
                            <MagnetCard>
                                <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-500 cursor-default h-full group relative overflow-hidden"
                                    onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)}>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" aria-hidden="true" />
                                    <AnimatedGraph hovered={hovered === 0} />
                                    <div className="text-5xl font-extrabold text-ink mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">{t('impact.stat1.value')}</div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{t('impact.stat1.desc')}</p>
                                </div>
                            </MagnetCard>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <MagnetCard>
                                <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 cursor-default h-full group relative overflow-hidden"
                                    onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)}>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" aria-hidden="true" />
                                    <AnimatedClock hovered={hovered === 1} />
                                    <div className="text-5xl font-extrabold text-ink mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-500">{t('impact.stat2.value')}</div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{t('impact.stat2.desc')}</p>
                                </div>
                            </MagnetCard>
                        </Reveal>

                        <Reveal delay={0.3}>
                            <MagnetCard>
                                <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-500 cursor-default h-full group relative overflow-hidden"
                                    onMouseEnter={() => setHovered(2)} onMouseLeave={() => setHovered(null)}>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" aria-hidden="true" />
                                    <AnimatedEye hovered={hovered === 2} />
                                    <div className="text-5xl font-extrabold text-ink mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-500">{t('impact.stat3.value')}</div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{t('impact.stat3.desc')}</p>
                                </div>
                            </MagnetCard>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Inline CSS keyframes for icon animations */}
            <style>{`
                @keyframes graph-draw {
                    from { stroke-dashoffset: 60; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes clock-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-eye-blink {
                    animation: eye-blink 0.4s ease-in-out infinite;
                }
                @keyframes eye-blink {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.1); }
                }
            `}</style>
        </section>
    );
};