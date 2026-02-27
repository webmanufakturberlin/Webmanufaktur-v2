import React from 'react';
import { GlowCard } from './GlowCard';
import { Code2, PenTool, Cpu, Globe, Search } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';
import { motion } from 'framer-motion';

export interface ServiceData {
    title: string;
    desc: string;
    colSpan: string;
    gradient: string;
    detailTitle: string;
    detailContent: string[];
    renderIcon: (isHovered: boolean) => React.ReactNode;
}

interface FeaturesProps {
    onNavigate: (service: ServiceData) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
    const { t } = useI18n();
    const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

    const services: ServiceData[] = [
        {
            title: t('features.webdev.title'),
            desc: t('features.webdev.desc'),
            colSpan: "md:col-span-2",
            gradient: "rgba(37, 99, 235, 0.15)",
            detailTitle: t('features.webdev.detailTitle'),
            detailContent: [
                "We utilize a modern stack (Next.js, TypeScript, Tailwind) to ensure pixel-perfect implementation and lightning-fast load times.",
                "Our development process includes rigorous accessibility testing (WCAG 2.1) and performance optimization (Core Web Vitals).",
                "From complex SaaS dashboards to immersive marketing sites, we build architectures that grow with your business."
            ],
            renderIcon: (isHovered) => (
                <motion.div
                    initial={{ rotate: 0, y: 0, scale: 1 }}
                    animate={isHovered ? {
                        y: [0, -4, 0, 4, 0],
                        rotate: [0, -5, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    } : { rotate: 0, y: 0, scale: 1 }}
                    transition={isHovered ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                >
                    <Code2 className="text-blue-600" size={32} aria-hidden="true" />
                </motion.div>
            )
        },
        {
            title: t('features.content.title'),
            desc: t('features.content.desc'),
            colSpan: "md:col-span-1",
            gradient: "rgba(124, 58, 237, 0.15)",
            detailTitle: t('features.content.detailTitle'),
            detailContent: [
                "Content is the interface. We craft compelling narratives that guide users through the conversion funnel.",
                "Our services include UX writing, SEO-driven blog strategy, and technical documentation.",
                "We define your brand voice guidelines to ensure consistency across all touchpoints."
            ],
            renderIcon: (isHovered) => (
                <motion.div
                    initial={{ rotate: 0, x: 0, y: 0 }}
                    animate={isHovered ? {
                        x: [0, 8, -4, 6, 0],
                        y: [0, -6, 4, -4, 0],
                        rotate: [0, 15, -10, 10, 0]
                    } : { rotate: 0, x: 0, y: 0 }}
                    transition={isHovered ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                >
                    <PenTool className="text-purple-600" size={32} aria-hidden="true" />
                </motion.div>
            )
        },
        {
            title: t('features.ai.title'),
            desc: t('features.ai.desc'),
            colSpan: "md:col-span-1",
            gradient: "rgba(249, 115, 22, 0.15)",
            detailTitle: t('features.ai.detailTitle'),
            detailContent: [
                "We integrate LLMs like Gemini and GPT-4 directly into your business logic.",
                "Custom chatbots for customer support, automated content generation, and data analysis agents.",
                "Secure, enterprise-grade implementation with a focus on data privacy and reliability."
            ],
            renderIcon: (isHovered) => (
                <motion.div
                    initial={{ scale: 1, rotate: 0 }}
                    animate={isHovered ? {
                        scale: [1, 1.2, 0.9, 1.15, 1],
                        rotate: [0, -10, 10, -5, 0]
                    } : { scale: 1, rotate: 0 }}
                    transition={isHovered ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                >
                    <Cpu className="text-orange-500" size={32} aria-hidden="true" />
                </motion.div>
            )
        },
        {
            title: t('features.seo.title'),
            desc: t('features.seo.desc'),
            colSpan: "md:col-span-1",
            gradient: "rgba(22, 163, 74, 0.15)",
            detailTitle: t('features.seo.detailTitle'),
            detailContent: [
                "We optimize the technical foundation of your site to ensure search engines can crawl and index it efficiently.",
                "Keyword strategy based on intent modeling and competitor gap analysis.",
                "Continuous monitoring and optimization of Core Web Vitals to maintain top rankings."
            ],
            renderIcon: (isHovered) => (
                <motion.div
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={isHovered ? {
                        x: [0, 10, -5, 8, -8, 0],
                        y: [0, -10, 10, 5, -5, 0],
                        rotate: [0, 45, -20, 30, -10, 0]
                    } : { x: 0, y: 0, rotate: 0 }}
                    transition={isHovered ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                >
                    <Search className="text-green-600" size={32} aria-hidden="true" />
                </motion.div>
            )
        },
        {
            title: t('features.brand.title'),
            desc: t('features.brand.desc'),
            colSpan: "md:col-span-1",
            gradient: "rgba(219, 39, 119, 0.15)",
            detailTitle: t('features.brand.detailTitle'),
            detailContent: [
                "We create comprehensive design systems that ensure visual consistency.",
                "Logo design, typography selection, and color palette creation tailored to your market positioning.",
                "Brand guidelines that empower your team to create on-brand assets independently."
            ],
            renderIcon: (isHovered) => (
                <motion.div
                    initial={{ rotate: 0, scale: 1 }}
                    animate={isHovered ? {
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    } : { rotate: 0, scale: 1 }}
                    transition={isHovered ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.5, ease: "easeOut" }}
                >
                    <Globe className="text-pink-600" size={32} aria-hidden="true" />
                </motion.div>
            )
        },
    ];

    const handleCardKeyDown = (e: React.KeyboardEvent, service: ServiceData) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNavigate(service);
        }
    };

    return (
        <section className="relative z-10 py-32 overflow-visible">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none -z-10 opacity-40" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 via-transparent to-orange-100 opacity-60 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-end mb-24 relative z-10">
                <Reveal variant="clip-left">
                    <div>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight text-ink drop-shadow-sm">
                            {t('features.headline1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 filter drop-shadow-sm">{t('features.headline2')}</span>
                        </h2>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" aria-hidden="true" />
                    </div>
                </Reveal>
                <Reveal delay={0.2} variant="blur">
                    <p className="text-lg sm:text-xl text-gray-500 max-w-md mt-6 md:mt-0 text-right font-light leading-relaxed backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/40">
                        {t('features.desc')}
                    </p>
                </Reveal>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {services.map((service, idx) => (
                    <Reveal
                        key={idx}
                        width="100%"
                        delay={idx * 0.15}
                        className={service.colSpan}
                        variant={idx % 2 === 0 ? 'bottom' : 'scale'}
                    >
                        <div
                            onClick={() => onNavigate(service)}
                            onKeyDown={(e) => handleCardKeyDown(e, service)}
                            className="h-full"
                            role="button"
                            tabIndex={0}
                            aria-label={`View details for ${service.title}`}
                        >
                            <GlowCard
                                className="p-10 h-full flex flex-col justify-between group cursor-pointer bg-white/40 backdrop-blur-2xl border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-white/60 hover:border-white/80 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
                                gradientColor={service.gradient}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                <div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-white shadow-sm group-hover:shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-500 overflow-visible">
                                        {service.renderIcon(hoveredIdx === idx)}
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-ink group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 tracking-tight">{service.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-medium group-hover:text-gray-700 transition-colors">{service.desc}</p>
                                </div>
                                <div className="mt-12 pt-6 border-t border-gray-100/30 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-indigo-600 transition-colors duration-300">{t('features.explore')}</span>
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-400 shadow-md group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500" aria-hidden="true">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </GlowCard>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
};