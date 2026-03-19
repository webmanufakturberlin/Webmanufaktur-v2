import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, ShieldCheck, Wrench, ArrowRight, Phone, Mail, MapPin, Activity } from 'lucide-react';
import './industriell.css';

gsap.registerPlugin(ScrollTrigger);

export default function IndustriellApp() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<SVGCircleElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineFillRef = useRef<HTMLDivElement>(null);
  const inspectionCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Text Animation
      gsap.from(".hero-text-line", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "bounce.out",
        stagger: 0.15,
        delay: 0.2
      });

      // Gauge Animation
      if (gaugeRef.current) {
        gsap.to(gaugeRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".gauge-container",
            start: "top 80%",
          }
        });
      }

      // Timeline Fill Animation
      if (timelineRef.current && timelineFillRef.current) {
        gsap.to(timelineFillRef.current, {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          }
        });

        // Timeline Steps
        gsap.utils.toArray<HTMLElement>('.timeline-step').forEach((step) => {
          gsap.fromTo(step, 
            { opacity: 0.3, x: -20 },
            { 
              opacity: 1, 
              x: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: step,
                start: "top center",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inspectionCardRef.current) return;
    const rect = inspectionCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    inspectionCardRef.current.style.setProperty('--mouse-x', `${x}px`);
    inspectionCardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div ref={mainRef} className="min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-sm border-b-4 border-[#B87333] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Zap className="text-[#EAB308] w-8 h-8" />
          <div>
            <h1 className="font-heading text-3xl tracking-wider text-white leading-none font-[Teko]">WEBMANUFAKTUR</h1>
            <p className="font-data text-[10px] text-[#B87333] tracking-widest uppercase font-[Fira_Code]">Berlin</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 font-data text-sm tracking-widest font-[Fira_Code]">
          <a href="#capabilities" className="hover:text-[#B87333] transition-colors">LEISTUNGEN</a>
          <a href="#protocol" className="hover:text-[#B87333] transition-colors">PROZESS</a>
          <a href="#dispatch" className="hover:text-[#B87333] transition-colors">KONTAKT</a>
        </div>
        <button className="btn-mechanical bg-[#EAB308] text-[#121212] font-heading text-xl px-6 py-2 border-b-[#121212]/50 hover:bg-yellow-400 flex items-center gap-2 font-[Teko]">
          PROJEKT STARTEN <ArrowRight className="w-5 h-5" />
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[85dvh] border-b-4 border-[#121212]/50 overflow-hidden p-4 md:p-8">
        <div className="absolute inset-4 border-4 border-[#B87333]/30 z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[#121212]/60 z-0"></div>
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop" 
          alt="Premium Webdesign Architect" 
          className="absolute inset-0 w-full h-full object-cover -z-10"
          referrerPolicy="no-referrer"
        />
        
        {/* HUD Elements */}
        <div className="absolute top-8 right-8 z-20 flex items-center gap-2 font-data text-xs text-[#EAB308] font-[Fira_Code]">
          <span className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse"></span>
          SYSTEM ACTIVE
        </div>
        <div className="absolute bottom-8 left-8 z-20 font-data text-xs text-[#B87333] opacity-70 font-[Fira_Code]">
          COORD: 52.5200° N, 13.4050° E<br/>
          STATUS: DEPLOYED
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center max-w-5xl mx-auto px-4" ref={heroTextRef}>
          <div className="overflow-hidden">
            <h2 className="hero-text-line font-heading text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tight uppercase font-[Teko]">
              BUILDING THE
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="hero-text-line font-heading text-6xl md:text-8xl lg:text-9xl text-[#B87333] leading-[0.85] tracking-tight uppercase font-[Teko]">
              DIGITAL FRONTIER.
            </h2>
          </div>
          <div className="overflow-hidden mt-6">
            <p className="hero-text-line font-drama text-xl md:text-2xl text-[#D1D5DB] max-w-2xl font-semibold font-[Exo_2]">
              Premium Webdesign, Content-Strategie und KI-Integration. Handgefertigt in Berlin für ambitionierte Marken.
            </p>
          </div>
        </div>
      </section>

      {/* CAPABILITIES (TOOLBELT) */}
      <section id="capabilities" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-16 border-l-4 border-[#B87333] pl-6">
          <h3 className="font-data text-[#B87333] text-sm tracking-widest mb-2 font-[Fira_Code]">01 // KERNKOMPETENZEN</h3>
          <h2 className="font-heading text-5xl text-white uppercase font-[Teko]">Unsere Leistungen</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Blueprint Reveal */}
          <div className="blueprint-reveal border-2 border-[#D1D5DB]/20 bg-[#121212] h-96 flex flex-col justify-end p-6 group cursor-crosshair">
            <img 
              src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?q=80&w=2000&auto=format&fit=crop" 
              alt="Server Room" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="font-data text-[#EAB308] text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-[Fira_Code]">SCHEMATIC VIEW ACTIVE</div>
              <h4 className="font-heading text-3xl text-white uppercase font-[Teko]">Spatial Web Design</h4>
              <p className="font-data text-sm text-[#D1D5DB]/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-[Fira_Code]">
                Immersive 3D-Welten und hochperformante Web-Erlebnisse, die echte Markenabgrenzung schaffen.
              </p>
            </div>
          </div>

          {/* Card 2: Calibration Gauge */}
          <div className="gauge-container border-2 border-[#D1D5DB]/20 bg-[#1a1a1a] h-96 p-6 flex flex-col items-center justify-center relative">
            <div className="absolute top-6 left-6 font-data text-[#B87333] text-xs font-[Fira_Code]">SYS.LOAD</div>
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#333" strokeWidth="8" />
              <circle 
                ref={gaugeRef}
                cx="60" cy="60" r="54" fill="none" stroke="#EAB308" strokeWidth="8" 
                strokeDasharray="339.292" strokeDashoffset="339.292" 
                strokeLinecap="square"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col mt-4">
              <span className="font-heading text-5xl text-white font-[Teko]">100<span className="text-2xl text-[#EAB308]">%</span></span>
              <span className="font-data text-[10px] text-[#D1D5DB] tracking-widest font-[Fira_Code]">PRECISION</span>
            </div>
            <div className="absolute bottom-6 w-full px-6 text-center">
              <h4 className="font-heading text-2xl text-white uppercase font-[Teko]">KI-Integration</h4>
              <p className="font-data text-xs text-[#D1D5DB]/60 mt-1 font-[Fira_Code]">Automatisierung und intelligente Systeme für skalierbare Geschäftsprozesse.</p>
            </div>
          </div>

          {/* Card 3: Inspection Light */}
          <div 
            ref={inspectionCardRef}
            onMouseMove={handleMouseMove}
            className="inspection-card border-2 border-[#D1D5DB]/20 bg-[#0a0a0a] h-96 p-6 flex flex-col justify-end cursor-crosshair"
          >
            <div className="relative z-10">
              <Activity className="text-[#B87333] w-8 h-8 mb-4 opacity-50" />
              <h4 className="font-heading text-3xl text-white uppercase font-[Teko]">Premium E-Commerce</h4>
              <p className="font-data text-sm text-[#D1D5DB]/80 mt-2 font-[Fira_Code]">
                Konversionsstarke Online-Shops mit unvergleichlicher User Experience und robuster Architektur.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* STANDARD OF EXCELLENCE */}
      <section className="bg-warning-stripe py-24 border-y-4 border-[#B87333] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#121212]/80"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <ShieldCheck className="w-16 h-16 text-[#EAB308] mx-auto mb-8" />
          <h2 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none mb-6 font-[Teko]">
            Viele Agenturen nutzen Templates.<br/>
            <span className="text-[#B87333]">Wir entwickeln digitale Unikate für absolute Performance.</span>
          </h2>
          <p className="font-data text-lg text-[#D1D5DB] max-w-2xl mx-auto font-[Fira_Code]">
            Jede Codezeile, jede Animation und jedes technische Detail wird mit höchster Präzision ausgeführt. Wir machen keine Kompromisse.
          </p>
        </div>
      </section>

      {/* PROTOCOL (CONDUIT TIMELINE) */}
      <section id="protocol" className="py-24 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-16 border-l-4 border-[#B87333] pl-6">
          <h3 className="font-data text-[#B87333] text-sm tracking-widest mb-2 font-[Fira_Code]">02 // EXECUTION PROTOCOL</h3>
          <h2 className="font-heading text-5xl text-white uppercase font-[Teko]">Der Prozess</h2>
        </div>

        <div className="relative pl-8 md:pl-16" ref={timelineRef}>
          {/* The Pipe */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#222] border-x border-[#333]">
            {/* The Fill */}
            <div ref={timelineFillRef} className="w-full bg-[#B87333] h-0 shadow-[0_0_15px_rgba(184,115,51,0.5)]"></div>
          </div>

          {/* Steps */}
          <div className="space-y-24 py-12">
            {[
              { title: "Strategie & Konzept", desc: "Tiefgründige Analyse der Markenidentität und Zielgruppe zur Entwicklung einer massgeschneiderten Architektur." },
              { title: "Design & Prototyping", desc: "Erstellung von Wireframes und hochauflösenden Visual Designs mit interaktiven Elementen." },
              { title: "Spezialisiertes Web Development", desc: "Pixel-perfekte technische Umsetzung unter Einsatz modernster Frameworks und 3D-Technologien." },
              { title: "Launch & Performance", desc: "Riguroses Testing, SEO-Optimierung und nahtlose Veröffentlichung des digitalen Produkts." }
            ].map((step, idx) => (
              <div key={idx} className="timeline-step relative">
                <div className="absolute -left-[42px] md:-left-[74px] top-2 w-6 h-6 bg-[#121212] border-4 border-[#B87333] rounded-full z-10"></div>
                <h4 className="font-data text-[#EAB308] text-sm mb-2 font-[Fira_Code]">PHASE 0{idx + 1}</h4>
                <h3 className="font-heading text-4xl text-white uppercase font-[Teko]">{step.title}</h3>
                <p className="font-drama text-[#D1D5DB] mt-2 text-lg font-[Exo_2]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISPATCH / ESTIMATE */}
      <section id="dispatch" className="py-24 px-4 md:px-8 bg-[#0f0f0f] border-t-2 border-[#D1D5DB]/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="mb-8 border-l-4 border-[#EAB308] pl-6">
              <h3 className="font-data text-[#EAB308] text-sm tracking-widest mb-2 font-[Fira_Code]">03 // INITIATE</h3>
              <h2 className="font-heading text-5xl text-white uppercase font-[Teko]">Projekt Starten</h2>
            </div>
            <p className="font-drama text-xl text-[#D1D5DB] mb-8 font-[Exo_2]">
              Bereit für ein Upgrade der digitalen Infrastruktur? Senden Sie uns die Parameter Ihres nächsten Vorhabens.
            </p>
            
            <div className="space-y-6 font-data text-sm font-[Fira_Code]">
              <div className="flex items-center gap-4 border-2 border-[#D1D5DB]/20 p-4 bg-[#121212]">
                <Phone className="text-[#B87333] w-6 h-6" />
                <div>
                  <div className="text-[#D1D5DB]/60 text-xs">DIREKTDURCHWAHL</div>
                  <div className="text-white text-lg">+49 (0) 176 8052 8232</div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-2 border-[#D1D5DB]/20 p-4 bg-[#121212]">
                <Mail className="text-[#B87333] w-6 h-6" />
                <div>
                  <div className="text-[#D1D5DB]/60 text-xs">PROJEKTANFRAGEN</div>
                  <div className="text-white text-lg break-all">webmanufaktur.berlin@googlemail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-2 border-[#D1D5DB]/20 p-4 bg-[#121212]">
                <MapPin className="text-[#B87333] w-6 h-6" />
                <div>
                  <div className="text-[#D1D5DB]/60 text-xs">HQ COORDINATES</div>
                  <div className="text-white text-lg">Berlin, Germany</div>
                </div>
              </div>
            </div>
          </div>

          {/* The Clipboard Form */}
          <div className="border-4 border-[#333] bg-[#1a1a1a] p-8 relative shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-6 bg-[#444] border-2 border-[#222] rounded-sm"></div>
            <h3 className="font-data text-white text-xl mb-8 border-b-2 border-[#333] pb-4 flex justify-between font-[Fira_Code]">
              <span>PROJEKTANFRAGE</span>
              <span className="text-[#EAB308]">#WM-{Math.floor(Math.random() * 10000)}</span>
            </h3>
            
            <form className="space-y-6 font-data font-[Fira_Code]" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-[#D1D5DB]/60 mb-2">NAME / UNTERNEHMEN</label>
                  <input type="text" className="w-full bg-[#121212] border-2 border-[#333] p-3 text-white focus:border-[#B87333] outline-none transition-colors" placeholder="Name eingeben..." />
                </div>
                <div>
                  <label className="block text-xs text-[#D1D5DB]/60 mb-2">KONTAKTDATEN</label>
                  <input type="text" className="w-full bg-[#121212] border-2 border-[#333] p-3 text-white focus:border-[#B87333] outline-none transition-colors" placeholder="Telefon / E-Mail..." />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#D1D5DB]/60 mb-2">PROJEKT PARAMETER</label>
                <textarea rows={4} className="w-full bg-[#121212] border-2 border-[#333] p-3 text-white focus:border-[#B87333] outline-none transition-colors resize-none" placeholder="Beschreibe die digitalen Anforderungen..."></textarea>
              </div>
              <div className="pt-4">
                <button className="btn-mechanical w-full bg-[#B87333] text-white font-heading font-[Teko] text-2xl py-4 border-b-[#8B5A2B] hover:bg-[#c9823f] flex items-center justify-center gap-3">
                  <Wrench className="w-6 h-6" /> ANFRAGE SENDEN
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t-8 border-[#B87333] pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-[#EAB308] w-8 h-8" />
              <h1 className="font-heading text-4xl tracking-wider text-white leading-none font-[Teko]">WEBMANUFAKTUR</h1>
            </div>
            <p className="font-data text-sm text-[#D1D5DB]/60 max-w-sm font-[Fira_Code]">
              Premium Webdesign, Development und strategische Umsetzung für Marken, die digital den Ton angeben wollen.
            </p>
          </div>
          <div>
            <h4 className="font-data text-white text-sm tracking-widest mb-6 border-b-2 border-[#333] pb-2 font-[Fira_Code]">EXPERTISE</h4>
            <ul className="font-data text-xs text-[#D1D5DB]/60 space-y-3 font-[Fira_Code]">
              <li>React & Next.js Ecosystem</li>
              <li>WebGL & 3D Interactive</li>
              <li>Conversion Rate Optimization</li>
              <li>Brand Strategy & Copywriting</li>
            </ul>
          </div>
          <div>
            <h4 className="font-data text-white text-sm tracking-widest mb-6 border-b-2 border-[#333] pb-2 font-[Fira_Code]">LEGAL</h4>
            <ul className="font-data text-xs text-[#D1D5DB]/60 space-y-3 font-[Fira_Code]">
              <li><a href="/impressum" className="hover:text-[#B87333]">Impressum</a></li>
              <li><a href="/datenschutz" className="hover:text-[#B87333]">Datenschutz</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t-2 border-[#222] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-data text-xs text-[#D1D5DB]/40 font-[Fira_Code]">© {new Date().getFullYear()} WEBMANUFAKTUR BERLIN. ALL RIGHTS RESERVED.</p>
          <p className="font-heading text-2xl md:text-3xl text-white/20 tracking-widest font-[Teko]">HANDCRAFTED DIGITAL EXPERIENCES.</p>
        </div>
      </footer>
    </div>
  );
}
