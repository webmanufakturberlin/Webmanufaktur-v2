import React from 'react';

export interface DesignVariant {
  id: string;
  name: string;
  description: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  cssClass: string;
  fonts?: string[];
}

export const DESIGN_VARIANTS: DesignVariant[] = [
  {
    id: 'industriell',
    name: 'Industriell',
    description: 'Dunkle Kupfer-Ästhetik für handwerkliche Präzision',
    component: React.lazy(() => import('./industriell/IndustriellApp')),
    cssClass: 'design-industriell',
    fonts: ['https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&family=Fira+Code:wght@300..700&family=Teko:wght@300..700&display=swap']
  },
  {
    id: 'spatial-museum',
    name: 'Spatial Museum',
    description: 'Minimalistisches 3D-Museum mit räumlicher U-Shape Navigation',
    component: React.lazy(() => import('./spatial-museum/SpatialMuseumApp')),
    cssClass: 'design-spatial-museum',
    fonts: ['https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=IBM+Plex+Mono:wght@300;400&family=Inter:wght@300;400;500&display=swap']
  },
  {
    id: 'schlicht-spielerisch',
    name: 'Schlicht & Spielerisch',
    description: 'Brutalistisches Voxel-Grid mit Domino-Effekten',
    component: React.lazy(() => import('./schlicht-spielerisch/SchlichtApp')),
    cssClass: 'design-schlicht',
    fonts: ['https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Outfit:wght@400;700;900&display=swap']
  },
  {
    id: 'brutalist-glass',
    name: 'Brutalist Glass',
    description: 'Brutalistischer Beton trifft auf Neon-Acid und Glas-Monolithen',
    component: React.lazy(() => import('./brutalist-glass/BrutalistGlassApp')),
    cssClass: 'design-brutalist-glass',
    fonts: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Oswald:wght@700&display=swap']
  }
];
