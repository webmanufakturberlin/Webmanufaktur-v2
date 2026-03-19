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
    id: 'liquid-glass',
    name: 'Liquid Glass',
    description: 'Immersives 3D-Museum mit Glaskörpern',
    component: React.lazy(() => import('./liquid-glass/LiquidGlassApp')),
    cssClass: 'design-liquid-glass',
    fonts: ['https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap']
  }
];
