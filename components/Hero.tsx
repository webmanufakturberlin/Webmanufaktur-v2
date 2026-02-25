import React, { useEffect, useState } from 'react';
import { ArrowRight, Terminal, ChevronDown } from 'lucide-react';
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
        <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] bg-transparent text-ink">

            {/* WAVES BACKGROUND */}
            <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none select-none">
                <Waves strokeColor="#334155" backgroundColor="transparent" />
            </div>

            {/* BERLIN SKYLINE — animated silhouette with code theme, bottom 35% only */}
            <div className="absolute bottom-0 left-0 w-full h-[35vh] md:h-[40vh] z-[2] pointer-events-none select-none flex items-end overflow-hidden" aria-hidden="true">
                <svg className="w-full h-full" preserveAspectRatio="xMidYMax slice" viewBox="0 0 1920 500" aria-hidden="true">
                    <defs>
                        <linearGradient id="skyline-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.08" />
                        </linearGradient>
                        <linearGradient id="skyline-fill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                        </linearGradient>
                        {/* 3D ball gradient for Fernsehturm sphere */}
                        <radialGradient id="ball-3d" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#666" />
                            <stop offset="40%" stopColor="#333" />
                            <stop offset="100%" stopColor="#000" />
                        </radialGradient>
                    </defs>

                    {/* ── Continuous Berlin skyline path ── */}
                    <path
                        d="M0 500 L0 420 L60 420 L60 380 L90 380 L90 350 L120 350 L120 380 L160 380 L160 320 L200 320 L200 350 L240 350 L240 300 L280 300 L280 340 L320 340 L320 420 L380 420 L380 360 L400 360 L400 310 L420 310 L420 280 L440 280 L440 310 L460 310 L460 350 L500 350 L500 380 L540 380 L540 360 L580 360 L580 330 L600 330 L600 290 L620 290 L620 330 L660 330 L660 370 L700 370 L700 340 L740 340 L740 300 L760 300 L760 340 L800 340 L800 380 L840 380 L840 350 L860 350 L860 310 L890 310 L890 280 L920 280 L920 250 L940 250 L940 210 L950 190 L960 210 L960 250 L980 250 L980 280 L1010 280 L1010 310 L1040 310 L1040 350 L1080 350 L1080 380 L1120 380 L1120 340 L1160 340 L1160 290 L1180 290 L1180 330 L1220 330 L1220 370 L1260 370 L1260 340 L1300 340 L1300 310 L1330 310 L1330 370 L1370 370 L1370 400 L1410 400 L1410 360 L1440 360 L1440 330 L1480 330 L1480 370 L1520 370 L1520 400 L1560 400 L1560 420 L1600 420 L1600 380 L1640 380 L1640 350 L1680 350 L1680 390 L1720 390 L1720 420 L1760 420 L1760 400 L1800 400 L1800 430 L1840 430 L1840 450 L1920 450 L1920 500 Z"
                        fill="url(#skyline-fill)"
                        stroke="url(#skyline-gradient)"
                        strokeWidth="1.5"
                        opacity="0.8"
                    >
                        {/* Draw-in animation */}
                        <animate attributeName="stroke-dashoffset" from="8000" to="0" dur="4s" fill="freeze" />
                        <animate attributeName="stroke-dasharray" values="8000;0" dur="0.01s" fill="freeze" />
                    </path>

                    {/* ── Brandenburg Gate accent (around x=940) ── */}
                    <g transform="translate(920, 220)" opacity="0.6">
                        <rect x="0" y="30" width="8" height="60" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                        <rect x="15" y="30" width="8" height="60" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                        <rect x="30" y="30" width="8" height="60" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                        <rect x="45" y="30" width="8" height="60" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                        <rect x="-5" y="15" width="58" height="15" fill="none" stroke="#2563EB" strokeWidth="1" />
                        <path d="M20 15 L27 0 L34 15" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                    </g>

                    {/* ── Fernsehturm — far right ── */}
                    <g transform="translate(1750, 20)">
                        {/* Main shaft */}
                        <path d="M0 480 L0 180" stroke="url(#skyline-gradient)" strokeWidth="6" />
                        {/* Support lines */}
                        <path d="M-10 480 L-3 180 M10 480 L3 180" stroke="#2563EB" strokeWidth="1.5" opacity="0.5" strokeDasharray="10 5" />

                        {/* Sphere assembly */}
                        <g>
                            <circle cx="0" cy="180" r="45" fill="white" stroke="url(#skyline-gradient)" strokeWidth="3.5" />
                            <path d="M-45 180 L45 180 M-35 160 L35 160 M-35 200 L35 200" stroke="#2563EB" strokeWidth="1.2" opacity="0.4" />
                            {/* Spinning dashed ring */}
                            <circle cx="0" cy="180" r="32" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 4">
                                <animateTransform attributeName="transform" type="rotate" from="0 0 180" to="360 0 180" dur="8s" repeatCount="indefinite" />
                            </circle>
                            {/* 3D rotating ball */}
                            <g>
                                <circle cx="0" cy="180" r="28" fill="url(#ball-3d)" />
                                <ellipse cx="-7" cy="170" rx="9" ry="6" fill="white" opacity="0.25" />
                                <g opacity="0.15">
                                    <ellipse cx="0" cy="180" rx="28" ry="8" fill="none" stroke="white" strokeWidth="0.8">
                                        <animateTransform attributeName="transform" type="rotate" from="0 0 180" to="360 0 180" dur="6s" repeatCount="indefinite" />
                                    </ellipse>
                                    <ellipse cx="0" cy="180" rx="8" ry="28" fill="none" stroke="white" strokeWidth="0.8">
                                        <animateTransform attributeName="transform" type="rotate" from="0 0 180" to="360 0 180" dur="6s" repeatCount="indefinite" />
                                    </ellipse>
                                </g>
                            </g>
                        </g>

                        {/* Antenna */}
                        <line x1="0" y1="135" x2="0" y2="80" stroke="url(#skyline-gradient)" strokeWidth="3" />
                        <line x1="0" y1="80" x2="0" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                        <line x1="0" y1="30" x2="0" y2="0" stroke="url(#skyline-gradient)" strokeWidth="1" />
                        {/* Red blinking dot */}
                        <circle cx="0" cy="0" r="5" fill="#ef4444">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="5" fill="#ef4444" opacity="0.6">
                            <animate attributeName="r" values="5;16;5" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                    </g>

                    {/* ── Code-themed overlays on buildings ── */}
                    <g opacity="0.35" fontFamily="monospace" fontSize="11" fill="#2563EB">
                        {/* Terminal brackets */}
                        <text x="180" y="340">&lt;/&gt;</text>
                        <text x="580" y="310">&#123; &#125;</text>
                        <text x="1160" y="310">fn()</text>
                        <text x="1400" y="380">[ ]</text>

                        {/* Blinking cursors */}
                        <text x="320" y="360" opacity="0.6">
                            ▌
                            <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite" />
                        </text>
                        <text x="760" y="320" opacity="0.6">
                            ▌
                            <animate attributeName="opacity" values="0;0.6;0" dur="1.2s" repeatCount="indefinite" />
                        </text>

                        {/* Circuit connection dots */}
                        <circle cx="450" cy="370" r="3" fill="#2563EB" opacity="0.5">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="850" cy="340" r="3" fill="#2563EB" opacity="0.5">
                            <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="1250" cy="360" r="3" fill="#2563EB" opacity="0.5">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
                        </circle>

                        {/* Horizontal circuit lines */}
                        <line x1="453" y1="370" x2="847" y2="340" stroke="#2563EB" strokeWidth="0.5" opacity="0.25" strokeDasharray="4 6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
                        </line>
                        <line x1="853" y1="340" x2="1247" y2="360" stroke="#2563EB" strokeWidth="0.5" opacity="0.25" strokeDasharray="4 6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3.5s" repeatCount="indefinite" />
                        </line>
                    </g>

                    {/* ── Window lights (random dots on buildings) ── */}
                    <g opacity="0.3">
                        {[
                            [110, 370], [130, 365], [180, 335], [250, 315], [270, 325],
                            [410, 295], [430, 305], [600, 305], [610, 315],
                            [740, 315], [755, 325], [860, 325], [870, 335],
                            [1130, 355], [1170, 305], [1310, 325], [1450, 345],
                        ].map(([x, y], i) => (
                            <rect key={i} x={x} y={y} width="4" height="4" fill="#2563EB" opacity="0.6">
                                <animate attributeName="opacity" values="0.6;0.2;0.6" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
                            </rect>
                        ))}
                    </g>

                    {/* Ground line */}
                    <path d="M0 500 L1920 500" stroke="#2563EB" strokeWidth="1.5" opacity="0.4" />
                </svg>
            </div>

            {/* MAIN HERO CONTENT — fly-in animation */}
            <div className="flex flex-col items-center justify-center px-6 md:px-12 max-w-[1400px] mx-auto w-full relative z-[16]">
                <div className="flex flex-col items-center text-center">

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

                    {/* Headline — cinematic split fly-in */}
                    <div className="relative mb-8">
                        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] select-none">
                            <span
                                className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600"
                                style={{
                                    opacity: 0,
                                    animation: loaded ? 'hero-fly-left 3s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                                }}
                            >
                                {t('hero.headline1')}
                            </span>
                            <span
                                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 pb-2"
                                style={{
                                    opacity: 0,
                                    animation: loaded ? 'hero-fly-right 3s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards' : 'none',
                                }}
                            >
                                {t('hero.headline2')}
                            </span>
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
        </section >
    );
};