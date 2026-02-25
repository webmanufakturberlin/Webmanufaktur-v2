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
type SectionAnimation = 'slide-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'flip-up' | 'fade-blur';

// Section wrapper that reveals on scroll with a unique animation per section
const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; animation?: SectionAnimation }> = ({ children, className = '', animation = 'slide-up' }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                } else {
                    el.classList.remove('visible');
                }
            },
            { threshold: 0.01, rootMargin: '0px 0px -20px 0px' }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, []);

    return (
        <div ref={ref} className={`section-reveal anim-${animation} ${className}`}>
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

                    {/* Section 1: ImpactData — slides up (classic) */}
                    <SectionReveal animation="slide-up">
                        <SectionCard>
                            <div id="journal">
                                <ImpactData />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 2: Features — slides in from left */}
                    <SectionReveal animation="slide-left">
                        <SectionCard>
                            <div id="work">
                                <Features onNavigate={handleServiceClick} />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <div id="solutions" aria-hidden="true"></div>
                    <SectionDivider />

                    {/* Section 3: Process — zooms in from small + blurred */}
                    <SectionReveal animation="zoom-in">
                        <SectionCard>
                            <div id="methodology">
                                <Process />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 4: BusinessAI — slides in from right */}
                    <SectionReveal animation="slide-right">
                        <SectionCard>
                            <div id="ai-lab">
                                <BusinessAI />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 5: Proof — 3D flip from below */}
                    <SectionReveal animation="flip-up">
                        <SectionCard>
                            <div id="company">
                                <Proof />
                            </div>
                        </SectionCard>
                    </SectionReveal>

                    <SectionDivider />

                    {/* Section 6: CTA — cinematic fade-blur reveal */}
                    <SectionReveal animation="fade-blur">
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