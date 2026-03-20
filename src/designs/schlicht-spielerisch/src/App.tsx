import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from './store';
import VoxelScene from './components/VoxelScene';
import { ArrowRight, Box, Code, Layers, Smartphone, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const setIsHoveringInteractable = useStore((state) => state.setIsHoveringInteractable);
  const setHoveredService = useStore((state) => state.setHoveredService);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate network request
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear fields
      
      // Revert back to idle after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Global Scroll Progress Tracker
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // Domino Flip Animations
      const dominos = gsap.utils.toArray('.domino-flip') as HTMLElement[];
      dominos.forEach((el) => {
        gsap.fromTo(el, 
          {
            rotationX: 90,
            opacity: 0,
          },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            rotationX: 0,
            opacity: 1,
            transformOrigin: 'bottom',
            duration: 0.8,
            ease: 'bounce.out',
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [setScrollProgress]);

  // Hover handlers for cursor
  const handleInteractableEnter = () => setIsHoveringInteractable(true);
  const handleInteractableLeave = () => setIsHoveringInteractable(false);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-3 bg-[#FF5722] border-b-4 border-r-4 border-black z-50 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* WebGL Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Canvas shadows>
          <VoxelScene />
        </Canvas>
      </div>

      {/* DOM Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col gap-[30vh]">
        
        {/* 1. HERO PAGE: "The Foundation" */}
        <section className="min-h-[80vh] flex flex-col justify-center items-start">
          <div className="domino-flip brutal-box p-8 md:p-12 max-w-3xl mb-8">
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-tight tracking-tighter mb-6">
              We Build <br />
              <span className="text-[#FF5722]">Digital Worlds</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-xl">
              The premier Berlin agency for high-fidelity, interactive web experiences. We don't just design; we construct.
            </p>
          </div>
          <button 
            className="domino-flip brutal-btn px-10 py-5 text-xl flex items-center gap-3"
            onMouseEnter={handleInteractableEnter}
            onMouseLeave={handleInteractableLeave}
          >
            Start Construction <ArrowRight size={24} strokeWidth={3} />
          </button>
        </section>

        {/* 2. VALUE PROPOSITION: "The Architecture" */}
        <section className="min-h-screen flex flex-col justify-center">
          <h2 className="domino-flip text-4xl md:text-6xl font-black uppercase mb-16 brutal-box inline-block px-6 py-4 self-start">
            The Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Solid Foundation', desc: 'Robust, scalable codebases built on modern stacks.', icon: <Box size={40} /> },
              { title: 'Pixel Precision', desc: 'Every voxel, every pixel, perfectly aligned to the grid.', icon: <Layers size={40} /> },
              { title: 'High Performance', desc: '60fps WebGL experiences that never drop a frame.', icon: <Zap size={40} /> },
            ].map((prop, i) => (
              <div key={i} className="domino-flip brutal-box p-8 flex flex-col items-start gap-6 bg-white hover:bg-[#E0E0E0] transition-colors duration-300">
                <div className="p-4 bg-[#1A1A24] text-white border-2 border-black shadow-[4px_4px_0px_#FF5722]">
                  {prop.icon}
                </div>
                <h3 className="text-2xl font-bold uppercase">{prop.title}</h3>
                <p className="text-lg font-medium">{prop.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. LEISTUNGEN (SERVICES): "The Core Modules" */}
        <section className="min-h-screen flex flex-col justify-center">
          <h2 className="domino-flip text-4xl md:text-6xl font-black uppercase mb-16 brutal-box inline-block px-6 py-4 self-end bg-[#FF5722] text-white">
            Core Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 1, title: '3D WebGL Development', icon: <Box size={32} /> },
              { id: 2, title: 'Frontend Engineering', icon: <Code size={32} /> },
              { id: 3, title: 'UI/UX Design Systems', icon: <Layers size={32} /> },
              { id: 4, title: 'Mobile Optimization', icon: <Smartphone size={32} /> },
            ].map((service) => (
              <div 
                key={service.id} 
                className="domino-flip brutal-box p-8 flex items-center gap-6 cursor-pointer hover:bg-[#FF5722] hover:text-white transition-colors duration-500 ease-out group"
                onMouseEnter={() => { handleInteractableEnter(); setHoveredService(service.id); }}
                onMouseLeave={() => { handleInteractableLeave(); setHoveredService(null); }}
              >
                <div className="p-4 border-4 border-black bg-white text-black group-hover:shadow-[6px_6px_0px_#1A1A24] transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-110">
                  <span className="service-icon-wrapper">{service.icon}</span>
                </div>
                <h3 className="text-2xl font-bold uppercase">{service.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ABLAUF (PROCESS): "The Assembly Line" */}
        <section className="min-h-screen flex flex-col justify-center">
          <h2 className="domino-flip text-4xl md:text-6xl font-black uppercase mb-16 brutal-box inline-block px-6 py-4 self-start">
            Assembly Line
          </h2>
          <div className="flex flex-col gap-8 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-2 before:bg-black before:z-[-1]">
            {[
              { step: '01', title: 'Blueprint', desc: 'Wireframing and architectural planning.' },
              { step: '02', title: 'Excavation', desc: 'Setting up the repository and infrastructure.' },
              { step: '03', title: 'Construction', desc: 'Building the frontend and WebGL components.' },
              { step: '04', title: 'Launch', desc: 'Deploying the final masterpiece to the grid.' },
            ].map((process, i) => (
              <div key={i} className="domino-flip flex items-center gap-8">
                <div className="w-16 h-16 shrink-0 bg-[#FF5722] border-4 border-black shadow-[4px_4px_0px_#1A1A24] flex items-center justify-center text-white font-black text-2xl">
                  {process.step}
                </div>
                <div className="brutal-box p-6 flex-1">
                  <h3 className="text-2xl font-bold uppercase mb-2">{process.title}</h3>
                  <p className="text-lg font-medium">{process.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PORTFOLIO: "The Masterpieces" */}
        <section className="min-h-screen flex flex-col justify-center items-center overflow-hidden py-24">
          <h2 className="domino-flip text-4xl md:text-6xl font-black uppercase mb-24 brutal-box inline-block px-6 py-4 bg-[#E0E0E0]">
            Masterpieces
          </h2>
          
          <div className="flex flex-wrap justify-center gap-24 md:gap-32 w-full">
            {[
              { title: 'Project Alpha', color: '#FF5722' },
              { title: 'Project Beta', color: '#87CEEB' },
              { title: 'Project Gamma', color: '#E0E0E0' }
            ].map((project, i) => (
              <div 
                key={i} 
                className="domino-flip iso-cube-container cursor-pointer"
                onMouseEnter={handleInteractableEnter}
                onMouseLeave={handleInteractableLeave}
              >
                <div className="iso-cube">
                  <div className="iso-face iso-face-front text-center p-4">{project.title}</div>
                  <div className="iso-face iso-face-back"></div>
                  <div className="iso-face iso-face-right" style={{ backgroundColor: project.color }}>View</div>
                  <div className="iso-face iso-face-left"></div>
                  <div className="iso-face iso-face-top"></div>
                  <div className="iso-face iso-face-bottom"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. KONTAKTFORMULAR & FINAL CTA: "Upload to the Grid" */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center">
          <div className="domino-flip brutal-box p-12 md:p-16 max-w-4xl w-full bg-white">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8">
              Upload to the Grid
            </h2>
            <p className="text-xl font-medium mb-12 max-w-2xl mx-auto">
              Ready to construct your digital presence? Send us your coordinates and we'll begin the blueprint.
            </p>
            
            <form className="flex flex-col gap-6 text-left relative" onSubmit={handleFormSubmit}>
              
              {/* Success Overlay */}
              <div 
                className={`absolute inset-0 bg-white z-10 flex flex-col items-center justify-center border-4 border-black transition-all duration-500 ${
                  formStatus === 'success' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
                }`}
              >
                <div className="w-16 h-16 bg-[#87CEEB] border-4 border-black shadow-[4px_4px_0px_#1A1A24] flex items-center justify-center mb-4 text-black">
                  <Zap size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase">Transmission Successful</h3>
                <p className="text-lg font-medium mt-2">Your coordinates have been logged.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border-4 border-black p-4 text-lg focus:outline-none focus:shadow-[4px_4px_0px_#FF5722] transition-shadow bg-[#E0E0E0]"
                  placeholder="John Doe"
                  disabled={formStatus !== 'idle'}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-4 border-black p-4 text-lg focus:outline-none focus:shadow-[4px_4px_0px_#FF5722] transition-shadow bg-[#E0E0E0]"
                  placeholder="john@example.com"
                  disabled={formStatus !== 'idle'}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold uppercase tracking-wider">Message</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="border-4 border-black p-4 text-lg focus:outline-none focus:shadow-[4px_4px_0px_#FF5722] transition-shadow bg-[#E0E0E0] resize-none"
                  placeholder="Tell us about your project..."
                  disabled={formStatus !== 'idle'}
                />
              </div>
              
              <button 
                type="submit"
                disabled={formStatus !== 'idle'}
                className={`brutal-btn py-6 text-2xl mt-4 w-full flex justify-center items-center gap-3 ${
                  formStatus === 'submitting' ? 'opacity-70 cursor-wait' : ''
                }`}
                onMouseEnter={handleInteractableEnter}
                onMouseLeave={handleInteractableLeave}
              >
                {formStatus === 'submitting' ? 'Transmitting...' : 'Initialize Sequence'}
              </button>
            </form>
          </div>
        </section>
        
      </main>
    </div>
  );
}
