import React, { useState } from 'react';
import { Send, Loader2, Building2, Globe, Wrench, Briefcase, Mail, Check } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

interface CTAProps {
    onNavigate?: (id: string) => void;
}

export const CTA: React.FC<CTAProps> = ({ onNavigate }) => {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        businessName: '',
        businessType: '',
        projectType: 'new',
        websiteType: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('webmanufaktur.berlin@googlemail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const subject = encodeURIComponent(`Project Request: ${formData.projectType.toUpperCase()} - ${formData.businessName}`);
            const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nBusiness: ${formData.businessName} (${formData.businessType})\nProject Type: ${formData.projectType}\nWebsite Goal: ${formData.websiteType}\n\nMessage:\n${formData.message}`);
            window.location.href = `mailto:webmanufaktur.berlin@googlemail.com?subject=${subject}&body=${body}`;
            setLoading(false);
        }, 800);
    };

    return (
        <footer className="relative z-10 bg-white/80 backdrop-blur-xl pt-32 pb-12 border-t border-white/20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-80 pointer-events-none" aria-hidden="true" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 relative">
                <div>
                    <Reveal>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-ink leading-[0.9]">
                            {t('cta.headline1')} <br />
                            {t('cta.headline2') ? <>{t('cta.headline2')} </> : null}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">{t('cta.headline3')}</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-md leading-relaxed">
                            {t('cta.desc')}
                        </p>

                        <div className="flex flex-col gap-6 relative group/email cursor-pointer" onClick={handleCopy}>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-2xl opacity-0 group-hover/email:opacity-20 transition-opacity duration-500 blur-xl"></div>
                            <div className="p-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:shadow-2xl hover:border-blue-200 relative overflow-hidden group-hover/email:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        Available
                                    </span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                    <Mail size={16} className="text-blue-500" aria-hidden="true" /> {t('cta.directInquiries')}
                                </p>
                                <div className="text-xl sm:text-2xl font-mono font-bold text-ink transition-colors break-words flex flex-col gap-2">
                                    <span className="group-hover/email:text-transparent group-hover/email:bg-clip-text group-hover/email:bg-gradient-to-r group-hover/email:from-blue-600 group-hover/email:to-purple-600 transition-all duration-300">
                                        webmanufaktur.berlin
                                    </span>
                                    <span className="text-sm text-gray-400 group-hover/email:text-gray-600 transition-colors">@googlemail.com</span>
                                </div>
                                <div className={`absolute bottom-0 right-0 p-4 text-sm font-bold transition-all duration-300 ${copied ? 'text-green-600 opacity-100 translate-y-0' : 'text-blue-600 opacity-0 translate-y-4 group-hover/email:opacity-100 group-hover/email:translate-y-0'}`}>
                                    {copied ? 'Copied ✓' : 'Click to copy ->'}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.2} width="100%" variant="right">
                    <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden" aria-labelledby="project-form-heading">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" aria-hidden="true" />

                        <h3 id="project-form-heading" className="text-2xl font-bold mb-4 text-ink">{t('cta.projectDetails')}</h3>

                        {/* Form completion progress */}
                        {(() => {
                            const fields = [formData.name, formData.email, formData.businessName, formData.businessType, formData.websiteType, formData.message];
                            const filled = fields.filter(f => f.trim().length > 0).length;
                            const pct = Math.round((filled / fields.length) * 100);
                            return (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>{filled}/{fields.length} Felder ausgefüllt</span>
                                        <span className="font-mono">{pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })()}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label htmlFor="cta-name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t('cta.name')}</label>
                                    <input
                                        id="cta-name"
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all placeholder-gray-300 hover:border-gray-300"
                                        placeholder="Jane Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {formData.name && <Check size={14} className="absolute right-3 top-1/2 mt-3 text-green-500" />}
                                </div>
                                <div className="relative">
                                    <label htmlFor="cta-email" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t('cta.email')}</label>
                                    <input
                                        id="cta-email"
                                        required
                                        type="email"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all placeholder-gray-300 hover:border-gray-300"
                                        placeholder="jane@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {formData.email && <Check size={14} className="absolute right-3 top-1/2 mt-3 text-green-500" />}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="cta-business" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                                        <Building2 size={12} aria-hidden="true" /> {t('cta.businessName')}
                                    </label>
                                    <input
                                        id="cta-business"
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all placeholder-gray-300 hover:border-gray-300"
                                        placeholder="Acme Corp"
                                        value={formData.businessName}
                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cta-industry" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                                        <Briefcase size={12} aria-hidden="true" /> {t('cta.industry')}
                                    </label>
                                    <input
                                        id="cta-industry"
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all placeholder-gray-300 hover:border-gray-300"
                                        placeholder="z.B. Fashion, SaaS, Legal"
                                        value={formData.businessType}
                                        onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                                    />
                                </div>
                            </div>

                            <fieldset>
                                <legend className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{t('cta.scope')}</legend>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`
                                    cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02]
                                    focus-within:ring-2 focus-within:ring-blue-500
                                    ${formData.projectType === 'new' ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}
                                `}>
                                        <input
                                            type="radio"
                                            name="projectType"
                                            value="new"
                                            className="sr-only"
                                            checked={formData.projectType === 'new'}
                                            onChange={() => setFormData({ ...formData, projectType: 'new' })}
                                        />
                                        <Globe size={18} aria-hidden="true" />
                                        <span className="font-medium text-sm">{t('cta.newWebsite')}</span>
                                    </label>
                                    <label className={`
                                    cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02]
                                    focus-within:ring-2 focus-within:ring-blue-500
                                    ${formData.projectType === 'rework' ? 'border-purple-500 bg-purple-50/50 text-purple-700 shadow-md' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}
                                `}>
                                        <input
                                            type="radio"
                                            name="projectType"
                                            value="rework"
                                            className="sr-only"
                                            checked={formData.projectType === 'rework'}
                                            onChange={() => setFormData({ ...formData, projectType: 'rework' })}
                                        />
                                        <Wrench size={18} aria-hidden="true" />
                                        <span className="font-medium text-sm">{t('cta.rework')}</span>
                                    </label>
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="cta-website-goal" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t('cta.goal')}</label>
                                <input
                                    id="cta-website-goal"
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all placeholder-gray-300 hover:border-gray-300"
                                    placeholder={t('cta.goalPlaceholder')}
                                    value={formData.websiteType}
                                    onChange={e => setFormData({ ...formData, websiteType: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="cta-message" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t('cta.vision')}</label>
                                <textarea
                                    id="cta-message"
                                    required
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all resize-none placeholder-gray-300 hover:border-gray-300"
                                    placeholder={t('cta.visionPlaceholder')}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{formData.message.length}/500</div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full relative overflow-hidden bg-black text-white font-bold py-4 rounded-xl group disabled:opacity-70 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all hover:-translate-y-0.5 hover:shadow-lg ${formData.name && formData.email && formData.message ? 'animate-pulse' : ''}`}
                                style={{ animationDuration: '3s' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" aria-hidden="true" />
                                <div className="relative flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} aria-hidden="true" />
                                            {t('cta.processing')}
                                        </>
                                    ) : (
                                        <>
                                            {t('cta.send')}
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </section>
                </Reveal>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 relative">
                <p>© {new Date().getFullYear()} WebManufaktur Berlin.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('impressum'); }} className="hover:text-ink transition-colors hover:underline decoration-blue-500 underline-offset-4 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 cursor-pointer">{t('cta.imprint')}</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); }} className="hover:text-ink transition-colors hover:underline decoration-purple-500 underline-offset-4 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1">{t('cta.privacy')}</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); }} className="hover:text-ink transition-colors hover:underline decoration-orange-500 underline-offset-4 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
};