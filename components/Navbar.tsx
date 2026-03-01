import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, X, ArrowRight, Layout, Zap, Code, Database, LineChart, Globe, Menu } from 'lucide-react';
import { useI18n } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    onNavigate: (id: string) => void;
    currentView: string;
    onHome: () => void;
    onAbout: () => void;
    onReferences: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, onHome, onAbout, onReferences }) => {
    const { lang, setLang, t } = useI18n();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [logoHovered, setLogoHovered] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { name: t('nav.work'), id: 'work', hasDropdown: false },
        { name: t('nav.solutions'), id: 'solutions', hasDropdown: true },
        { name: t('nav.methodology'), id: 'methodology', hasDropdown: true },
        { name: t('nav.aiLab'), id: 'ai-lab', hasDropdown: false },
        { name: t('nav.references') || 'Referenzen', id: 'references', hasDropdown: false, isRefPage: true },
        { name: t('nav.about'), id: 'about', hasDropdown: false, isPage: true },
    ];

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setHoveredItem(null);
            setMobileOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleNavClick = (link: typeof navLinks[0]) => {
        if ((link as any).isPage) {
            onAbout();
        } else if ((link as any).isRefPage) {
            onReferences();
        } else {
            onNavigate(link.id);
        }
        setMobileOpen(false);
        setMobileAccordion(null);
    };

    return (
        <header>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100 ${scrolled ? 'shadow-lg shadow-black/5' : ''}`}
                onMouseLeave={() => setHoveredItem(null)}
                aria-label="Main navigation"
            >
                <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 h-full flex items-center justify-between relative">

                    {/* LOGO */}
                    <button
                        className="logo-group flex items-center gap-2 md:gap-3 group cursor-pointer z-50 relative bg-transparent border-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
                        onClick={() => { onHome(); setMobileOpen(false); }}
                        onMouseEnter={() => setLogoHovered(true)}
                        onMouseLeave={() => setLogoHovered(false)}
                        aria-label="Go to homepage"
                    >
                        <img
                            src="/assets/logo.png"
                            alt="WebManufaktur Berlin Logo"
                            className="logo-img h-8 md:h-10 w-auto object-contain"
                            style={{
                                transform: logoHovered ? 'rotate(12deg) scale(1.08)' : 'rotate(0deg) scale(1)',
                                transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        />
                        <div className="flex flex-col">
                            <span className="font-black tracking-tight text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-700 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-500 transition-all duration-500">WebManufaktur</span>
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 group-hover:text-indigo-400 transition-colors duration-300">{t('nav.subtitle')}</span>
                        </div>
                    </button>

                    {/* DESKTOP NAVIGATION LINKS */}
                    <div className="hidden lg:flex items-center gap-1 h-full">
                        {navLinks.map((link) => (
                            <div
                                key={link.id}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => link.hasDropdown && setHoveredItem(link.id)}
                            >
                                <a
                                    href={`#${link.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(link);
                                    }}
                                    className={`
                                        relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-1
                                        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                        ${hoveredItem === link.id
                                            ? 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:ring-1 hover:ring-blue-100 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'}
                                    `}
                                    {...(link.hasDropdown ? {
                                        'aria-expanded': hoveredItem === link.id,
                                        'aria-haspopup': 'true' as const,
                                    } : {})}
                                >
                                    {link.name}
                                    {link.hasDropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredItem === link.id ? 'rotate-180 text-blue-600' : ''}`} aria-hidden="true" />}
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-2 md:gap-3 z-50 relative">
                        {/* Language Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-bold" role="group" aria-label="Language selection">
                            <button
                                onClick={() => setLang('de')}
                                className={`px-2.5 md:px-3 py-1.5 rounded-full transition-all duration-300 ${lang === 'de' ? 'bg-white text-ink shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="Deutsch"
                                aria-pressed={lang === 'de'}
                            >
                                DE
                            </button>
                            <button
                                onClick={() => setLang('en')}
                                className={`px-2.5 md:px-3 py-1.5 rounded-full transition-all duration-300 ${lang === 'en' ? 'bg-white text-ink shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="English"
                                aria-pressed={lang === 'en'}
                            >
                                EN
                            </button>
                        </div>

                        {/* Desktop CTA */}
                        <button
                            onClick={() => { onNavigate('contact'); setMobileOpen(false); }}
                            className="hidden sm:flex rainbow-btn-sm items-center justify-center gap-2 min-w-[140px] md:min-w-[160px] px-4 md:px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <span>{t('nav.startProject')}</span>
                            <ArrowRight size={14} className="opacity-80" aria-hidden="true" />
                        </button>

                        {/* HAMBURGER BUTTON (mobile only) */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    {/* MEGA MENU DROPDOWN - SOLUTIONS (desktop) */}
                    <div
                        className={`
                            absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top z-40 hidden lg:block
                            ${hoveredItem === 'solutions' ? 'opacity-100 translate-y-0 pointer-events-auto h-auto py-12' : 'opacity-0 -translate-y-4 pointer-events-none h-0 py-0'}
                        `}
                        onMouseEnter={() => setHoveredItem('solutions')}
                        onMouseLeave={() => setHoveredItem(null)}
                        role="menu"
                        aria-label="Solutions submenu"
                    >
                        <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8 px-6">
                            <div className="col-span-1">
                                <h3 className="font-bold text-lg mb-4 text-ink">{t('mega.solutions.title')}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{t('mega.solutions.desc')}</p>
                                <a href="#features" onClick={() => { setHoveredItem(null); onNavigate('features'); }} className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                                    {t('mega.solutions.viewAll')} <ArrowRight size={14} aria-hidden="true" />
                                </a>
                            </div>
                            <div className="col-span-3 grid grid-cols-3 gap-6">
                                {[
                                    { icon: Layout, titleKey: 'mega.corporate', descKey: 'mega.corporate.desc' },
                                    { icon: Zap, titleKey: 'mega.ecommerce', descKey: 'mega.ecommerce.desc' },
                                    { icon: Globe, titleKey: 'mega.webapps', descKey: 'mega.webapps.desc' },
                                    { icon: Database, titleKey: 'mega.cms', descKey: 'mega.cms.desc' },
                                    { icon: Code, titleKey: 'mega.api', descKey: 'mega.api.desc' },
                                    { icon: LineChart, titleKey: 'mega.audit', descKey: 'mega.audit.desc' },
                                ].map((item, i) => (
                                    <a key={i} href="#features" onClick={() => { setHoveredItem(null); onNavigate('features'); }} className="group p-4 rounded-xl hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500" role="menuitem">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <item.icon size={20} aria-hidden="true" />
                                        </div>
                                        <h4 className="font-bold text-sm mb-1 text-ink">{t(item.titleKey)}</h4>
                                        <p className="text-xs text-gray-500">{t(item.descKey)}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MEGA MENU DROPDOWN - METHODOLOGY (desktop) */}
                    <div
                        className={`
                            absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top z-40 hidden lg:block
                            ${hoveredItem === 'methodology' ? 'opacity-100 translate-y-0 pointer-events-auto h-auto py-12' : 'opacity-0 -translate-y-4 pointer-events-none h-0 py-0'}
                        `}
                        onMouseEnter={() => setHoveredItem('methodology')}
                        onMouseLeave={() => setHoveredItem(null)}
                        role="menu"
                        aria-label="Methodology submenu"
                    >
                        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-12 px-6">
                            <div>
                                <h3 className="font-bold text-2xl mb-4">{t('mega.method.title')}</h3>
                                <p className="text-gray-600 mb-6 max-w-md">{t('mega.method.desc')}</p>
                                <div className="flex gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">01</div>
                                        <div className="text-sm font-bold uppercase tracking-wider text-gray-500">{t('mega.method.discover')}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">02</div>
                                        <div className="text-sm font-bold uppercase tracking-wider text-gray-500">{t('mega.method.design')}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-3xl font-bold text-orange-600 mb-1">03</div>
                                        <div className="text-sm font-bold uppercase tracking-wider text-gray-500">{t('mega.method.deploy')}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-xl mb-2">{t('mega.method.ailab.title')}</h4>
                                    <p className="text-gray-500 text-sm mb-6">{t('mega.method.ailab.desc')}</p>
                                    <a href="#business" onClick={() => { setHoveredItem(null); onNavigate('business'); }} className="inline-block px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500">
                                        {t('mega.method.ailab.btn')}
                                    </a>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-700" aria-hidden="true">
                                    <Zap size={150} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-white shadow-2xl z-[60] lg:hidden overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <span className="font-bold text-lg text-ink">Menu</span>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <div className="p-4 space-y-1">
                                {navLinks.map((link) => (
                                    <div key={link.id}>
                                        <button
                                            onClick={() => {
                                                if (link.hasDropdown) {
                                                    setMobileAccordion(mobileAccordion === link.id ? null : link.id);
                                                } else {
                                                    handleNavClick(link);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3.5 text-left text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                        >
                                            {link.name}
                                            {link.hasDropdown && (
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-300 ${mobileAccordion === link.id ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
                                                />
                                            )}
                                        </button>

                                        {/* Accordion: Solutions */}
                                        <AnimatePresence>
                                            {link.id === 'solutions' && mobileAccordion === 'solutions' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 pr-2 pb-2 space-y-1">
                                                        {[
                                                            { icon: Layout, titleKey: 'mega.corporate' },
                                                            { icon: Zap, titleKey: 'mega.ecommerce' },
                                                            { icon: Globe, titleKey: 'mega.webapps' },
                                                            { icon: Database, titleKey: 'mega.cms' },
                                                            { icon: Code, titleKey: 'mega.api' },
                                                            { icon: LineChart, titleKey: 'mega.audit' },
                                                        ].map((item, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => { onNavigate('features'); setMobileOpen(false); }}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            >
                                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <item.icon size={16} />
                                                                </div>
                                                                {t(item.titleKey)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Accordion: Methodology */}
                                        <AnimatePresence>
                                            {link.id === 'methodology' && mobileAccordion === 'methodology' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 pr-2 pb-2 space-y-1">
                                                        {[
                                                            { num: '01', color: 'text-blue-600', label: t('mega.method.discover') },
                                                            { num: '02', color: 'text-purple-600', label: t('mega.method.design') },
                                                            { num: '03', color: 'text-orange-600', label: t('mega.method.deploy') },
                                                        ].map((step, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => { onNavigate('work'); setMobileOpen(false); }}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            >
                                                                <span className={`text-lg font-bold ${step.color}`}>{step.num}</span>
                                                                <span className="font-medium uppercase tracking-wider text-xs">{step.label}</span>
                                                            </button>
                                                        ))}
                                                        <button
                                                            onClick={() => { onNavigate('business'); setMobileOpen(false); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors mt-1"
                                                        >
                                                            <Zap size={16} className="text-blue-400" />
                                                            <span className="font-medium">{t('mega.method.ailab.title')}</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile CTA */}
                            <div className="p-4 mt-4 border-t border-gray-100">
                                <button
                                    onClick={() => { onNavigate('contact'); setMobileOpen(false); }}
                                    className="rainbow-btn-sm w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-bold shadow-lg active:scale-95 transition-all"
                                >
                                    <span>{t('nav.startProject')}</span>
                                    <ArrowRight size={16} className="opacity-80" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
