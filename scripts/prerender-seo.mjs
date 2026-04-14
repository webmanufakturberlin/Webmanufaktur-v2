/**
 * Post-build SEO pre-rendering script.
 * Generates per-route index.html files with correct meta tags.
 *
 * Source of truth for SEO data: ../seoData.ts
 * Keep this in sync when routes change.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

const BASE_URL = 'https://www.webmanufakturberlin.de';

// Mirrored from seoData.ts -- keep in sync
const routes = [
  {
    path: '/',
    lang: 'de',
    title: 'WebManufaktur Berlin \u2014 Webdesign, Content & KI-Agentur',
    description: 'WebManufaktur Berlin \u2014 Premium Webdesign, Content-Strategie und KI-Integration. Wir entwickeln hochperformante digitale Infrastruktur f\u00fcr ambitionierte Marken.',
    altPath: '/en/',
  },
  {
    path: '/en/',
    lang: 'en',
    title: 'WebManufaktur Berlin \u2014 Web Design, Content & AI Agency',
    description: 'WebManufaktur Berlin \u2014 Premium web design, content strategy, and AI integration. Engineering high-performance digital infrastructure for ambitious brands.',
    altPath: '/',
  },
  {
    path: '/about',
    lang: 'de',
    title: '\u00dcber uns \u2014 WebManufaktur Berlin',
    description: 'Lernen Sie das Team hinter WebManufaktur Berlin kennen. Wir verbinden Handwerkskunst mit moderner Technologie f\u00fcr erstklassige digitale Erlebnisse.',
    altPath: '/en/about',
  },
  {
    path: '/en/about',
    lang: 'en',
    title: 'About Us \u2014 WebManufaktur Berlin',
    description: 'Meet the team behind WebManufaktur Berlin. We combine craftsmanship with modern technology to create world-class digital experiences.',
    altPath: '/about',
  },
  {
    path: '/references',
    lang: 'de',
    title: 'Referenzen \u2014 WebManufaktur Berlin',
    description: 'Unsere Projekte und Referenzen. Sehen Sie, wie wir ambitionierte Marken mit ma\u00dfgeschneidertem Webdesign und KI-Integration unterst\u00fctzen.',
    altPath: '/en/references',
  },
  {
    path: '/en/references',
    lang: 'en',
    title: 'References \u2014 WebManufaktur Berlin',
    description: 'Our projects and case studies. See how we support ambitious brands with custom web design and AI integration.',
    altPath: '/references',
  },
  {
    path: '/impressum',
    lang: 'de',
    title: 'Impressum \u2014 WebManufaktur Berlin',
    description: 'Impressum und rechtliche Informationen der WebManufaktur Berlin.',
    altPath: '/en/impressum',
  },
  {
    path: '/en/impressum',
    lang: 'en',
    title: 'Imprint \u2014 WebManufaktur Berlin',
    description: 'Legal notice and imprint of WebManufaktur Berlin.',
    altPath: '/impressum',
  },
  {
    path: '/ki-labor',
    lang: 'de',
    title: 'KI-Labor \u2014 WebManufaktur Berlin',
    description: 'Unser KI-Labor: Entdecken Sie, wie wir Gemini, LLMs und k\u00fcnstliche Intelligenz in moderne Web-Workflows integrieren.',
    altPath: '/en/ki-labor',
  },
  {
    path: '/en/ki-labor',
    lang: 'en',
    title: 'AI Lab \u2014 WebManufaktur Berlin',
    description: 'Our AI Lab: Discover how we integrate Gemini, LLMs, and artificial intelligence into modern web workflows.',
    altPath: '/ki-labor',
  },
];

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  let html = template;
  const canonicalUrl = `${BASE_URL}${route.path}`;
  const altLang = route.lang === 'de' ? 'en' : 'de';
  const altUrl = `${BASE_URL}${route.altPath}`;
  const locale = route.lang === 'de' ? 'de_DE' : 'en_US';

  // Set <html lang="...">
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`);

  // Set <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

  // Set meta description
  html = html.replace(
    /<meta name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Set OG tags
  html = html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${route.title}"`);
  html = html.replace(
    /<meta property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${canonicalUrl}"`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*"/, `$1${locale}"`);

  // Set Twitter tags
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${route.title}"`);
  html = html.replace(
    /<meta name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // Insert canonical + hreflang before </head>
  const seoLinks = `  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="${route.lang}" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="${altLang}" href="${altUrl}" />
  <link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />
`;
  html = html.replace('</head>', `${seoLinks}</head>`);

  // Determine output path
  let outPath;
  if (route.path === '/') {
    outPath = join(distDir, 'index.html');
  } else if (route.path.endsWith('/')) {
    outPath = join(distDir, route.path, 'index.html');
  } else {
    outPath = join(distDir, route.path, 'index.html');
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf-8');
  console.log(`  Pre-rendered: ${route.path} -> ${outPath.replace(distDir, 'dist')}`);
}

console.log(`\nSEO pre-rendering complete: ${routes.length} routes generated.`);
