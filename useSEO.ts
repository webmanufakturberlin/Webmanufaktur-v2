import { useEffect } from 'react';
import { seoData, BASE_URL } from './seoData';
import type { View } from './seoData';

type Lang = 'de' | 'en';

function setMetaTag(attr: string, attrValue: string, content: string): void {
  const el = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (el) {
    el.setAttribute('content', content);
  }
}

function setOrCreateLink(rel: string, href: string, extraAttrs?: Record<string, string>): HTMLLinkElement {
  const selector = extraAttrs
    ? `link[rel="${rel}"]${Object.entries(extraAttrs).map(([k, v]) => `[${k}="${v}"]`).join('')}`
    : `link[rel="${rel}"]`;
  let el = document.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extraAttrs) {
      Object.entries(extraAttrs).forEach(([k, v]) => el!.setAttribute(k, v));
    }
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return el;
}

export function useSEO(view: View, lang: Lang): void {
  useEffect(() => {
    const entry = seoData[view]?.[lang];
    if (!entry) return;

    const canonicalUrl = `${BASE_URL}${entry.path}`;
    const altLang: Lang = lang === 'de' ? 'en' : 'de';
    const altEntry = seoData[view]?.[altLang];
    const altUrl = altEntry ? `${BASE_URL}${altEntry.path}` : '';

    // Title
    document.title = entry.title;

    // HTML lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Meta description
    setMetaTag('name', 'description', entry.description);

    // Canonical
    setOrCreateLink('canonical', canonicalUrl);

    // Open Graph
    setMetaTag('property', 'og:title', entry.title);
    setMetaTag('property', 'og:description', entry.description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:locale', lang === 'de' ? 'de_DE' : 'en_US');

    // Twitter Card
    setMetaTag('name', 'twitter:title', entry.title);
    setMetaTag('name', 'twitter:description', entry.description);

    // Hreflang links
    setOrCreateLink('alternate', canonicalUrl, { hreflang: lang });
    if (altUrl) {
      setOrCreateLink('alternate', altUrl, { hreflang: altLang });
    }
    setOrCreateLink('alternate', `${BASE_URL}/`, { hreflang: 'x-default' });
  }, [view, lang]);
}
