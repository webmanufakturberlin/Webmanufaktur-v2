import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { useI18n } from './i18n';
import { useSEO } from './useSEO';


// Lazy-load below-the-fold sections for faster initial paint
const ImpactData = React.lazy(() => import('./components/ImpactData').then(m => ({ default: m.ImpactData })));
const Features = React.lazy(() => import('./components/Features').then(m => ({ default: m.Features })));
type ServiceData = import('./components/Features').ServiceData;
const ProcessSection = React.lazy(() => import('./components/ProcessSection').then(m => ({ default: m.ProcessSection })));
const CTA = React.lazy(() => import('./components/CTA').then(m => ({ default: m.CTA })));
const BusinessAI = React.lazy(() => import('./components/StylistAI').then(m => ({ default: m.BusinessAI })));
const AboutUs = React.lazy(() => import('./components/AboutUs').then(m => ({ default: m.AboutUs })));
const Impressum = React.lazy(() => import('./components/Impressum').then(m => ({ default: m.Impressum })));
const References = React.lazy(() => import('./components/References').then(m => ({ default: m.References })));
const ServiceDetail = React.lazy(() => import('./components/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const KILabor = React.lazy(() => import('./components/KILabor').then(m => ({ default: m.KILabor })));

// --- Scroll Progress Bar ---
const ScrollProgress: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="scroll-progress"
            style={{ 
                scaleX, 
                transformOrigin: "0%",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(to right, #007cf0, #00dfd8)", // Adjust colors to match your theme
                zIndex: 1000
            }}
            aria-hidden="true"
        />
    );
};

// --- Animation Components ---

const ANIMATION_VARIANTS = {
    standard: {
        hidden: { y: 30 },
        visible: { y: 0 }
    },
    '3d-unfold': {
        hidden: { rotateX: -12, y: 50 },
        visible: { rotateX: 0, y: 0 }
    },
    glass: {
        hidden: { filter: 'blur(6px)', scale: 0.97 },
        visible: { filter: 'blur(0px)', scale: 1 }
    },
    'horizon-expand': {
        hidden: { scaleX: 0.85, y: 70 },
        visible: { scaleX: 1, y: 0 }
    },
    'curtain-rise': {
        hidden: { y: 100, scale: 0.95 },
        visible: { y: 0, scale: 1 }
    },
    'spiral-in': {
        hidden: { rotate: -6, scale: 0.9, y: 80 },
        visible: { rotate: 0, scale: 1, y: 0 }
    }
};

const SectionReveal: React.FC<{
    children: React.ReactNode;
    variant?: keyof typeof ANIMATION_VARIANTS;
    className?: string;
    sectionId?: string;
}> = ({ children, variant = 'standard', className = "", sectionId }) => {
    const ref = React.useRef(null);
    // amount: 0.20 — trigger when 20% visible (sweet spot for slow animations)
    // margin: shrink viewport by 40px top & bottom
    const isInView = useInView(ref, {
        once: false,
        amount: 0.20,
        margin: '-40px 0px -40px 0px',
    });
    const selectedVariant = ANIMATION_VARIANTS[variant];

    return (
        <motion.div
            ref={ref}
            id={sectionId}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={selectedVariant}
            transition={
                isInView
                    ? { duration: 1.2, ease: [0.16, 1, 0.3, 1] }           // Enter: slow majestic spring ease
                    : { duration: 0.8, ease: [0.4, 0, 0.6, 1] }            // Exit: slightly faster but visible exit
            }
            className={className}
            style={{
                ...(variant !== 'standard' ? { perspective: '2000px' } : {}),
            } as React.CSSProperties}
        >
            {children}
        </motion.div>
    );
};

const SectionDivider: React.FC = () => (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" aria-hidden="true" />
);

// --- Main App Component ---

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'home' | 'service-detail' | 'about' | 'impressum' | 'ki-labor' | 'references'>('home');
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const { lang, setLang } = useI18n();

    // --- Dynamic SEO per route ---
    useSEO(currentView, lang);

    // --- URL path helper ---
    const getPath = useCallback((view: string, language: string): string => {
        const prefix = language === 'en' ? '/en' : '';
        switch (view) {
            case 'about': return `${prefix}/about`;
            case 'references': return `${prefix}/references`;
            case 'impressum': return `${prefix}/impressum`;
            case 'ki-labor': return `${prefix}/ki-labor`;
            case 'home':
            default: return language === 'en' ? '/en/' : '/';
        }
    }, []);

    // --- URL Path Synchronization on initial load ---
    useEffect(() => {
        const path = window.location.pathname;
        let p = path;

        // Detect Language
        if (path.startsWith('/en')) {
            setLang('en');
            p = path.replace(/^\/en/, '') || '/';
        } else {
            setLang('de');
        }

        // Detect View
        if (p.includes('about')) {
            setCurrentView('about');
        } else if (p.includes('references')) {
            setCurrentView('references');
        } else if (p.includes('impressum')) {
            setCurrentView('impressum');
        } else if (p.includes('ki-labor') || p.includes('ai-lab')) {
            setCurrentView('ki-labor');
        } else {
            setCurrentView('home');
        }
    }, [setLang]);

    // --- Push URL state on view/lang change ---
    useEffect(() => {
        const newPath = getPath(currentView, lang);
        if (window.location.pathname !== newPath) {
            window.history.pushState({ view: currentView, lang }, '', newPath);
        }
    }, [currentView, lang, getPath]);

    // --- Handle browser back/forward ---
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            let p = path;
            if (path.startsWith('/en')) {
                setLang('en');
                p = path.replace(/^\/en/, '') || '/';
            } else {
                setLang('de');
            }
            if (p.includes('about')) setCurrentView('about');
            else if (p.includes('references')) setCurrentView('references');
            else if (p.includes('impressum')) setCurrentView('impressum');
            else if (p.includes('ki-labor')) setCurrentView('ki-labor');
            else setCurrentView('home');
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [setLang]);


    const handleNavigate = useCallback((id: string) => {
        if (id === 'about') {
            setCurrentView('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'impressum') {
            setCurrentView('impressum');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'ai-lab' || id === 'ki-labor') {
            setCurrentView('ki-labor');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'references') {
            setCurrentView('references');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setCurrentView('home');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, []);

    const handleHome = useCallback(() => {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleAbout = useCallback(() => {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleReferences = useCallback(() => {
        setCurrentView('references');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleServiceClick = useCallback((service: ServiceData) => {
        setSelectedService(service);
        setCurrentView('service-detail');
        window.scrollTo(0, 0);
    }, []);

    const handleBack = useCallback(() => {
        setCurrentView('home');
        // Use instant scroll to avoid visible scrolling from Hero
        window.scrollTo(0, 0);
        setTimeout(() => {
            const element = document.getElementById('features');
            if (element) {
                element.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
            }
        }, 300);
    }, []);

    return (
        <div className="min-h-screen text-ink selection:bg-black selection:text-white font-sans">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-ink focus:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
                Zum Hauptinhalt springen
            </a>
            <ScrollProgress />
            <Navbar onNavigate={handleNavigate} currentView={currentView} onHome={handleHome} onAbout={handleAbout} onReferences={handleReferences} />

            <Suspense fallback={null}>
            {currentView === 'service-detail' && selectedService ? (
                <ServiceDetail service={selectedService} onBack={handleBack} />
            ) : currentView === 'about' ? (
                <AboutUs onBack={handleHome} />
            ) : currentView === 'impressum' ? (
                <Impressum onBack={handleHome} onNavigate={handleNavigate} />
            ) : currentView === 'ki-labor' ? (
                <KILabor onBack={handleHome} onNavigate={handleNavigate} />
            ) : currentView === 'references' ? (
                <References onBack={handleHome} />
            ) : (
                <main id="main-content" className="flex flex-col">
                    <Hero onReferences={handleReferences} />

                    {/* Content Container */}
                    <div className="relative z-20 -mt-6 rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.06)] overflow-hidden"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                            backgroundColor: 'rgb(249, 250, 251)',
                        }}
                    >
                        <SectionReveal variant="3d-unfold" sectionId="impact">
                            <ImpactData />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="curtain-rise" sectionId="features">
                            <Features onNavigate={handleServiceClick} />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="work">
                            <ProcessSection />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="horizon-expand" sectionId="business">
                            <ErrorBoundary fallbackMessage="KI-Berater konnte nicht geladen werden.">
                                <BusinessAI />
                            </ErrorBoundary>
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="curtain-rise" sectionId="contact">
                            <CTA onNavigate={handleNavigate} />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="impressum-footer">
                            <footer className="py-16 px-6 border-t border-gray-200">
                                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">© {new Date().getFullYear()} Webmanufaktur Berlin</p>
                                    <div className="flex items-center gap-6 text-sm">
                                        <a
                                            href={lang === 'en' ? '/en/impressum' : '/impressum'}
                                            onClick={(e) => { e.preventDefault(); handleNavigate('impressum'); }}
                                            className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
                                        >
                                            Impressum
                                        </a>
                                        <span className="text-gray-300">|</span>
                                        <a
                                            href="mailto:webmanufaktur.berlin@googlemail.com"
                                            className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
                                        >
                                            webmanufaktur.berlin@googlemail.com
                                        </a>
                                    </div>
                                </div>
                            </footer>
                        </SectionReveal>
                    </div>
                </main>
            )}
            </Suspense>
        </div>
    );
};

export default App;
