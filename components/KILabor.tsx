import React from 'react';
import { ArrowLeft, Bot, Cpu, Sparkles, Zap } from 'lucide-react';
import { Reveal } from './Reveal';
import { BusinessAI } from './StylistAI';
import { useI18n } from '../i18n';

interface KILaborProps {
    onBack: () => void;
    onNavigate: (id: string) => void;
}

export const KILabor: React.FC<KILaborProps> = ({ onBack, onNavigate }) => {
    const { t } = useI18n();

    return (
        <main className="min-h-screen bg-white">
            {/* Back button */}
            <div className="fixed top-24 left-6 z-40">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-sm hover:shadow-md transition-all"
                >
                    <ArrowLeft size={16} />
                    {t('about.back')}
                </button>
            </div>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Reveal variant="scale">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-widest mb-8">
                            <Sparkles size={14} />
                            KI-Labor
                        </div>
                    </Reveal>

                    <Reveal variant="bottom" delay={0.1}>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-ink mb-8">
                            KI-gestützte{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500">
                                Lösungen.
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal variant="blur" delay={0.2}>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                            Wir integrieren modernste KI-Technologien in Ihre digitalen Produkte.
                            Von intelligenten Chatbots bis hin zu automatisierten Workflows — entdecken Sie,
                            was KI für Ihr Business leisten kann.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Capabilities */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Bot,
                            title: 'KI-Chatbots',
                            desc: 'Intelligente Assistenten, die Ihre Kunden 24/7 beraten und konvertieren.',
                            color: 'text-purple-600',
                            bg: 'bg-purple-50',
                        },
                        {
                            icon: Cpu,
                            title: 'Automatisierung',
                            desc: 'Workflows automatisieren mit maßgeschneiderten KI-Agenten und LLM-Integration.',
                            color: 'text-blue-600',
                            bg: 'bg-blue-50',
                        },
                        {
                            icon: Zap,
                            title: 'Content-KI',
                            desc: 'KI-gestützte Content-Erstellung, SEO-Optimierung und Personalisierung.',
                            color: 'text-orange-600',
                            bg: 'bg-orange-50',
                        },
                    ].map((item, i) => (
                        <Reveal key={i} variant="bottom" delay={i * 0.1} once>
                            <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-gray-300 transition-all duration-300 h-full">
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-6`}>
                                    <item.icon size={24} className={item.color} />
                                </div>
                                <h3 className="text-xl font-bold text-ink mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Embedded AI Chatbot */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <Reveal variant="scale" once>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
                                Probieren Sie es aus
                            </h2>
                            <p className="text-gray-500 text-lg">
                                Unser KI-Berater gibt Ihnen eine erste strategische Einschätzung.
                            </p>
                        </div>
                    </Reveal>
                    <BusinessAI />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <Reveal variant="bottom" once>
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-gray-500 mb-8 text-lg">
                            Bereit, KI in Ihr Unternehmen zu integrieren?
                        </p>
                        <button
                            onClick={() => onNavigate('contact')}
                            className="rainbow-btn group px-10 py-4 rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-white">Projekt starten</span>
                                <ArrowLeft size={18} className="rotate-180 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </Reveal>
            </section>
        </main>
    );
};
