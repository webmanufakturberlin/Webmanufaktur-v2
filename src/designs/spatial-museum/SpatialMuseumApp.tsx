import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene } from './components/Scene';
import { LiquidCursor } from './components/LiquidCursor';
import { LimelightNav } from './components/ui/limelight-nav';
import DisplayCards from './components/ui/display-cards';
import ExpandOnHover from './components/ui/expand-cards';
import { useStore } from './store';
import { Sparkles, Layers, Box, Mail, ArrowRight } from 'lucide-react';

import './spatial-museum.css';

gsap.registerPlugin(ScrollTrigger);

export default function SpatialMuseumApp() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress, setCursorState } = useStore();

  useEffect(() => {
    if (!scrollContainerRef.current || !canvasRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          onUpdate: (self) => setScrollProgress(self.progress)
        }
      });

      // Spatial Path: U-Shape
      tl.to(canvasRef.current, { x: "-100vw", ease: "power1.inOut", duration: 1 })
        .to(canvasRef.current, { y: "-100vh", ease: "power1.inOut", duration: 1 })
        .to(canvasRef.current, { x: "0vw", ease: "power1.inOut", duration: 1 });

      // Breathing Animation for Artifacts
      gsap.to(".museum-artifact", {
        y: "-=15",
        rotationZ: () => Math.random() * 2 - 1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { amount: 2, from: "random" }
      });

      // Entrance Animations
      gsap.from(".hero-text-line", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.5
      });

    }, scrollContainerRef);

    return () => ctx.revert();
  }, [setScrollProgress]);

  const navItems = [
    { id: 'home', icon: <Box />, label: 'The Hook', onClick: () => window.scrollTo(0, 0) },
    { id: 'arsenal', icon: <Layers />, label: 'The Arsenal', onClick: () => window.scrollTo(0, window.innerHeight * 1.3) },
    { id: 'exhibition', icon: <Sparkles />, label: 'The Exhibition', onClick: () => window.scrollTo(0, window.innerHeight * 2.6) },
    { id: 'nexus', icon: <Mail />, label: 'The Nexus', onClick: () => window.scrollTo(0, window.innerHeight * 4) },
  ];

  return (
    <>
      <LiquidCursor />
      <Scene />

      {/* Fixed Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40]">
        <LimelightNav items={navItems} />
      </div>

      {/* Scroll Trigger Container */}
      <div ref={scrollContainerRef} className="h-[400vh] w-full relative z-[10]">

        {/* Viewport for the Spatial Canvas */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">

          {/* The Massive Spatial Canvas (200vw x 200vh) */}
          <div ref={canvasRef} className="absolute top-0 left-0 w-[200vw] h-[200vh] pointer-events-auto">

            {/* SECTION 1: THE HOOK (Top-Left) */}
            <section className="absolute top-0 left-0 w-[100vw] h-[100vh] flex flex-col items-center justify-center px-12">
              <div className="max-w-5xl w-full">
                <p className="font-mono text-sm tracking-[0.3em] uppercase mb-8 text-black/50 hero-text-line">WebManufaktur Berlin</p>
                <h1 className="text-7xl md:text-9xl font-serif font-medium leading-[0.9] tracking-tighter mb-12">
                  <div className="overflow-hidden"><span className="block hero-text-line">Digital</span></div>
                  <div className="overflow-hidden"><span className="block hero-text-line text-drama ml-12 md:ml-32">Sculptures</span></div>
                </h1>
                <p className="text-xl md:text-2xl font-sans font-light max-w-xl text-black/70 hero-text-line">
                  We do not build websites. We curate high-fidelity spatial environments for brands that demand absolute perfection.
                </p>
              </div>
            </section>

            {/* SECTION 2: THE ARSENAL (Top-Right) */}
            <section className="absolute top-0 left-[100vw] w-[100vw] h-[100vh] flex items-center justify-center px-12">
               <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-20">
                  <div className="max-w-lg museum-artifact">
                    <h2 className="text-5xl md:text-7xl font-serif mb-8">The Arsenal</h2>
                    <p className="text-lg font-sans font-light text-black/70 mb-8">
                      Our capabilities extend beyond the DOM. We engineer physical interactions, global illumination, and fluid typography.
                    </p>
                  </div>
                  <div className="museum-artifact">
                    <DisplayCards />
                  </div>
               </div>
            </section>

            {/* SECTION 3: THE EXHIBITION (Bottom-Right) */}
            <section className="absolute top-[100vh] left-[100vw] w-[100vw] h-[100vh] flex flex-col items-center justify-center px-12">
              <div className="w-full max-w-7xl mb-16 flex justify-between items-end museum-artifact">
                <h2 className="text-5xl md:text-7xl font-serif">The Exhibition</h2>
                <p className="font-mono text-sm uppercase tracking-widest text-black/50">Selected Works 2026</p>
              </div>
              <div className="w-full museum-artifact">
                <ExpandOnHover />
              </div>
            </section>

            {/* SECTION 4: THE NEXUS (Bottom-Left) */}
            <section className="absolute top-[100vh] left-0 w-[100vw] h-[100vh] flex items-center justify-center px-12">
               <div className="max-w-4xl text-center museum-artifact">
                  <h2 className="text-6xl md:text-8xl font-serif mb-12">Initiate Contact</h2>
                  <p className="text-2xl font-sans font-light text-black/70 mb-16">
                    Ready to transcend the standard web? Step into the void.
                  </p>
                  <button
                    onMouseEnter={() => setCursorState('hover')}
                    onMouseLeave={() => setCursorState('default')}
                    className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#09090B] text-white rounded-full overflow-hidden transition-transform hover:scale-105"
                  >
                    <span className="relative z-10 font-mono text-sm uppercase tracking-widest">Enter the Nexus</span>
                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-2" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
               </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
