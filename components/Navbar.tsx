import React, { useState, useCallback, useEffect } from 'react';
import { Search, ChevronDown, X, ArrowRight, Layout, Zap, Code, Database, LineChart, Globe } from 'lucide-react';
import { useI18n } from '../i18n';

interface NavbarProps {
    onNavigate: (id: string) => void;
    currentView: 'home' | 'service' | 'about';
    onHome: () => void;
    onAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, onHome, onAbout }) => {
    const { lang, setLang, t } = useI18n();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const navLinks = [
        { name: t('nav.work'), id: 'work', hasDropdown: false },
        { name: t('nav.solutions'), id: 'solutions', hasDropdown: true },
        { name: t('nav.methodology'), id: 'methodology', hasDropdown: true },
        { name: t('nav.aiLab'), id: 'ai-lab', hasDropdown: false },
        { name: t('nav.about'), id: 'about', hasDropdown: false, isPage: true },
    ];

    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setHoveredItem(null);
            setIsSearchOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <header>
            <nav
                className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100"
                onMouseLeave={() => setHoveredItem(null)}
                aria-label="Main navigation"
            >
                <div className="max-w-[1400px] w-full mx-auto px-6 h-full flex items-center justify-between relative">

                    {/* LOGO — WM Monogram */}
                    <button
                        className="flex items-center gap-3 group cursor-pointer z-50 relative bg-transparent border-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
                        onClick={onHome}
                        aria-label="Go to homepage"
                    >
                        <img src="/assets/logo.png" alt="WebManufaktur Berlin Logo" className="h-10 w-auto object-contain" />
                        <div className="flex flex-col">
                            <span className="font-black tracking-tight text-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-700 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-500 transition-all duration-500">WebManufaktur</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 group-hover:text-indigo-400 transition-colors duration-300">{t('nav.subtitle')}</span>
                        </div>
                    </button>

                    {/* NAVIGATION LINKS */}
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
                                        if ((link as any).isPage) {
                                            onAbout();
                                        } else {
                                            onNavigate(link.id);
                                        }
                                    }}
                                    className={`
                                        relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-1
                                        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                        ${hoveredItem === link.id
                                            ? 'text-blue-600 bg-blue-50 ring-1 ring-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
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
                    <div className="flex items-center gap-3 z-50 relative">
                        {/* Language Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-bold" role="group" aria-label="Language selection">
                            <button
                                onClick={() => setLang('de')}
                                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === 'de' ? 'bg-white text-ink shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="Deutsch"
                                aria-pressed={lang === 'de'}
                            >
                                DE
                            </button>
                            <button
                                onClick={() => setLang('en')}
                                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === 'en' ? 'bg-white text-ink shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="English"
                                aria-pressed={lang === 'en'}
                            >
                                EN
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-52' : 'w-10'}`}>
                            {isSearchOpen ? (
                                <div className="relative w-full animate-fade-in">
                                    <label htmlFor="nav-search" className="sr-only">Search</label>
                                    <input
                                        id="nav-search"
                                        type="text"
                                        placeholder={t('nav.search')}
                                        className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus-visible:ring-2 focus-visible:ring-blue-500"
                                        autoFocus
                                        aria-label="Search the site"
                                    />
                                    <button
                                        onClick={toggleSearch}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500"
                                        aria-label="Close search"
                                    >
                                        <X size={14} aria-hidden="true" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={toggleSearch}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                                    aria-label="Open search"
                                >
                                    <Search size={18} aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <a href="#login" onClick={(e) => e.preventDefault()} className="hidden sm:block text-sm font-medium text-gray-500 hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1">
                            {t('nav.login')}
                        </a>
                        <button
                            onClick={() => onNavigate('contact')}
                            className="rainbow-btn-sm flex items-center justify-center gap-2 min-w-[160px] px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <span>{t('nav.startProject')}</span>
                            <ArrowRight size={14} className="opacity-80" aria-hidden="true" />
                        </button>
                    </div>

                    {/* MEGA MENU DROPDOWN - SOLUTIONS */}
                    <div
                        className={`
                            absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top z-40
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

                    {/* MEGA MENU DROPDOWN - METHODOLOGY */}
                    <div
                        className={`
                            absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top z-40
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
                                        <div className="text-sm font-bold uppercase tracking-wider text-gray-400">{t('mega.method.discover')}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">02</div>
                                        <div className="text-sm font-bold uppercase tracking-wider text-gray-400">{t('mega.method.design')}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-3xl font-bold text-orange-600 mb-1">03</div>
                                        <div className="text-sm font-bold uppercase tracking-wider text-gray-400">{t('mega.method.deploy')}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-xl mb-2">{t('mega.method.ailab.title')}</h4>
                                    <p className="text-gray-400 text-sm mb-6">{t('mega.method.ailab.desc')}</p>
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
        </header>
    );
};