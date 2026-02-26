import React, { useState, useCallback } from 'react';
import { ImpactData } from './components/ImpactData';
import { Features, ServiceData } from './components/Features';
import { Process } from './components/Process';
import { Hero } from './components/Hero';
import { CTA } from './components/CTA';
import { Navbar } from './components/Navbar';
import { AboutUs } from './components/AboutUs';
import { Impressum } from './components/Impressum';
import { BusinessAI } from './components/StylistAI';
import { Reveal } from './components/Reveal';
import { ServiceDetail } from './components/ServiceDetail';
import LivingVineBackground from './components/ui/living-vine-background';
import { motion, useInView } from 'framer-motion';

// --- Animation Components ---

const ANIMATION_VARIANTS = {
    standard: {
        hidden: { opacity: 0, y: 40, x: 0 },
        visible: { opacity: 1, y: 0, x: 0 }
    },
    '3d-unfold': {
        hidden: { opacity: 0, rotateX: -45, y: 100, x: 0 },
        visible: { opacity: 1, rotateX: 0, y: 0, x: 0 }
    },
    glass: {
        hidden: { opacity: 0, backdropFilter: 'blur(30px)', scale: 0.95, x: 0 },
        visible: { opacity: 1, backdropFilter: 'blur(0px)', scale: 1, x: 0 }
    },
    'horizon-expand': {
        hidden: { opacity: 0, scaleX: 0.8, y: 50, x: 0 },
        visible: { opacity: 1, scaleX: 1, y: 0, x: 0 }
    }
};

const SectionReveal: React.FC<{
    children: React.ReactNode;
    variant?: keyof typeof ANIMATION_VARIANTS;
    className?: string;
    sectionId?: string;
}> = ({ children, variant = 'standard', className = "", sectionId }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const selectedVariant = ANIMATION_VARIANTS[variant];

    return (
        <motion.div
            ref={ref}
            id={sectionId}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={selectedVariant}
            transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.8 }
            }}
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
            <Navbar onNavigate={handleNavigate} currentView={currentView} onHome={handleHome} onAbout={handleAbout} />

            {currentView === 'service-detail' && selectedService ? (
                <ServiceDetail service={selectedService} onBack={handleBack} />
            ) : currentView === 'about' ? (
                <AboutUs onBack={handleHome} />
            ) : currentView === 'impressum' ? (
                <Impressum onBack={handleHome} onNavigate={handleNavigate} />
            ) : (
                <main className="flex flex-col">
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

                        <SectionReveal variant="glass" sectionId="features">
                            <Features onNavigate={handleServiceClick} />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="work">
                            <Process />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="horizon-expand" sectionId="business">
                            <BusinessAI />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="contact">
                            <CTA onNavigate={handleNavigate} />
                        </SectionReveal>

                        <SectionDivider />

                        <SectionReveal variant="standard" sectionId="impressum-footer">
                            <footer className="py-12 px-6 flex flex-col items-center gap-4 text-gray-400">
                                <p className="text-xs font-mono uppercase tracking-[0.3em]">© 2026 Webmanufaktur Berlin</p>
                            </footer>
                        </SectionReveal>
                    </div>
                </main>
            )}
        </LivingVineBackground>
    );
};

export default App;