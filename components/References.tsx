import React, { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

interface ReferencesProps {
    onBack: () => void;
}

export const References: React.FC<ReferencesProps> = ({ onBack }) => {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const projects = [
        {
            title: "GaLaBau Exzellenz",
            category: "Corporate Website",
            desc: "A high-performance digital presence for a leading landscaping company. Featuring immersive before/after sliders, performance optimization, and a custom CMS tailored for portfolio management.",
            image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=800&auto=format&fit=crop",
            stats: ["+150% Leads", "0.8s Load Time", "WCAG AA"]
        },
        {
            title: "FinTech Dashboard",
            category: "Web Application",
            desc: "A secure, scalable SaaS dashboard built with React and Next.js. Engineered to handle real-time data flow with zero latency and a pixel-perfect dark mode interface.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
            stats: ["99.9% Uptime", "ISO 27001", "<50ms Latency"]
        },
        {
            title: "Urban Commerce",
            category: "E-Commerce",
            desc: "A headless Shopify integration for a Berlin streetwear brand. Blazing fast edge rendering combined with a rebellious, highly interactive visual identity.",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
            stats: ["+45% Conversion", "Headless", "Global CDN"]
        }
    ];

    return (
        <div className="min-h-screen relative font-sans text-ink pb-32">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] -z-10" aria-hidden="true" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent -z-20" aria-hidden="true" />

            <div className="relative z-20 container mx-auto px-6 pt-32">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 mb-12 transition-colors group active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    {t('about.back')}
                </button>

                <Reveal>
                    <div className="max-w-4xl mb-24">
                        <span className="text-blue-600 font-mono text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true"></span>
                            {t('nav.references') || 'Referenzen'}
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Work.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl font-light leading-relaxed">
                            A selection of digital products engineered for performance, aesthetics, and conversion.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 gap-16">
                    {projects.map((project, idx) => (
                        <Reveal key={idx} delay={idx * 0.1} variant="bottom">
                            <div className="group relative bg-white/80 backdrop-blur-md border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer">

                                <div className="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <ArrowUpRight size={20} className="text-blue-600" />
                                </div>

                                <div className="flex flex-col md:flex-row">
                                    {/* Image Section */}
                                    <div className="md:w-5/12 relative overflow-hidden bg-gray-100 min-h-[300px]">
                                        <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                        />
                                    </div>

                                    {/* Content Section */}
                                    <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                                                {project.category}
                                            </span>
                                            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 w-fit">
                                                {project.title}
                                            </h2>
                                            <p className="text-gray-600 leading-relaxed  mb-8 text-lg font-light">
                                                {project.desc}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                                            {project.stats.map((stat, sIdx) => (
                                                <div key={sIdx} className="bg-blue-50/50 border border-blue-100 px-4 py-2 rounded-lg text-sm font-semibold text-blue-800">
                                                    {stat}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.4}>
                    <div className="mt-24 p-12 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] text-white text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.3)_0%,transparent_70%)]" />
                        <h3 className="relative z-10 text-3xl md:text-5xl font-bold mb-6">Ready to join them?</h3>
                        <p className="relative z-10 text-gray-400 max-w-lg mx-auto mb-8 text-lg">
                            Let's discuss how we can engineer digital excellence for your brand.
                        </p>
                        <button
                            onClick={onBack}
                            className="relative z-10 rainbow-btn-sm inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 transition-all"
                        >
                            Start a Project
                        </button>
                    </div>
                </Reveal>

            </div>
        </div>
    );
};
