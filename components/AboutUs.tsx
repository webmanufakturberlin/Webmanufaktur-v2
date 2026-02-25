import React from 'react';
import { ArrowLeft, Heart, Target, Lightbulb, MapPin, Shield, Award, Handshake } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

interface AboutUsProps {
    onBack: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-white text-ink">
            {/* Fixed back button */}
            <button
                onClick={onBack}
                className="fixed top-24 left-6 z-40 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-lg text-sm font-bold text-gray-600 hover:text-ink hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 active:scale-95"
            >
                <ArrowLeft size={16} />
                {t('about.back')}
            </button>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-white to-white pointer-events-none" aria-hidden="true" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <Reveal variant="blur">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-10">
                            <MapPin size={14} className="text-indigo-500" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{t('about.badge')}</span>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1} variant="bottom">
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                            {t('about.headline1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                                {t('about.headline2')}
                            </span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2} variant="blur">
                        <p className="text-xl sm:text-2xl text-gray-500 max-w-3xl leading-relaxed font-light">
                            {t('about.intro')}
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Mission Cards */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Target, titleKey: 'about.mission.title', descKey: 'about.mission.desc', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: Heart, titleKey: 'about.craft.title', descKey: 'about.craft.desc', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { icon: Lightbulb, titleKey: 'about.berlin.title', descKey: 'about.berlin.desc', color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map((card, i) => (
                        <Reveal key={i} delay={i * 0.15} variant={i % 2 === 0 ? 'bottom' : 'scale'}>
                            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full">
                                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                    <card.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-ink">{t(card.titleKey)}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg">{t(card.descKey)}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-gray-50/50">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <h2 className="text-3xl sm:text-5xl font-bold mb-16 tracking-tight text-center">
                            {t('about.values.title')}
                        </h2>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, titleKey: 'about.value1.title', descKey: 'about.value1.desc', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: Award, titleKey: 'about.value2.title', descKey: 'about.value2.desc', gradient: 'from-purple-500 to-pink-500' },
                            { icon: Handshake, titleKey: 'about.value3.title', descKey: 'about.value3.desc', gradient: 'from-orange-500 to-amber-500' },
                        ].map((val, i) => (
                            <Reveal key={i} delay={i * 0.1} variant="bottom">
                                <div className="group text-center p-8">
                                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${val.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        <val.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{t(val.titleKey)}</h3>
                                    <p className="text-gray-500 leading-relaxed">{t(val.descKey)}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="py-8 px-6 border-t border-gray-100">
                <div className="max-w-5xl mx-auto text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} WebManufaktur Berlin.
                </div>
            </div>
        </div>
    );
};
