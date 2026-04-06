type Lang = 'de' | 'en';
type View = 'home' | 'service-detail' | 'about' | 'impressum' | 'ki-labor' | 'references';

interface SeoEntry {
  title: string;
  description: string;
  path: string;
}

const BASE_URL = 'https://www.webmanufakturberlin.de';

const seoData: Record<View, Record<Lang, SeoEntry>> = {
  home: {
    de: {
      title: 'WebManufaktur Berlin — Webdesign, Content & KI-Agentur',
      description: 'WebManufaktur Berlin — Premium Webdesign, Content-Strategie und KI-Integration. Wir entwickeln hochperformante digitale Infrastruktur für ambitionierte Marken.',
      path: '/',
    },
    en: {
      title: 'WebManufaktur Berlin — Web Design, Content & AI Agency',
      description: 'WebManufaktur Berlin — Premium web design, content strategy, and AI integration. Engineering high-performance digital infrastructure for ambitious brands.',
      path: '/en/',
    },
  },
  about: {
    de: {
      title: 'Über uns — WebManufaktur Berlin',
      description: 'Lernen Sie das Team hinter WebManufaktur Berlin kennen. Wir verbinden Handwerkskunst mit moderner Technologie für erstklassige digitale Erlebnisse.',
      path: '/about',
    },
    en: {
      title: 'About Us — WebManufaktur Berlin',
      description: 'Meet the team behind WebManufaktur Berlin. We combine craftsmanship with modern technology to create world-class digital experiences.',
      path: '/en/about',
    },
  },
  references: {
    de: {
      title: 'Referenzen — WebManufaktur Berlin',
      description: 'Unsere Projekte und Referenzen. Sehen Sie, wie wir ambitionierte Marken mit maßgeschneidertem Webdesign und KI-Integration unterstützen.',
      path: '/references',
    },
    en: {
      title: 'References — WebManufaktur Berlin',
      description: 'Our projects and case studies. See how we support ambitious brands with custom web design and AI integration.',
      path: '/en/references',
    },
  },
  impressum: {
    de: {
      title: 'Impressum — WebManufaktur Berlin',
      description: 'Impressum und rechtliche Informationen der WebManufaktur Berlin.',
      path: '/impressum',
    },
    en: {
      title: 'Imprint — WebManufaktur Berlin',
      description: 'Legal notice and imprint of WebManufaktur Berlin.',
      path: '/en/impressum',
    },
  },
  'ki-labor': {
    de: {
      title: 'KI-Labor — WebManufaktur Berlin',
      description: 'Unser KI-Labor: Entdecken Sie, wie wir Gemini, LLMs und künstliche Intelligenz in moderne Web-Workflows integrieren.',
      path: '/ki-labor',
    },
    en: {
      title: 'AI Lab — WebManufaktur Berlin',
      description: 'Our AI Lab: Discover how we integrate Gemini, LLMs, and artificial intelligence into modern web workflows.',
      path: '/en/ki-labor',
    },
  },
  'service-detail': {
    de: {
      title: 'WebManufaktur Berlin — Webdesign, Content & KI-Agentur',
      description: 'WebManufaktur Berlin — Premium Webdesign, Content-Strategie und KI-Integration. Wir entwickeln hochperformante digitale Infrastruktur für ambitionierte Marken.',
      path: '/',
    },
    en: {
      title: 'WebManufaktur Berlin — Web Design, Content & AI Agency',
      description: 'WebManufaktur Berlin — Premium web design, content strategy, and AI integration. Engineering high-performance digital infrastructure for ambitious brands.',
      path: '/en/',
    },
  },
};

export { seoData, BASE_URL };
export type { View, SeoEntry };
