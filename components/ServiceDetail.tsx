import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ServiceData } from './Features';
import { useI18n } from '../i18n';

interface ServiceDetailProps {
    service: ServiceData;
    onBack: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen relative font-sans text-ink">
            <div className="relative z-20 container mx-auto px-6 py-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 mb-12 transition-colors group active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    {t('serviceDetail.back')}
                </button>

                <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] border border-gray-100 shadow-2xl animate-slide-up">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 [&>div>svg]:w-10 [&>div>svg]:h-10" aria-hidden="true">
                        {service.renderIcon ? service.renderIcon(false) : null}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-ink tracking-tight">{service.title}</h1>
                    <h2 className="text-lg sm:text-xl md:text-2xl text-blue-600 font-medium mb-8">{service.detailTitle}</h2>

                    <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-12 border-l-4 border-blue-200 pl-6">
                        {service.desc}
                    </p>

                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">{t('serviceDetail.capabilities')}</h3>
                        {service.detailContent.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} aria-hidden="true" />
                                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-10 border-t border-gray-200 flex justify-center">
                        <button className="h-14 px-10 bg-black text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                            {t('serviceDetail.start')} {service.title} {t('serviceDetail.project')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};