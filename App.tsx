import React, { useState, useRef, useEffect } from 'react';
import { Background } from './components/Background';
import { Hero } from './components/Hero';
import { Features, ServiceData } from './components/Features';
import { Process } from './components/Process';
import { BusinessAI } from './components/StylistAI';
import { Proof } from './components/Proof';
import { CTA } from './components/CTA';
import { ImpactData } from './components/ImpactData';
import { ServiceDetail } from './components/ServiceDetail';
import { Navbar } from './components/Navbar';
import { AboutUs } from './components/AboutUs';
import { Impressum } from './components/Impressum';

import { motion } from 'framer-motion';

// Animation types for unique section entrances
type SectionAnimation = '3d-unfold' | 'glass' | 'diagonal-spring' | 'horizon-expand' | 'deep-dive' | 'magnetic-drop';

const ANIMATION_VARIANTS: Record<SectionAnimation, any> = {
    '3d-unfold': {
        hidden: { opacity: 0, rotateX: 90, scale: 0.8, y: 100 },
        visible: { opacity: 1, rotateX: 0, scale: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
    },
    'glass': {
        hidden: { opacity: 0, filter: 'blur(30px)', scale: 1.1 },
        visible: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 1.5, ease: "easeOut" } }
    },
    'diagonal-spring': {
        hidden: { opacity: 0, x: 200, y: 200 },
        visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
    },
    'horizon-expand': {
        hidden: { opacity: 0, scaleY: 0, filter: 'blur(10px)' },
        visible: { opacity: 1, scaleY: 1, filter: 'blur(0px)', transition: { duration: 1, ease: "anticipate" } }
    },
    'deep-dive': {
        hidden: { opacity: 0, scale: 0.3, z: -500 },
        visible: { opacity: 1, scale: 1, z: 0, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
    },
    'magnetic-drop': {
        hidden: { opacity: 0, y: -200 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 12 } }
    }
};

// Section wrapper that reveals on scroll with a unique animation per section
const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; animation?: SectionAnimation }> = ({ children, className = '', animation = '3d-unfold' }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={ANIMATION_VARIANTS[animation]}
            className={className}
            style={{ perspective: '1200px' }}
        >
            {children}
        </motion.div>
    );
};

// Gradient divider between sections
const SectionDivider: React.FC = () => (
    <div className="section-divider" aria-hidden="true" />
);

// Card wrapper that lifts sections off the background
const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`mx-4 md:mx-8 my-6 rounded-3xl bg-white/90 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden ${className}`}>
        {children}
    </div>
);

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'home' | 'service' | 'about' | 'impressum'>('home');
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

    const scrollPositionRef = useRef(0);

    const handleNavigate = (id: string) => {
        if (id === 'impressum') {
            handleImpressum();
            return;
        }
        if (currentView !== 'home') {
            setCurrentView('home');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHome = () => {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAbout = () => {
        scrollPositionRef.current = window.scrollY;
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleImpressum = () => {
        scrollPositionRef.current = window.scrollY;
        setCurrentView('impressum');
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleServiceClick = (service: ServiceData) => {
        scrollPositionRef.current = window.scrollY;
        setSelectedService(service);
        setCurrentView('service');
    };

    const handleBack = () => {
        setCurrentView('home');
        setSelectedService(null);
        setTimeout(() => {
            window.scrollTo({
                top: scrollPositionRef.current,
                behavior: 'auto'
            });
        }, 0);
    };

    if (currentView === 'about') {
        return (
            <>
                <Navbar onNavigate={handleNavigate} currentView={currentView} onHome={handleHome} onAbout={handleAbout} />
                <AboutUs onBack={handleHome} />
            </>
        );
    }

    if (currentView === 'impressum') {
        return (
            <>
                <Navbar onNavigate={handleNavigate} currentView={currentView} onHome={handleHome} onAbout={handleAbout} />
                <Impressum onBack={handleHome} onNavigate={handleNavigate} />
            </>
        );
    }

    if (currentView === 'service' && selectedService) {
        return (
            <>
                <ServiceDetail service={selectedService} onBack={handleBack} />
            </>
        );
    }

    return (
        <div className="min-h-screen text-ink selection:bg-black selection:text-white font-sans">
            <Background />

            <Navbar onNavigate={handleNavigate} currentView={currentView} onHome={handleHome} onAbout={handleAbout} />

            <main className="flex flex-col">
                <Hero />

                {/* Floating content container with grid background */}
                <div className="relative z-20 -mt-6 rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.06)] overflow-hidden"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                        backgroundColor: 'rgb(249, 250, 251)',
                    }}
                >

                    {/* Section 1: ImpactData — The 3D Unfold */}
                    <SectionReveal animation="3d-unfold">
                        <SectionCard>
                            <div id="journal">
                                <ImpactData />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 2: Features — The Glass Materialize */}
                    <SectionReveal animation="glass">
                        <SectionCard>
                            <div id="work">
                                <Features onNavigate={handleServiceClick} />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <div id="solutions" aria-hidden="true"></div>
                    <SectionDivider />

                    {/* Section 3: Process — The Diagonal Spring */}
                    <SectionReveal animation="diagonal-spring">
                        <SectionCard>
                            <div id="methodology">
                                <Process />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 4: BusinessAI — The Horizon Expand */}
                    <SectionReveal animation="horizon-expand">
                        <SectionCard>
                            <div id="ai-lab">
                                <BusinessAI />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 5: Proof — The Deep Dive */}
                    <SectionReveal animation="deep-dive">
                        <SectionCard>
                            <div id="company">
                                <Proof />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 6: CTA — The Magnetic Drop */}
                    <SectionReveal animation="magnetic-drop">
                        <SectionCard>
                            <div id="contact">
                                <CTA onNavigate={handleNavigate} />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                </div>
            </main>
        </div>
    );
};

export default App;