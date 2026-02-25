import React, { createContext, useContext, useState, useCallback } from 'react';

type Lang = 'de' | 'en';

interface I18nContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
    // Navbar
    'nav.work': { en: 'Work', de: 'Projekte' },
    'nav.solutions': { en: 'Solutions', de: 'Lösungen' },
    'nav.methodology': { en: 'Methodology', de: 'Methodik' },
    'nav.aiLab': { en: 'AI Lab', de: 'KI-Labor' },
    'nav.about': { en: 'About', de: 'Über Uns' },
    'nav.login': { en: 'Login', de: 'Anmelden' },
    'nav.startProject': { en: 'Start Project', de: 'Projekt starten' },
    'nav.search': { en: 'Search...', de: 'Suchen...' },
    'nav.subtitle': { en: 'Berlin Studio', de: 'Berlin Studio' },

    // Navbar mega menu - Solutions
    'mega.solutions.title': { en: 'Our Solutions', de: 'Unsere Lösungen' },
    'mega.solutions.desc': { en: 'Tailored digital architectures for ambitious brands. From simple landings to complex SaaS.', de: 'Maßgeschneiderte digitale Architekturen für ambitionierte Marken. Von einfachen Landingpages bis hin zu komplexen SaaS-Plattformen.' },
    'mega.solutions.viewAll': { en: 'View all Solutions', de: 'Alle Lösungen ansehen' },
    'mega.corporate': { en: 'Corporate Websites', de: 'Unternehmenswebsites' },
    'mega.corporate.desc': { en: 'High-performance marketing sites.', de: 'Hochperformante Marketing-Seiten.' },
    'mega.ecommerce': { en: 'E-Commerce', de: 'E-Commerce' },
    'mega.ecommerce.desc': { en: 'Shopify & Custom storefronts.', de: 'Shopify & individuelle Online-Shops.' },
    'mega.webapps': { en: 'Web Applications', de: 'Webanwendungen' },
    'mega.webapps.desc': { en: 'React/Next.js scalable apps.', de: 'Skalierbare React/Next.js Apps.' },
    'mega.cms': { en: 'CMS Integration', de: 'CMS-Integration' },
    'mega.cms.desc': { en: 'Headless content management.', de: 'Headless Content-Management.' },
    'mega.api': { en: 'API Development', de: 'API-Entwicklung' },
    'mega.api.desc': { en: 'Robust backend connections.', de: 'Robuste Backend-Anbindungen.' },
    'mega.audit': { en: 'Audit & Strategy', de: 'Audit & Strategie' },
    'mega.audit.desc': { en: 'Performance & SEO reviews.', de: 'Performance- & SEO-Analysen.' },

    // Navbar mega menu - Methodology
    'mega.method.title': { en: 'The WebManufaktur Way', de: 'Der WebManufaktur Ansatz' },
    'mega.method.desc': { en: 'We believe in "Code as Craft". Every line of code, every pixel, and every animation is placed with intention.', de: 'Wir glauben an „Code als Handwerk". Jede Zeile, jedes Pixel und jede Animation wird mit Bedacht gesetzt.' },
    'mega.method.discover': { en: 'Discover', de: 'Entdecken' },
    'mega.method.design': { en: 'Design', de: 'Gestalten' },
    'mega.method.deploy': { en: 'Deploy', de: 'Ausliefern' },
    'mega.method.ailab.title': { en: 'Join our AI Lab', de: 'Unser KI-Labor entdecken' },
    'mega.method.ailab.desc': { en: 'See how we integrate Gemini and LLMs into modern web workflows.', de: 'Erfahren Sie, wie wir Gemini und LLMs in moderne Web-Workflows integrieren.' },
    'mega.method.ailab.btn': { en: 'Explore Lab', de: 'Labor erkunden' },

    // Hero
    'hero.badge': { en: 'Made in Berlin', de: 'Made in Berlin' },
    'hero.headline1': { en: 'WE CODE', de: 'WIR GESTALTEN' },
    'hero.headline2': { en: 'VISION.', de: 'VISION.' },
    'hero.subtext': { en: 'Engineering high-performance digital infrastructure for the world\'s most ambitious brands.', de: 'Hochleistungs-Digitalinfrastruktur für die ambitioniertesten Marken der Welt.' },
    'hero.caseStudies': { en: 'Case Studies', de: 'Referenzen' },

    // Impact Data
    'impact.badge': { en: 'Market Research', de: 'Marktforschung' },
    'impact.headline1': { en: 'Design is not just art.', de: 'Design ist mehr als Ästhetik.' },
    'impact.headline2': { en: 'It is economics.', de: 'Es ist Wirtschaft.' },
    'impact.desc': { en: 'Multiple studies confirm that web performance and aesthetics directly correlate with conversion rates and brand trust.', de: 'Zahlreiche Studien belegen: Web-Performance und Ästhetik beeinflussen Konversionsrate und Markenvertrauen unmittelbar.' },
    'impact.source': { en: 'Source: Stanford Web Credibility Research', de: 'Quelle: Stanford Web Credibility Research' },
    'impact.stat1.value': { en: '75%', de: '75%' },
    'impact.stat1.desc': { en: 'of users judge a company\'s credibility based solely on their website design.', de: 'der Nutzer beurteilen die Glaubwürdigkeit eines Unternehmens allein anhand des Website-Designs.' },
    'impact.stat2.value': { en: '0.05s', de: '0,05s' },
    'impact.stat2.desc': { en: 'is all it takes for users to form a first impression of your website.', de: 'genügen Nutzern, um sich einen ersten Eindruck Ihrer Website zu bilden.' },
    'impact.stat3.value': { en: '94%', de: '94%' },
    'impact.stat3.desc': { en: 'of first impressions are design-related, impacting user retention.', de: 'aller Ersteindrücke sind designbasiert und beeinflussen die Nutzerbindung.' },

    // Features
    'features.headline1': { en: 'Structured', de: 'Strukturierte' },
    'features.headline2': { en: 'Excellence.', de: 'Exzellenz.' },
    'features.desc': { en: 'Beyond code and pixels. We engineer digital ecosystems that drive revenue, retention, and brand authority.', de: 'Mehr als Code und Pixel. Wir entwickeln digitale Ökosysteme, die Umsatz, Kundenbindung und Markenautorität vorantreiben.' },
    'features.explore': { en: 'Explore', de: 'Entdecken' },
    'features.webdev.title': { en: 'Web Development', de: 'Webentwicklung' },
    'features.webdev.desc': { en: 'Fast, accessible, and built on modern frameworks (React, Next.js). We build digital products that scale.', de: 'Schnell, barrierefrei und auf modernen Frameworks gebaut. Wir entwickeln digitale Produkte, die skalieren.' },
    'features.content.title': { en: 'Content Strategy', de: 'Content-Strategie' },
    'features.content.desc': { en: 'We write words that sell. From landing page hooks to technical whitepapers.', de: 'Wir schreiben Texte, die verkaufen. Von Landingpage-Hooks bis zu technischen Whitepapers.' },
    'features.ai.title': { en: 'AI Integration', de: 'KI-Integration' },
    'features.ai.desc': { en: 'Automate your workflows with custom Gemini-powered agents.', de: 'Automatisieren Sie Ihre Workflows mit maßgeschneiderten Gemini-powered Agenten.' },
    'features.seo.title': { en: 'SEO & Performance', de: 'SEO & Performance' },
    'features.seo.desc': { en: 'Ranking high is not an accident. It is engineering.', de: 'Top-Rankings sind kein Zufall. Sie sind Ingenieurskunst.' },
    'features.brand.title': { en: 'Brand Identity', de: 'Markenidentität' },
    'features.brand.desc': { en: 'Logos, type, and color systems that scream \'Berlin\'.', de: 'Logos, Typografie und Farbsysteme – unverwechselbar Berlin.' },

    // Features detail
    'features.webdev.detailTitle': { en: 'Engineering Scalable Systems', de: 'Skalierbare Systeme entwickeln' },
    'features.content.detailTitle': { en: 'Voice & Narrative Design', de: 'Stimme & Narrative gestalten' },
    'features.ai.detailTitle': { en: 'Intelligent Automation', de: 'Intelligente Automatisierung' },
    'features.seo.detailTitle': { en: 'Technical SEO Mastery', de: 'Technisches SEO meistern' },
    'features.brand.detailTitle': { en: 'Visual Systems', de: 'Visuelle Systeme' },

    // Process
    'process.badge': { en: 'Our Methodology', de: 'Unsere Methodik' },
    'process.est': { en: 'EST. 2026 — BERLIN', de: 'GEGR. 2026 — BERLIN' },
    'process.headline1': { en: 'Precision', de: 'Präzise' },
    'process.headline2': { en: 'Digital', de: 'Digitale' },
    'process.headline3': { en: 'Engineering.', de: 'Ingenieurskunst.' },
    'process.step1.title': { en: 'Discovery', de: 'Analyse' },
    'process.step1.desc': { en: 'We deep dive into your business model, audience, and goals.', de: 'Wir tauchen tief in Ihr Geschäftsmodell, Ihre Zielgruppe und Ihre Ziele ein.' },
    'process.step2.title': { en: 'Strategy', de: 'Strategie' },
    'process.step2.desc': { en: 'Architecture, content planning, and tech stack selection.', de: 'Architektur, Content-Planung und Technologie-Auswahl.' },
    'process.step3.title': { en: 'Design', de: 'Design' },
    'process.step3.desc': { en: 'Visual identity creation. UI/UX prototyping. Iterative feedback.', de: 'Visuelle Identität. UI/UX-Prototyping. Iteratives Feedback.' },
    'process.step4.title': { en: 'Development', de: 'Entwicklung' },
    'process.step4.desc': { en: 'Clean, semantic code. CMS integration. Animation implementation.', de: 'Sauberer, semantischer Code. CMS-Anbindung. Animationen.' },
    'process.step5.title': { en: 'Launch', de: 'Launch' },
    'process.step5.desc': { en: 'QA testing, SEO setup, and deployment to global CDNs.', de: 'QA-Tests, SEO-Setup und Deployment auf globale CDNs.' },

    // AI Section
    'ai.headline1': { en: 'Stuck on', de: 'Keine Idee für die' },
    'ai.headline2': { en: 'Strategy?', de: 'Strategie?' },
    'ai.desc': { en: 'Use our custom Gemini-powered consultant. Describe your business challenge, and get an instant strategic hook.', de: 'Nutzen Sie unseren Gemini-gestützten Berater. Beschreiben Sie Ihre Herausforderung und erhalten Sie sofort strategische Impulse.' },
    'ai.usedBy': { en: 'Used by 500+ Berlin Founders', de: 'Genutzt von 500+ Berliner Gründern' },
    'ai.placeholder': { en: 'e.g. A sustainable fashion brand needing a slogan...', de: 'z.B. Eine nachhaltige Modemarke braucht einen Slogan...' },
    'ai.insight': { en: 'Strategic Insight', de: 'Strategischer Impuls' },
    'ai.error': { en: 'Connection Issue', de: 'Verbindungsproblem' },
    'ai.errorMsg': { en: 'Our strategy nodes are currently syncing. Please try again.', de: 'Unsere Strategie-Server synchronisieren gerade. Bitte versuchen Sie es erneut.' },
    'ai.results': { en: 'Results will appear here...', de: 'Ergebnisse erscheinen hier...' },

    // Proof
    'proof.stat1.value': { en: 'Multi-Sector', de: 'Multi-Branche' },
    'proof.stat1.label': { en: 'Diverse Industries', de: 'Vielfältige Branchen' },
    'proof.stat2.value': { en: 'International', de: 'International' },
    'proof.stat2.label': { en: 'Global Client Base', de: 'Globaler Kundenstamm' },
    'proof.stat3.value': { en: 'Dedicated', de: 'Langfristig' },
    'proof.stat3.label': { en: 'Long-term Partnerships', de: 'Langzeitpartnerschaften' },

    // CTA / Contact
    'cta.headline1': { en: "Let's build", de: 'Lass uns etwas' },
    'cta.headline2': { en: 'something', de: '\u00A0' },
    'cta.headline3': { en: 'iconic.', de: 'Ikonisches bauen.' },
    'cta.desc': { en: 'The future is built today. We are opening our production schedule for select partners.', de: 'Die Zukunft entsteht heute. Wir öffnen unseren Produktionsplan für ausgewählte Partner.' },
    'cta.directInquiries': { en: 'Direct Inquiries', de: 'Direkte Anfragen' },
    'cta.projectDetails': { en: 'Project Details', de: 'Projektdetails' },
    'cta.name': { en: 'Name', de: 'Name' },
    'cta.email': { en: 'Email', de: 'E-Mail' },
    'cta.businessName': { en: 'Business Name', de: 'Firmenname' },
    'cta.industry': { en: 'Industry / Type', de: 'Branche / Typ' },
    'cta.scope': { en: 'Project Scope', de: 'Projektumfang' },
    'cta.newWebsite': { en: 'New Website', de: 'Neue Website' },
    'cta.rework': { en: 'Rework / Redesign', de: 'Überarbeitung / Redesign' },
    'cta.goal': { en: 'Website Goal / Type', de: 'Website-Ziel / Typ' },
    'cta.goalPlaceholder': { en: 'e.g. E-Commerce, Portfolio, Landing Page', de: 'z.B. E-Commerce, Portfolio, Landingpage' },
    'cta.vision': { en: 'Additional Vision', de: 'Ihre Vision' },
    'cta.visionPlaceholder': { en: 'Describe your goals...', de: 'Beschreiben Sie Ihre Ziele...' },
    'cta.send': { en: 'Send Proposal', de: 'Anfrage senden' },
    'cta.processing': { en: 'Processing...', de: 'Wird verarbeitet...' },
    'cta.imprint': { en: 'Imprint', de: 'Impressum' },
    'cta.privacy': { en: 'Privacy', de: 'Datenschutz' },

    // About
    'about.badge': { en: 'Our Story', de: 'Unsere Geschichte' },
    'about.headline1': { en: 'We are', de: 'Wir sind' },
    'about.headline2': { en: 'WebManufaktur.', de: 'WebManufaktur.' },
    'about.intro': { en: 'A Berlin-based digital studio crafting high-performance web experiences for ambitious brands worldwide.', de: 'Ein Berliner Digital-Studio, das hochperformante Web-Erlebnisse für ambitionierte Marken weltweit gestaltet.' },
    'about.mission.title': { en: 'Our Mission', de: 'Unsere Mission' },
    'about.mission.desc': { en: 'We bridge the gap between design vision and technical execution. Every project is a chance to push boundaries.', de: 'Wir schließen die Lücke zwischen Design-Vision und technischer Umsetzung. Jedes Projekt ist eine Chance, Grenzen zu verschieben.' },
    'about.craft.title': { en: 'Code as Craft', de: 'Code als Handwerk' },
    'about.craft.desc': { en: 'We treat every line of code like a master craftsman treats their materials — with precision, care, and purpose.', de: 'Wir behandeln jede Zeile Code wie ein Meister sein Material — mit Präzision, Sorgfalt und Intention.' },
    'about.berlin.title': { en: 'Berlin DNA', de: 'Berliner DNA' },
    'about.berlin.desc': { en: 'Born in the creative heart of Europe. We draw inspiration from Berlin\'s relentless innovation and cultural diversity.', de: 'Entstanden im kreativen Herzen Europas. Wir schöpfen Inspiration aus Berlins unermüdlicher Innovation und kultureller Vielfalt.' },
    'about.values.title': { en: 'Our Values', de: 'Unsere Werte' },
    'about.value1.title': { en: 'Transparency', de: 'Transparenz' },
    'about.value1.desc': { en: 'No black boxes. Every decision is documented and shared.', de: 'Keine Blackboxes. Jede Entscheidung wird dokumentiert und geteilt.' },
    'about.value2.title': { en: 'Excellence', de: 'Exzellenz' },
    'about.value2.desc': { en: 'We ship pixel-perfect, performant, accessible products.', de: 'Wir liefern pixelgenaue, performante und barrierefreie Produkte.' },
    'about.value3.title': { en: 'Partnership', de: 'Partnerschaft' },
    'about.value3.desc': { en: 'Your success is our success. We invest in long-term relationships.', de: 'Ihr Erfolg ist unser Erfolg. Wir investieren in langfristige Beziehungen.' },
    'about.back': { en: '← Back to Home', de: '← Zurück zur Startseite' },

    // Tech stack
    'tech.react': { en: 'React', de: 'React' },
    'tech.nextjs': { en: 'Next.js', de: 'Next.js' },
    'tech.typescript': { en: 'TypeScript', de: 'TypeScript' },
    'tech.nodejs': { en: 'Node.js', de: 'Node.js' },
    'tech.gemini': { en: 'Gemini', de: 'Gemini' },

    // Scroll indicator
    'hero.scroll': { en: 'Scroll to explore', de: 'Scrollen zum Entdecken' },
};

const I18nContext = createContext<I18nContextType>({
    lang: 'de',
    setLang: () => { },
    t: (key: string) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>('de');

    const t = useCallback((key: string): string => {
        const entry = translations[key];
        if (!entry) return key;
        return entry[lang] || entry['en'] || key;
    }, [lang]);

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => useContext(I18nContext);
