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

// Animation types for unique section entrances
type SectionAnimation = '3d-unfold' | 'glass' | 'diagonal-spring' | 'horizon-expand' | 'deep-dive' | 'magnetic-drop';

// Section wrapper that reveals on scroll with a unique animation per section
const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; animation?: SectionAnimation }> = ({ children, className = '', animation = '3d-unfold' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Reversible animations: true when entering, false when leaving
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, []);

    return (
        <div
            ref={ref}
            className={`section-reveal anim-${animation} ${isVisible ? 'visible' : ''} ${className}`}
        >
            {children}
        </div>
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