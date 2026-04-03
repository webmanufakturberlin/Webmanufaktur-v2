import React, { useState, useEffect, Suspense } from 'react';
import { DESIGN_VARIANTS } from './designs/registry';
import App from '../App';
import { useI18n } from '../i18n';
import { Palette, X } from 'lucide-react';

import { HuntHUD } from '../components/ScavengerHunt/HuntHUD';
import { ClueModal } from '../components/ScavengerHunt/ClueModal';
import { SecretPage } from '../components/ScavengerHunt/SecretPage';
import { useHuntStore } from '../stores/huntStore';

const DesignSwitcher: React.FC = () => {
  const [activeDesignId, setActiveDesignId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const showSecretPage = useHuntStore((s) => s.showSecretPage);
  const { lang, setLang } = useI18n();

  // Sync language with URL and update document lang
  useEffect(() => {
    if (window.location.pathname.startsWith('/en')) {
      setLang('en');
    } else {
      setLang('de');
    }
  }, [setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const activeDesign = DESIGN_VARIANTS.find(d => d.id === activeDesignId);

  // Load from session storage on mount & prevent scroll restoration
  useEffect(() => {
    // Prevent browser from restoring scroll position after reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const savedDesign = sessionStorage.getItem('wmb-design');
    if (savedDesign && DESIGN_VARIANTS.some(d => d.id === savedDesign)) {
      setActiveDesignId(savedDesign);
    }
    setIsInitializing(false);
  }, []);

  // Handle body class changes to scope the CSS properly
  useEffect(() => {
    // Remove all design classes first
    DESIGN_VARIANTS.forEach(design => {
      document.body.classList.remove(design.cssClass);
    });

    if (activeDesignId) {
      const activeDesign = DESIGN_VARIANTS.find(d => d.id === activeDesignId);
      if (activeDesign) {
        document.body.classList.add(activeDesign.cssClass);
        // Clear any inline styles that might override the CSS class
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    } else {
        // Original design relies on some default body resets, ensure they represent the original state
        document.body.style.backgroundColor = '#040406';
        document.body.style.color = '#E2E8F0';
    }

    // Handle Font loading
    const existingFonts = document.querySelectorAll('link[data-design-font]');
    existingFonts.forEach(el => el.remove());

    if (activeDesign && activeDesign.fonts) {
      activeDesign.fonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.setAttribute('data-design-font', 'true');
        document.head.appendChild(link);
      });
    }

  }, [activeDesignId, activeDesign]);

  const handleSelectDesign = (id: string | null) => {
    // Save choice to sessionStorage FIRST
    if (id) {
      sessionStorage.setItem('wmb-design', id);
    } else {
      sessionStorage.removeItem('wmb-design');
    }
    
    // Scroll to top before reload so browser doesn't restore mid-page position
    window.scrollTo(0, 0);
    // Hard reload to fully clear WebGL contexts from previous design.
    window.location.reload();
  };

  if (isInitializing) return null;

  const ActiveComponent = activeDesignId 
    ? DESIGN_VARIANTS.find(d => d.id === activeDesignId)?.component 
    : App;

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">Initializing Simulation...</div>}>
        {ActiveComponent ? <ActiveComponent /> : <App />}
      </Suspense>

      {/* Scavenger Hunt UI — global across all designs */}
      <HuntHUD />
      <ClueModal />
      {showSecretPage && <SecretPage />}

      {/* Floating UI */}
      <div className="fixed bottom-6 right-6 z-[99999] font-sans">
        {!isOpen && (
          <div className="group flex flex-col items-end gap-2 relative">
            {/* Attention-grabbing Arrow Indicator */}
            <div className="hidden md:flex absolute bottom-[110%] mb-4 right-0 flex-col items-end animate-bounce pointer-events-none">
              <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest font-mono py-1 px-3 rounded-md shadow-[0_0_15px_rgba(37,99,235,0.7)] mb-1 whitespace-nowrap">
                Design Switcher
              </div>
              <svg 
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)] mr-3 md:mr-4"
              >
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </div>
            
            <button 
              onClick={() => setIsOpen(true)}
              className="bg-white text-black p-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform cursor-pointer relative overflow-hidden group-hover:bg-blue-600 group-hover:text-white"
            >
              <Palette className="w-6 h-6 relative z-10" />
            </button>
          </div>
        )}

        {isOpen && (
          <div className="bg-[#09090B] border border-white/10 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white w-80 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold tracking-wider uppercase text-sm">Design Matrix</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-white/70 mb-4">
              Wähle eine andere Simulation aus unserem Portfolio.
            </p>

            <div className="space-y-2">
              <button 
                onClick={() => handleSelectDesign(null)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeDesignId === null 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 hover:bg-white/5'
                }`}
              >
                <div className="font-semibold text-sm">Original (Neon)</div>
                <div className="text-xs text-white/50 mt-1">Das Cyber-Atelier</div>
              </button>

              {DESIGN_VARIANTS.map(design => (
                <button 
                  key={design.id}
                  onClick={() => handleSelectDesign(design.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeDesignId === design.id 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="font-semibold text-sm">{design.name}</div>
                  <div className="text-xs text-white/50 mt-1">{design.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Global type augmentation to silence TS error about window.gsap
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export default DesignSwitcher;
