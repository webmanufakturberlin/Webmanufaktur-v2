import React, { useEffect, useState } from 'react';
import { ArrowRight, Terminal, Braces, Hash, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n';
import { Waves } from './ui/wave-background';

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
        /* NO overflow-hidden so balls are never clipped */
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] bg-transparent text-ink">

            {/* WAVES BACKGROUND - Interactive noise waves behind the skyline */}
            <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none select-none">
                <Waves
                    strokeColor="#334155"
                    backgroundColor="transparent"
                />
            </div>

            {/* 1. BERLIN SKYLINE ÔÇö Brandenburg Gate moved further right to avoid button overlap */}
            <div className="absolute bottom-0 left-0 w-full h-[55vh] md:h-[70vh] z-[2] pointer-events-none select-none flex items-end overflow-hidden" aria-hidden="true">
                <svg className="w-full h-full" preserveAspectRatio="xMidYBottom slice" viewBox="0 0 1920 800" aria-hidden="true" role="img">
                    <defs>
                        <linearGradient id="skyline-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.05" />
                        </linearGradient>
                        <pattern id="binary-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="1" height="1" fill="#2563EB" opacity="0.3" />
                            <text x="5" y="20" fontSize="8" fill="#2563EB" opacity="0.15" fontFamily="monospace">10</text>
                        </pattern>
                    </defs>

                    {/* Distant City Blocks */}
                    <path d="M0 800 L0 650 L150 650 L150 800 M350 800 L350 600 L500 600 L500 800 M1500 800 L1500 680 L1700 680 L1700 800" fill="url(#binary-grid)" opacity="0.3" />

                    {/* VICTORY COLUMN (Siegess├ñule) ÔÇö FAR LEFT */}
                    <g transform="translate(200, 450)">
                        <rect x="-40" y="300" width="80" height="50" fill="url(#binary-grid)" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
                        <rect x="-12" y="80" width="24" height="220" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <rect x="-18" y="60" width="36" height="20" fill="url(#binary-grid)" stroke="#2563EB" strokeWidth="1" />
                        <circle cx="0" cy="35" r="20" fill="none" stroke="#f97316" strokeWidth="1.5" />
                        <path d="M-10 35 L10 35 M0 25 L0 45" stroke="#f97316" strokeWidth="1" opacity="0.6" />
                    </g>

                    {/* REICHSTAG DOME ÔÇö center-left, below buttons */}
                    <g transform="translate(550, 620)">
                        <rect x="-120" y="80" width="240" height="100" fill="url(#binary-grid)" stroke="#2563EB" strokeWidth="1" opacity="0.2" />
                        <path d="M-70 80 A 70 70 0 0 1 70 80" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <path d="M0 80 L0 10 M-35 75 L15 30 M35 75 L-15 30" stroke="#2563EB" strokeWidth="1" opacity="0.3" />
                    </g>

                    {/* BRANDENBURG GATE ÔÇö center-right, well separated from TV Tower */}
                    <g transform="translate(950, 500)">
                        <rect x="20" y="100" width="25" height="200" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <rect x="70" y="100" width="25" height="200" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <rect x="120" y="100" width="25" height="200" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <rect x="170" y="100" width="25" height="200" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <rect x="220" y="100" width="25" height="200" fill="none" stroke="url(#skyline-gradient)" strokeWidth="2" />
                        <rect x="0" y="50" width="265" height="50" fill="url(#binary-grid)" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.3" />
                        <path d="M110 50 L132 10 L154 50" fill="none" stroke="#2563EB" strokeWidth="2" />
                        <circle cx="132" cy="10" r="8" fill="#2563EB" opacity="0.2" />
                    </g>

                    {/* TV TOWER (Fernsehturm) ÔÇö far right, clear of text */}
                    <g transform="translate(1700, 50)">
                        <path d="M0 750 L0 250" stroke="url(#skyline-gradient)" strokeWidth="6" />
                        <path d="M-15 750 L-5 250 M15 750 L5 250" stroke="#2563EB" strokeWidth="1" opacity="0.3" strokeDasharray="10 5" />
                        <g>
                            {/* Outer sphere */}
                            <circle cx="0" cy="250" r="60" fill="white" stroke="url(#skyline-gradient)" strokeWidth="3" />
                            <path d="M-60 250 L60 250 M-45 220 L45 220 M-45 280 L45 280" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
                            {/* Spinning dashed ring ÔÇö SVG native animation */}
                            <circle cx="0" cy="250" r="40" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 4">
                                <animateTransform attributeName="transform" type="rotate" from="0 0 250" to="360 0 250" dur="8s" repeatCount="indefinite" />
                            </circle>
                            {/* ORBITING BLACK BALL ÔÇö SVG native rotation around sphere center */}
                            <circle cx="35" cy="250" r="14" fill="#111">
                                <animateTransform attributeName="transform" type="rotate" from="0 0 250" to="360 0 250" dur="4s" repeatCount="indefinite" />
                            </circle>
                        </g>
                        <line x1="0" y1="190" x2="0" y2="120" stroke="url(#skyline-gradient)" strokeWidth="4" />
                        <line x1="0" y1="120" x2="0" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                        <line x1="0" y1="60" x2="0" y2="0" stroke="url(#skyline-gradient)" strokeWidth="1" />
                        {/* Red blinking dot ÔÇö SVG native pulse animation */}
                        <circle cx="0" cy="0" r="6" fill="#ef4444">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="6" fill="#ef4444" opacity="0.6">
                            <animate attributeName="r" values="6;20;6" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                    </g>

                    {/* Foreground */}
                    <path d="M0 750 L1920 750" stroke="#2563EB" strokeWidth="2" opacity="0.5" />
                    <rect x="0" y="750" width="1920" height="50" fill="url(#binary-grid)" opacity="0.2" />
                </svg>
            </div>

            {/* 2. FLOATING BLACK BALL ÔÇö z-30 above everything, BIG orbit motion */}
            <div className="absolute z-[30] pointer-events-none" aria-hidden="true"
                style={{
                    top: '12%',
                    right: '15%',
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #555, #000)',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.35), inset 0 -10px 25px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                    animation: 'ball-orbit 6s ease-in-out infinite',
                }}
            />
            <div className="absolute z-[30] pointer-events-none" aria-hidden="true"
                style={{
                    bottom: '25%',
                    left: '6%',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #666, #111)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.25), inset 0 -5px 12px rgba(0,0,0,0.4)',
                    animation: 'ball-orbit 10s ease-in-out infinite 3s',
                }}
            />

            {/* 3. FLOATING SYMBOLS */}
            <div className="absolute inset-0 pointer-events-none z-[3]" aria-hidden="true">
                <div className="absolute top-[12%] left-[4%] opacity-[0.08] text-gray-400" style={{ animation: 'float-gentle 20s ease-in-out infinite' }}>
                    <Hash size={140} strokeWidth={0.4} aria-hidden="true" />
                </div>
                <div className="absolute top-[18%] right-[8%] opacity-[0.06] text-indigo-300" style={{ animation: 'float-gentle 25s ease-in-out infinite 5s' }}>
                    <Braces size={110} strokeWidth={0.4} aria-hidden="true" />
                </div>
            </div>

            {/* 4. MAIN HERO CONTENT ÔÇö fly-in animation */}
            <div className="flex flex-col items-center justify-center px-6 md:px-12 max-w-[1400px] mx-auto w-full relative z-[16]">
                <div className="flex flex-col items-center text-center">

                    {/* Badge ÔÇö fades in */}
                    <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 mb-10 shadow-lg shadow-blue-900/5 cursor-default transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.6s' }}>
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gray-600">
                            Made in Berlin
                        </span>
                    </div>

                    {/* Headline ÔÇö flies in from below */}
                    <div className={`relative mb-8 transition-all duration-[1200ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '0.1s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 leading-[0.9] select-none">
                            {t('hero.headline1')} <br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 pb-2">
                                {t('hero.headline2')}
                            </span>
                        </h1>
                    </div>

                    {/* Subtext ÔÇö blurs to visible */}
                    <div className={`transition-all duration-[1400ms] ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`} style={{ transitionDelay: '0.5s' }}>
                        <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 mx-auto font-light">
                            {t('hero.subtext')}
                        </p>
                    </div>

                    {/* Buttons ÔÇö fixed min-width so they don't shift on language change */}
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
        </section >
    );
};
