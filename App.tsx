import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion, useInView } from 'framer-motion';

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
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            className="scroll-progress"
            style={{ width: `${progress}%` }}
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
        hidden: { scaleX: 0.93, y: 35 },
        visible: { scaleX: 1, y: 0 }
    },
    'curtain-rise': {
        hidden: { y: 45, scale: 0.97 },
        visible: { y: 0, scale: 1 }
    },
    'spiral-in': {
        hidden: { rotate: -3, scale: 0.96, y: 45 },
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
    // amount: 0.12 — trigger when 12% visible
    // margin: shrink viewport by 80px top & bottom for balanced enter/exit
    const isInView = useInView(ref, {
        once: false,
        amount: 0.08,
        // Only negative bottom: delays enter until section is 40px inside viewport.
        // No negative top: section stays "in view" until fully scrolled past.
        margin: '0px 0px -40px 0px',
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
                    ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] }           // Enter: spring ease
                    : { duration: 0.45, ease: [0.4, 0, 0.6, 1] }           // Exit: quick, no bounce
            }
            className={className}
            style={{
                ...(variant !== 'standard' ? { perspective: '2000px' } : {}),
                contentVisibility: 'auto',
                containIntrinsicSize: 'auto 600px',
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
        setTimeout(() => {
            const element = document.getElementById('features');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
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
                                            href="#impressum"
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
