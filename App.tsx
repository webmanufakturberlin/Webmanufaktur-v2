import React, { useState, useCallback, useEffect } from 'react';
import { ImpactData } from './components/ImpactData';
import { Features, ServiceData } from './components/Features';
import { SplineSection } from './components/SplineScene';
import { Hero } from './components/Hero';
import { CTA } from './components/CTA';
import { Navbar } from './components/Navbar';
import { AboutUs } from './components/AboutUs';
import { Impressum } from './components/Impressum';
import { BusinessAI } from './components/StylistAI';
import { Reveal } from './components/Reveal';
import { ServiceDetail } from './components/ServiceDetail';
import LivingVineBackground from './components/ui/living-vine-background';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion, useInView } from 'framer-motion';

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
            style={variant !== 'standard' ? { perspective: '2000px' } : {}}
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
    const [currentView, setCurrentView] = useState<'home' | 'service-detail' | 'about' | 'impressum'>('home');
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

    const handleNavigate = useCallback((id: string) => {
        if (id === 'about') {
            setCurrentView('about');
        } else if (id === 'impressum') {
            setCurrentView('impressum');
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

    const handleServiceClick = useCallback((service: ServiceData) => {
        setSelectedService(service);
        setCurrentView('service-detail');
        window.scrollTo(0, 0);
    }, []);

    const handleBack = useCallback(() => {
        setCurrentView('home');
        window.scrollTo(0, 0);
    }, []);

    return (
        <LivingVineBackground className="min-h-screen text-ink selection:bg-black selection:text-white font-sans">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-ink focus:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
                Zum Hauptinhalt springen
            </a>
            <ScrollProgress />
            <Navbar onNavigate={handleNavigate} currentView={currentView} onHome={handleHome} onAbout={handleAbout} />

            {currentView === 'service-detail' && selectedService ? (
                <ServiceDetail service={selectedService} onBack={handleBack} />
            ) : currentView === 'about' ? (
                <AboutUs onBack={handleHome} />
            ) : currentView === 'impressum' ? (
                <Impressum onBack={handleHome} onNavigate={handleNavigate} />
            ) : (
                <main id="main-content" className="flex flex-col">
                    <Hero />

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
                            <ErrorBoundary fallbackMessage="3D-Szene konnte nicht geladen werden.">
                                <SplineSection />
                            </ErrorBoundary>
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="horizon-expand" sectionId="business">
                            <ErrorBoundary fallbackMessage="KI-Berater konnte nicht geladen werden.">
                                <BusinessAI />
                            </ErrorBoundary>
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="contact">
                            <CTA onNavigate={handleNavigate} />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="impressum-footer">
                            <footer className="py-12 px-6 flex flex-col items-center gap-4 text-gray-500">
                                <p className="text-xs font-mono uppercase tracking-[0.3em]">© {new Date().getFullYear()} Webmanufaktur Berlin</p>
                            </footer>
                        </SectionReveal>
                    </div>
                </main>
            )}
        </LivingVineBackground>
    );
};

export default App;
