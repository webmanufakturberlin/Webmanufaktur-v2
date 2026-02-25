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

// Section wrapper that reveals on scroll
const SectionReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                }
            },
            { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, []);

    return (
        <div ref={ref} className={`section-reveal ${className}`}>
            {children}
        </div>
    );
};

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'home' | 'service' | 'about'>('home');
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

    const scrollPositionRef = useRef(0);

    const handleNavigate = (id: string) => {
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

                {/* Floating content container — lifts off the background */}
                <div className="relative z-20 -mt-6 rounded-t-[2.5rem] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.06)] overflow-hidden">

                    <SectionReveal>
                        <div id="journal">
                            <ImpactData />
                        </div>
                    </SectionReveal>

                    <SectionReveal>
                        <div id="work">
                            <Features onNavigate={handleServiceClick} />
                        </div>
                    </SectionReveal>

                    <div id="solutions" aria-hidden="true"></div>

                    <SectionReveal>
                        <div id="methodology">
                            <Process />
                        </div>
                    </SectionReveal>

                    <SectionReveal>
                        <div id="ai-lab">
                            <BusinessAI />
                        </div>
                    </SectionReveal>

                    <SectionReveal>
                        <div id="company">
                            <Proof />
                        </div>
                    </SectionReveal>

                    <SectionReveal>
                        <div id="contact">
                            <CTA />
                        </div>
                    </SectionReveal>

                </div>
            </main>
        </div>
    );
};

export default App;