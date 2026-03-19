/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene from './components/Scene';
import LiquidCursor from './components/LiquidCursor';
import { useAppStore } from './store';
import './liquid-glass.css';

gsap.registerPlugin(ScrollTrigger);

export default function LiquidGlassApp() {
  const { setHoveredService, setCtaHovered, ctaHovered } = useAppStore();
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Breathing animation for artifacts
    gsap.to(".museum-artifact", {
      y: "-=10",
      rotationZ: () => Math.random() * 2 - 1,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { amount: 2, from: "random" }
    });

    // Horizontal scroll for Philosophy section
    if (horizontalRef.current) {
      const sections = gsap.utils.toArray('.horizontal-panel');
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        ScrollTrigger: {
          trigger: horizontalRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + horizontalRef.current?.offsetWidth
        }
      });
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${ctaHovered ? 'bg-ink text-white' : 'bg-transparent text-ink'}`}>
      <LiquidCursor />
      <Scene />

      {/* HERO: The Exhibition */}
      <section className="h-screen flex flex-col items-center justify-center relative px-8">
        <h1 className="museum-artifact font-serif text-6xl md:text-9xl tracking-tighter text-center leading-[0.85]">
          BERLIN<br /><span className="italic font-light">DIGITAL</span>
        </h1>
        <p className="museum-artifact mt-8 font-mono text-sm uppercase tracking-widest opacity-50">
          Elevating brands through immersive physics.
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-ink origin-top animate-pulse" />
      </section>

      {/* SERVICES: The Pedestals */}
      <section className="py-32 px-8 md:px-24">
        {[
          { id: 1, title: "Spatial Web Design", desc: "We build environments, not pages." },
          { id: 2, title: "WebGL Physics", desc: "Living, breathing digital matter." },
          { id: 3, title: "High-Fidelity E-Commerce", desc: "Transactions as art exhibitions." }
        ].map((service) => (
          <div 
            key={service.id}
            className="min-h-[150vh] flex flex-col justify-center hover-trigger"
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <h2 className="font-serif text-5xl md:text-8xl tracking-tight mb-6">
              {service.title}
            </h2>
            <p className="font-mono text-sm md:text-base max-w-md opacity-60">
              {service.desc}
            </p>
          </div>
        ))}
      </section>

      {/* PHILOSOPHY: The Infinite White */}
      <section ref={horizontalRef} className="h-screen flex flex-nowrap overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="horizontal-panel w-screen h-screen flex-shrink-0 flex items-center justify-center px-8">
          <h2 className="font-serif text-6xl md:text-9xl italic">The Infinite</h2>
        </div>
        <div className="horizontal-panel w-screen h-screen flex-shrink-0 flex items-center justify-center px-8">
          <h2 className="font-serif text-6xl md:text-9xl">White</h2>
        </div>
        <div className="horizontal-panel w-screen h-screen flex-shrink-0 flex items-center justify-center px-8">
          <p className="font-mono text-xl md:text-3xl max-w-3xl text-center leading-relaxed">
            We strip away the noise until only the essential physics remain. 
            Your brand, suspended in perfect digital tension.
          </p>
        </div>
      </section>

      {/* FINAL CTA: The Whisper */}
      <section className="h-screen flex items-center justify-center relative">
        <button 
          className="hover-trigger font-mono text-[12px] uppercase tracking-[0.3em] p-12 transition-opacity duration-500"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          Enter the Matrix
        </button>
      </section>
    </div>
  );
}
