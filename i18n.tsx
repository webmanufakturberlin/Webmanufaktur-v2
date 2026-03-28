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
    'nav.references': { en: 'References', de: 'Referenzen' },
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
    'hero.subtitle': { en: 'Your Webmanufaktur for digital excellence', de: 'Ihre Webmanufaktur für digitale Exzellenz' },
    'hero.subtext': { en: "All that's missing is yours.", de: 'Alles, was uns dazu noch fehlt, ist deine.' },
    'hero.caseStudies': { en: 'Case Studies', de: 'Referenzen' },

    // Creativity Trigger
    'creativity.message': {
        en: 'Hey, you seem truly creative! Feel free to share your thoughts and vision with us.',
        de: 'Hey, du scheinst echt kreativ zu sein – teile gerne deine Gedanken oder deine Vision mit uns!'
    },
    'creativity.action': {
        en: 'Share Vision',
        de: 'Vision teilen'
    },

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
    'features.webdev.detail1': { en: 'We utilize a modern stack (Next.js, TypeScript, Tailwind) to ensure pixel-perfect implementation and lightning-fast load times.', de: 'Wir nutzen einen modernen Stack (Next.js, TypeScript, Tailwind) für pixelgenaue Umsetzung und blitzschnelle Ladezeiten.' },
    'features.webdev.detail2': { en: 'Our development process includes rigorous accessibility testing (WCAG 2.1) and performance optimization (Core Web Vitals).', de: 'Unser Entwicklungsprozess umfasst strenge Barrierefreiheitstests (WCAG 2.1) und Performance-Optimierung (Core Web Vitals).' },
    'features.webdev.detail3': { en: 'From complex SaaS dashboards to immersive marketing sites, we build architectures that grow with your business.', de: 'Von komplexen SaaS-Dashboards bis hin zu immersiven Marketing-Seiten – wir bauen Architekturen, die mit Ihrem Unternehmen wachsen.' },
    'features.content.detailTitle': { en: 'Voice & Narrative Design', de: 'Stimme & Narrative gestalten' },
    'features.content.detail1': { en: 'Content is the interface. We craft compelling narratives that guide users through the conversion funnel.', de: 'Content ist das Interface. Wir entwickeln überzeugende Narrationen, die Nutzer durch den Conversion-Funnel führen.' },
    'features.content.detail2': { en: 'Our services include UX writing, SEO-driven blog strategy, and technical documentation.', de: 'Unsere Leistungen umfassen UX Writing, SEO-getriebene Blog-Strategie und technische Dokumentation.' },
    'features.content.detail3': { en: 'We define your brand voice guidelines to ensure consistency across all touchpoints.', de: 'Wir definieren Ihre Brand-Voice-Guidelines für Konsistenz über alle Touchpoints hinweg.' },
    'features.ai.detailTitle': { en: 'Intelligent Automation', de: 'Intelligente Automatisierung' },
    'features.ai.detail1': { en: 'We integrate LLMs like Gemini and GPT-4 directly into your business logic.', de: 'Wir integrieren LLMs wie Gemini und GPT-4 direkt in Ihre Geschäftslogik.' },
    'features.ai.detail2': { en: 'Custom chatbots for customer support, automated content generation, and data analysis agents.', de: 'Maßgeschneiderte Chatbots für Kundensupport, automatisierte Content-Generierung und Datenanalyse-Agenten.' },
    'features.ai.detail3': { en: 'Secure, enterprise-grade implementation with a focus on data privacy and reliability.', de: 'Sichere, Enterprise-Grade-Implementierung mit Fokus auf Datenschutz und Zuverlässigkeit.' },
    'features.seo.detailTitle': { en: 'Technical SEO Mastery', de: 'Technisches SEO meistern' },
    'features.seo.detail1': { en: 'We optimize the technical foundation of your site to ensure search engines can crawl and index it efficiently.', de: 'Wir optimieren das technische Fundament Ihrer Seite, damit Suchmaschinen sie effizient crawlen und indexieren können.' },
    'features.seo.detail2': { en: 'Keyword strategy based on intent modeling and competitor gap analysis.', de: 'Keyword-Strategie basierend auf Intent-Modellierung und Wettbewerbs-Gap-Analyse.' },
    'features.seo.detail3': { en: 'Continuous monitoring and optimization of Core Web Vitals to maintain top rankings.', de: 'Kontinuierliches Monitoring und Optimierung der Core Web Vitals für Top-Rankings.' },
    'features.brand.detailTitle': { en: 'Visual Systems', de: 'Visuelle Systeme' },
    'features.brand.detail1': { en: 'We create comprehensive design systems that ensure visual consistency.', de: 'Wir erstellen umfassende Design-Systeme, die visuelle Konsistenz gewährleisten.' },
    'features.brand.detail2': { en: 'Logo design, typography selection, and color palette creation tailored to your market positioning.', de: 'Logo-Design, Typografie-Auswahl und Farbpaletten-Erstellung, zugeschnitten auf Ihre Marktpositionierung.' },
    'features.brand.detail3': { en: 'Brand guidelines that empower your team to create on-brand assets independently.', de: 'Brand-Guidelines, die Ihr Team befähigen, eigenständig markenkonforme Assets zu erstellen.' },

    // Process
    'process.badge': { en: 'Our Methodology', de: 'Unsere Methodik' },
    'process.est': { en: 'EST. 2026 — BERLIN', de: 'GEGR. 2026 — BERLIN' },
    'process.headline1': { en: 'Precision', de: 'Präzise' },
    'process.headline2': { en: 'Digital', de: 'Digitale' },
    'process.headline3': { en: 'Engineering.', de: 'Ingenieurskunst.' },
    'showcase.badge': { en: 'Technology & Craft', de: 'Technologie & Handwerk' },
    'showcase.headline1': { en: 'Built With', de: 'Gebaut Mit' },
    'showcase.headline2': { en: 'Precision.', de: 'Präzision.' },
    'showcase.desc': { en: 'The tools we master — click to explore each one.', de: 'Die Werkzeuge, die wir beherrschen — klicke, um sie zu erkunden.' },

    // Process Timeline (replaces Spline 3D section)
    'process.timeline.headline1': { en: 'How We', de: 'So Bauen Wir' },
    'process.timeline.headline2': { en: 'Build.', de: 'Websites.' },
    'process.timeline.desc': { en: 'From the first conversation to the live launch — our process is designed for precision and transparency.', de: 'Vom ersten Gespräch bis zum Go-Live — unser Prozess ist auf Präzision und Transparenz ausgelegt.' },
    'process.timeline.step1.title': { en: 'Discovery', de: 'Discovery' },
    'process.timeline.step1.heading': { en: 'Strategy & Discovery', de: 'Strategie & Discovery' },
    'process.timeline.step1.desc': { en: 'We analyze your market, competitors, and target audience. Together we define goals, KPIs, and the content strategy for your project.', de: 'Wir analysieren Ihren Markt, Ihre Mitbewerber und Ihre Zielgruppe. Gemeinsam definieren wir Ziele, KPIs und die Content-Strategie für Ihr Projekt.' },
    'process.timeline.step2.title': { en: 'Design', de: 'Design' },
    'process.timeline.step2.heading': { en: 'Design & Prototyping', de: 'Design & Prototyping' },
    'process.timeline.step2.desc': { en: 'We craft the visual identity — from wireframes to interactive high-fidelity prototypes. Every element is tested with real users.', de: 'Wir gestalten die visuelle Identität — von Wireframes bis zu interaktiven High-Fidelity-Prototypen. Jedes Element wird mit echten Nutzern getestet.' },
    'process.timeline.step3.title': { en: 'Build', de: 'Build' },
    'process.timeline.step3.heading': { en: 'Development', de: 'Entwicklung' },
    'process.timeline.step3.desc': { en: 'Clean, performant code built on React and Next.js. We ensure Core Web Vitals are optimized and the site is SEO-ready from day one.', de: 'Sauberer, performanter Code auf Basis von React und Next.js. Wir optimieren Core Web Vitals und sorgen dafür, dass die Seite von Tag eins SEO-ready ist.' },
    'process.timeline.step4.title': { en: 'Launch', de: 'Launch' },
    'process.timeline.step4.heading': { en: 'Launch & Growth', de: 'Launch & Growth' },
    'process.timeline.step4.desc': { en: 'Deployment on global CDNs, analytics setup, and continuous optimization. We stay on as your growth partner long after go-live.', de: 'Deployment auf globalen CDNs, Analytics-Setup und kontinuierliche Optimierung. Wir bleiben als Ihr Wachstumspartner auch nach dem Go-Live.' },

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
    'ai.error': { en: 'Error', de: 'Fehler' },
    'ai.retry': { en: 'Try again', de: 'Erneut versuchen' },
    'ai.contactDirect': { en: 'Contact us directly', de: 'Direkt kontaktieren' },
    'ai.results': { en: 'Results will appear here...', de: 'Ergebnisse erscheinen hier...' },
    'ai.error.rateLimited': { en: 'Too many requests. Please wait a moment and try again.', de: 'Du hast zu viele Anfragen gesendet. Bitte warte einen Moment.' },
    'ai.error.promptTooLong': { en: 'Your message is too long. Please shorten it to max 500 characters.', de: 'Deine Nachricht ist zu lang. Bitte kürze sie auf max. 500 Zeichen.' },
    'ai.error.aiUnavailable': { en: 'Our AI consultant is currently unreachable. Please try again later.', de: 'Unser KI-Berater ist gerade nicht erreichbar. Bitte versuche es später.' },
    'ai.error.aiError': { en: 'An error occurred while processing your request. Please try again.', de: 'Bei der Verarbeitung ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
    'ai.error.timeout': { en: 'The request took too long. Please try again.', de: 'Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.' },
    'ai.error.networkError': { en: 'No internet connection. Please check your connection.', de: 'Keine Internetverbindung. Bitte prüfe deine Verbindung.' },
    'ai.error.unknown': { en: 'An unknown error occurred. Please contact us directly.', de: 'Ein unbekannter Fehler ist aufgetreten. Bitte kontaktiere uns direkt.' },
    'ai.error.quotaExceeded': { en: 'Daily quota exceeded. Please try again later.', de: 'Tages-Kontingent erschöpft. Bitte später erneut versuchen.' },
    'ai.error.forbidden': { en: 'API access denied. Please check the API key.', de: 'API-Zugriff verweigert. Bitte API-Key prüfen.' },
    'ai.error.modelNotFound': { en: 'AI model not found. Please check configuration.', de: 'KI-Modell nicht gefunden. Bitte Konfiguration prüfen.' },
    'ai.error.badRequest': { en: 'Invalid request. Please try a different question.', de: 'Ungültige Anfrage. Bitte versuche es mit einer anderen Frage.' },
    'ai.error.serverError': { en: 'AI server reported an error. Please try again later.', de: 'KI-Server hat einen Fehler gemeldet. Bitte später erneut versuchen.' },


    // CTA / Contact
    'cta.headline1': { en: "Let's build", de: 'Lass uns etwas' },
    'cta.headline2': { en: 'something', de: '' },
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
    'about.intro': { en: 'WebManufaktur — a Berlin-based digital studio crafting high-performance web experiences for ambitious brands worldwide.', de: 'WebManufaktur — ein Berliner Digital-Studio, das hochperformante Web-Erlebnisse für ambitionierte Marken weltweit gestaltet.' },
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

    // Service Detail
    'serviceDetail.back': { en: 'Back to Overview', de: 'Zurück zur Übersicht' },
    'serviceDetail.capabilities': { en: 'Key Capabilities', de: 'Kernkompetenzen' },
    'serviceDetail.start': { en: 'Start a', de: 'Starte ein' },
    'serviceDetail.project': { en: 'Project', de: 'Projekt' },

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
        return entry[lang] ?? entry['en'] ?? key;
    }, [lang]);

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => useContext(I18nContext);
