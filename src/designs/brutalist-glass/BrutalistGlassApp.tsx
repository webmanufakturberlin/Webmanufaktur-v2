import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { BerlinBear } from '../../../components/ScavengerHunt/BerlinBear';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store';

import './brutalist-glass.css';

import { CustomCursor } from './components/CustomCursor';
import { WebGLScene } from './components/webgl/Scene';
import { ZoomParallax } from './components/ui/zoom-parallax';
import { GlowingEffect } from './components/ui/glowing-effect';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import HolographicCard from './components/ui/holographic-card';
import { ArrowRight, Code, Layers, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BrutalistGlassApp() {
  const setScrollProgress = useAppStore((state) => state.setScrollProgress);
  const setIsHoveringInteractive = useAppStore((state) => state.setIsHoveringInteractive);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const lenis = new Lenis({
      duration: isTouch ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: isTouch ? 1.5 : 2,
    });

    lenis.on('scroll', (e: any) => {
      setScrollProgress(e.progress);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP ScrollTrigger Integration with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [setScrollProgress]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slab Grinding Animation
      gsap.utils.toArray('.concrete-slab').forEach((slab: any) => {
        gsap.fromTo(
          slab,
          { y: '20vh', opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: slab,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Text Reveal Animation
      gsap.utils.toArray('.brutal-text-reveal').forEach((text: any) => {
        gsap.fromTo(
          text,
          { clipPath: 'inset(100% 0 0 0)', y: 50 },
          {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            duration: 1.2,
            ease: 'power4.inOut',
            stagger: 0.1,
            scrollTrigger: {
              trigger: text,
              start: 'top 80%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => setIsHoveringInteractive(true);
  const handleMouseLeave = () => setIsHoveringInteractive(false);

  const parallaxImages = [
    { src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1280&h=720&fit=crop&q=80', alt: 'Brutalist Architecture 1' },
    { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&q=80', alt: 'Brutalist Architecture 2' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop&q=80', alt: 'Concrete Texture' },
    { src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1280&h=720&fit=crop&q=80', alt: 'Abstract Geometry' },
    { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&q=80', alt: 'Minimalist Concrete' },
    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&q=80', alt: 'Urban Structure' },
    { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&q=80', alt: 'Glass Reflection' },
  ];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-transparent selection:bg-[#CCFF00] selection:text-black">
      <CustomCursor />
      <WebGLScene />

      {/* FLOOR 1: THE HOOK (Zoom Parallax) */}
      <section className="relative w-full">
        <div className="sticky top-0 h-screen w-full z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
          <h1 className="font-display text-5xl sm:text-7xl md:text-[12vw] leading-[0.8] tracking-tighter text-white uppercase text-center brutal-text-reveal">
            Digital<br />Concrete
          </h1>
          <p className="mt-6 md:mt-8 font-mono text-[#CCFF00] text-xs sm:text-sm md:text-base tracking-widest uppercase brutal-text-reveal px-4">
            We build impossible web experiences.
          </p>
        </div>
        <div className="-mt-[100vh]">
          <ZoomParallax images={parallaxImages} />
        </div>
      </section>

      {/* FLOOR 2: THE ARSENAL (Glowing Effect Cards) */}
      <section className="relative w-full py-32 px-4 md:px-12 max-w-[100rem] mx-auto z-10">
        <div className="mb-20 concrete-slab">
          <h2 className="font-display text-5xl md:text-8xl uppercase tracking-tighter text-white leading-none">
            The Arsenal
          </h2>
          <div className="w-full h-1 bg-[#1A1A1A] mt-8"></div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 concrete-slab">
          {[
            { icon: <Code />, title: "WebGL Engineering", desc: "Custom shaders, Three.js, and raw performance." },
            { icon: <Layers />, title: "Brutalist Design", desc: "Unapologetic, heavy, and structurally sound interfaces." },
            { icon: <Zap />, title: "Motion Physics", desc: "GSAP-driven cinematic scroll experiences." }
          ].map((item, i) => (
            <li key={i} className="relative min-h-[20rem] list-none group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="relative h-full border-4 border-[#1A1A1A] p-4 bg-black transition-transform duration-500 hover:-translate-y-2 hover:translate-x-2 brutal-box-shadow">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={4} />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden bg-black p-6 z-10">
                  <div className="w-12 h-12 border-2 border-[#1A1A1A] flex items-center justify-center text-[#CCFF00]">
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black font-sans tracking-tighter uppercase text-white">
                      {item.title}
                    </h3>
                    <p className="font-mono text-sm text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FLOOR 3: THE EXHIBITION (Container Scroll + Holographic Cards) */}
      <section className="relative w-full py-32 z-10 bg-black/50 backdrop-blur-sm">
        {isMobile ? (
          <div className="px-4">
            <div className="mb-8 concrete-slab">
              <h2 className="font-display text-5xl uppercase tracking-tighter text-white leading-none">
                The Exhibition
              </h2>
              <p className="font-mono text-[#CCFF00] mt-4 uppercase tracking-widest">Selected Works</p>
            </div>
            <div className="flex flex-col gap-4 bg-[#0a0a0a] p-4">
              <HolographicCard
                title="Project Alpha"
                description="E-Commerce Redefined"
                image="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&h=600&fit=crop&q=80"
              />
              <HolographicCard
                title="Project Beta"
                description="Immersive WebGL Portfolio"
                image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80"
              />
            </div>
          </div>
        ) : (
          <ContainerScroll
            titleComponent={
              <div className="mb-8 concrete-slab">
                <h2 className="font-display text-5xl md:text-8xl uppercase tracking-tighter text-white leading-none">
                  The Exhibition
                </h2>
                <p className="font-mono text-[#CCFF00] mt-4 uppercase tracking-widest">Scroll to unlock the vault</p>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4 bg-[#0a0a0a]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <HolographicCard
                title="Project Alpha"
                description="E-Commerce Redefined"
                image="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&h=600&fit=crop&q=80"
              />
              <HolographicCard
                title="Project Beta"
                description="Immersive WebGL Portfolio"
                image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80"
              />
            </div>
          </ContainerScroll>
        )}
      </section>

      {/* FLOOR 4: THE NEXUS (Footer/Contact) */}
      <section className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-12 z-10">
        {/* Scavenger Hunt Bear #4 */}
        <BerlinBear bearId={4} className="absolute top-8 right-8 z-20" />
        <div className="w-full max-w-5xl border-4 border-[#1A1A1A] bg-black p-8 md:p-20 concrete-slab relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#CCFF00] transform scale-y-0 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:scale-y-100 z-0"></div>

          <div className="relative z-10 flex flex-col items-start gap-8 mix-blend-difference text-white">
            <h2 className="font-display text-4xl sm:text-6xl md:text-[8vw] uppercase tracking-tighter leading-none">
              Initiate<br/>Protocol
            </h2>
            <p className="font-mono text-base md:text-lg max-w-md">
              Ready to cast your vision in digital concrete? We are accepting new clients for Q3.
            </p>

            <a
              href="mailto:hello@webmanufaktur.berlin"
              className="mt-8 flex items-center gap-4 font-black uppercase tracking-widest text-xl border-b-4 border-white pb-2 hover:pr-8 transition-all duration-300"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Contact Us <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
