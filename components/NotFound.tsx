import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { useI18n } from '../i18n';

interface NotFoundProps {
    onHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onHome }) => {
    const { t } = useI18n();

    return (
        <main id="main-content" className="min-h-screen flex items-center justify-center bg-white px-4 pt-24 pb-16">
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-sm font-mono uppercase tracking-widest text-blue-600 mb-4">
                    404
                </p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-ink mb-6 leading-[0.9]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
                        {t('notFound.title')}
                    </span>
                </h1>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md mx-auto">
                    {t('notFound.desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onHome}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <Home size={18} aria-hidden="true" />
                        {t('notFound.backHome')}
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-ink font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <ArrowLeft size={18} aria-hidden="true" />
                        {t('notFound.goBack')}
                    </button>
                </div>
            </div>
        </main>
    );
};
