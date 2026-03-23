import React from 'react';
import { Search, Palette, Code, Rocket } from 'lucide-react';
import { useI18n } from '../i18n';
import { Reveal } from './Reveal';
import { Timeline } from './ui/Timeline';

export const ProcessSection: React.FC = () => {
    const { t } = useI18n();

    const timelineData = [
        {
            title: t('process.timeline.step1.title'),
            content: (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Search className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{t('process.timeline.step1.heading')}</h4>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {t('process.timeline.step1.desc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['Marktanalyse', 'Zielgruppen-Research', 'Content-Audit', 'Wettbewerbsanalyse'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: t('process.timeline.step2.title'),
            content: (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{t('process.timeline.step2.heading')}</h4>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {t('process.timeline.step2.desc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['UI/UX Design', 'Wireframes', 'Prototyping', 'User Testing'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: t('process.timeline.step3.title'),
            content: (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Code className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{t('process.timeline.step3.heading')}</h4>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {t('process.timeline.step3.desc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Performance'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: t('process.timeline.step4.title'),
            content: (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{t('process.timeline.step4.heading')}</h4>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {t('process.timeline.step4.desc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['Deployment', 'Analytics', 'SEO-Setup', 'Continuous Optimization'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section id="process" className="relative z-10 py-24 md:py-32 overflow-hidden">
            {/* Section header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 relative z-10">
                <Reveal width="100%" once>
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-black/10 pb-8 mb-8">
                        <span className="text-blue-600 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
                            {t('process.badge')}
                        </span>
                        <span className="text-gray-500 text-sm font-mono hidden md:block">{t('process.est')}</span>
                    </div>
                </Reveal>

                <Reveal variant="left" once>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-ink mb-6">
                        {t('process.timeline.headline1')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
                            {t('process.timeline.headline2')}
                        </span>
                    </h2>
                </Reveal>

                <Reveal delay={0.1} variant="blur" once>
                    <p className="text-lg text-gray-500 max-w-lg font-light leading-relaxed">
                        {t('process.timeline.desc')}
                    </p>
                </Reveal>
            </div>

            {/* Timeline */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <Timeline data={timelineData} />
            </div>
        </section>
    );
};
