# WebManufaktur Berlin — Design System Prompt

> Hänge diese Datei + die relevanten Design-Dateien an, wenn du einer KI ein neues Design generieren lassen willst.

---

## Genutzte Animations-Techniken (Übersicht)

| Technik | Library | Verwendet in |
|---|---|---|
| ScrollTrigger Entry-Animationen | GSAP | Alle 3 Designs |
| Bounce/Elastic Easing | GSAP | Industriell, Schlicht |
| Yoyo Loops (breathing/floating) | GSAP | Liquid Glass |
| Horizontal Scroll (pin + scrub) | GSAP ScrollTrigger | Liquid Glass |
| Scroll-Scrub (fortlaufend) | GSAP ScrollTrigger | Industriell |
| Mouse-Tracking via CSS Variables | Vanilla JS | Industriell |
| Zustand State → UI-Reaktion | Zustand | Liquid Glass, Schlicht |
| WebGL 3D-Szene | React Three Fiber | Liquid Glass, Schlicht |
| CSS 3D Transforms (isometrisch) | CSS | Schlicht |
| Custom Cursor | Vanilla JS + CSS | Liquid Glass |

---

## Architektur-Konventionen

### Dateistruktur pro Design
```
src/designs/<design-name>/
├── <DesignName>App.tsx    ← Hauptkomponente (default export)
├── <design-name>.css      ← Eigene CSS-Datei
├── store.ts               ← Zustand Store (optional)
└── components/            ← Sub-Komponenten (optional, z.B. 3D-Szenen)
```

### Registry (`src/designs/registry.ts`)
```typescript
export interface DesignVariant {
  id: string;                    // kebab-case, z.B. 'liquid-glass'
  name: string;                  // Display-Name
  description: string;           // Kurzbeschreibung für UI
  component: React.LazyExoticComponent<React.ComponentType>;
  cssClass: string;              // Wird auf document.body gesetzt
  fonts?: string[];              // Google Fonts URLs
}
```

Neues Design registrieren:
```typescript
{
  id: 'mein-design',
  name: 'Mein Design',
  description: 'Kurze Beschreibung der Ästhetik',
  component: React.lazy(() => import('./mein-design/MeinDesignApp')),
  cssClass: 'design-mein-design',
  fonts: ['https://fonts.googleapis.com/css2?family=...']
}
```

### Regeln
- **Default Export** für die Hauptkomponente
- **GSAP Context** in useEffect mit cleanup: `let ctx = gsap.context(() => { ... }, ref); return () => ctx.revert();`
- **ScrollTrigger** muss registriert werden: `gsap.registerPlugin(ScrollTrigger);`
- **Responsive**: Mobile + Desktop, Tailwind Breakpoints (md:, lg:)
- **Erlaubte Dependencies**: gsap, @react-three/fiber, @react-three/drei, zustand, lucide-react, three
- **KEINE** anderen UI-Libraries (kein MUI, Chakra, etc.)
- **Tailwind CSS** für Layout, Abstände, Farben
- **CSS-Datei** nur für design-spezifische Styles (Animationen, komplexe Selektoren)

---

## Design 1: Industriell

**Ästhetik:** Dunkle Kupfer/Stahl-Werkstatt, HUD-Elemente, technische Präzision
**Farbpalette:** Kupfer `#B87333`, Dunkel `#121212`, Gelb `#EAB308`, Grau `#D1D5DB`
**Fonts:** Teko (Headlines), Fira Code (Data/Monospace), Exo 2 (Body)
**Dateien:** `IndustriellApp.tsx`, `industriell.css`

### Animationen

**1. Hero-Text — Bounce Entry**
```typescript
gsap.from(".hero-text-line", {
  y: -100, opacity: 0,
  duration: 1.2, ease: "bounce.out",
  stagger: 0.15, delay: 0.2
});
```

**2. Gauge — ScrollTrigger Stroke**
```typescript
gsap.to(gaugeRef.current, {
  strokeDashoffset: 0,
  duration: 1.5, ease: "power4.out",
  scrollTrigger: { trigger: ".gauge-container", start: "top 80%" }
});
```

**3. Timeline Fill — Scrub**
```typescript
gsap.to(timelineFillRef.current, {
  height: "100%", ease: "none",
  scrollTrigger: {
    trigger: timelineRef.current,
    start: "top center", end: "bottom center",
    scrub: true
  }
});
```

**4. Timeline Steps — Fade In**
```typescript
gsap.utils.toArray<HTMLElement>('.timeline-step').forEach((step) => {
  gsap.fromTo(step,
    { opacity: 0.3, x: -20 },
    { opacity: 1, x: 0, duration: 0.5,
      scrollTrigger: { trigger: step, start: "top center", toggleActions: "play none none reverse" }
    }
  );
});
```

**5. Mouse-Tracking Light (JS + CSS)**
```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = inspectionCardRef.current.getBoundingClientRect();
  inspectionCardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  inspectionCardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};
```
```css
.inspection-card::after {
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y),
    rgba(184,115,51,0.15) 0%, transparent 50%);
}
```

### Sektionen
1. Hero (Fullscreen Bild + HUD + bounce text)
2. Capabilities (3 Cards: Blueprint, Gauge, Inspection Light)
3. Standard of Excellence (Warning-Stripe Banner)
4. Protocol (Conduit Timeline mit Fill-Animation)
5. Dispatch/Contact (Kontaktinfos + CTA)

---

## Design 2: Liquid Glass

**Ästhetik:** Minimalistisches Museum/Galerie, schwerelose Artefakte, immersiv
**Farbpalette:** Ink/Schwarz `#1a1a1a`, Weiß, Transparent — Hintergrund wechselt auf Hover
**Fonts:** Cinzel (Serif Headlines), IBM Plex Mono (Body)
**Dateien:** `LiquidGlassApp.tsx`, `liquid-glass.css`, `store.ts`, `components/Scene.tsx`, `components/LiquidCursor.tsx`

### Store (Zustand)
```typescript
interface AppState {
  hoveredService: number | null;
  ctaHovered: boolean;
  setHoveredService: (id: number | null) => void;
  setCtaHovered: (hovered: boolean) => void;
}
```

### Animationen

**1. Museum Artifacts — Breathing Yoyo**
```typescript
gsap.to(".museum-artifact", {
  y: "-=10",
  rotationZ: () => Math.random() * 2 - 1,
  duration: 4, ease: "sine.inOut",
  yoyo: true, repeat: -1,
  stagger: { amount: 2, from: "random" }
});
```

**2. Horizontal Scroll — Pin + Snap**
```typescript
const sections = gsap.utils.toArray('.horizontal-panel');
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  ScrollTrigger: {
    trigger: horizontalRef.current,
    pin: true, scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + horizontalRef.current?.offsetWidth
  }
});
```

**3. Hover → Hintergrundwechsel (Zustand)**
```tsx
<div className={`transition-colors duration-700 ${ctaHovered ? 'bg-ink text-white' : 'bg-transparent text-ink'}`}>
```

**4. Custom Cursor** — `LiquidCursor` Komponente (eigene Datei)
**5. WebGL Background** — `Scene` Komponente mit Three.js

### Sektionen
1. Hero "The Exhibition" (breathing text + pulsing line)
2. Services "The Pedestals" (hover → store → Farbwechsel)
3. Philosophy (Horizontal Scroll Panels)
4. CTA (hover inverts entire page)

---

## Design 3: Schlicht & Spielerisch

**Ästhetik:** Brutalistisch, Voxel-Gaming, dicke schwarze Borders, Grid-basiert
**Farbpalette:** Schwarz `#1A1A24`, Weiß `#FFFFFF`, Orange `#FF5722`, Hellgrau `#E0E0E0`
**Fonts:** DM Sans (Body), Outfit (Headlines)
**Dateien:** `SchlichtApp.tsx`, `schlicht.css`, `store.ts`, `components/VoxelScene.tsx`

### Store (Zustand)
```typescript
interface AppState {
  scrollProgress: number;
  hoveredService: number | null;
  isHoveringInteractable: boolean;
  setScrollProgress: (p: number) => void;
  setHoveredService: (id: number | null) => void;
  setIsHoveringInteractable: (h: boolean) => void;
}
```

### Animationen

**1. Domino Flip — Bounce Entry**
```typescript
const dominos = gsap.utils.toArray('.domino-flip') as HTMLElement[];
dominos.forEach((el) => {
  gsap.fromTo(el,
    { rotationX: 90, opacity: 0 },
    {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      rotationX: 0, opacity: 1,
      transformOrigin: 'bottom',
      duration: 0.8, ease: 'bounce.out'
    }
  );
});
```

**2. Scroll Progress Bar (Zustand → CSS)**
```tsx
<div
  className="fixed top-0 left-0 h-3 bg-[#FF5722] border-b-4 border-r-4 border-black z-50"
  style={{ width: `${scrollProgress * 100}%` }}
/>
```

```typescript
ScrollTrigger.create({
  trigger: containerRef.current,
  start: 'top top', end: 'bottom bottom',
  onUpdate: (self) => setScrollProgress(self.progress)
});
```

**3. WebGL Background — React Three Fiber**
```tsx
<div className="fixed inset-0 z-[1] pointer-events-none">
  <Canvas shadows><VoxelScene /></Canvas>
</div>
```

**4. Isometric Cubes — CSS 3D**
```css
.iso-cube {
  transform-style: preserve-3d;
  transform: rotateX(-25deg) rotateY(45deg);
}
.iso-face { position: absolute; width: 150px; height: 150px; border: 4px solid black; }
.iso-face-front  { transform: translateZ(75px); }
.iso-face-back   { transform: translateZ(-75px) rotateY(180deg); }
.iso-face-right  { transform: rotateY(90deg) translateZ(75px); }
/* ... */
```

### CSS-Klassen (brutal-box, brutal-btn)
```css
.brutal-box {
  background: white;
  border: 4px solid black;
  box-shadow: 8px 8px 0px #1A1A24;
}
.brutal-btn {
  background: #FF5722;
  color: white;
  border: 4px solid black;
  box-shadow: 6px 6px 0px #1A1A24;
  font-weight: 900;
  text-transform: uppercase;
}
.brutal-btn:hover {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0px #1A1A24;
}
```

### Sektionen
1. Hero "The Foundation" (domino-flip box + CTA)
2. Value Proposition "The Architecture" (3 Cards mit Icons)
3. Services "Core Modules" (hover → store + Farbwechsel)
4. Process "Assembly Line" (Timeline mit Nummern)
5. Portfolio "Masterpieces" (isometrische 3D-Würfel)
6. Contact "Upload to the Grid" (Formular mit Success-Overlay)

---

## Anweisung für KI: Neues Design generieren

Wenn du ein neues Design erstellst, halte dich an folgende Regeln:

1. **Erstelle diese Dateien:**
   - `src/designs/<name>/<Name>App.tsx` — Hauptkomponente mit default export
   - `src/designs/<name>/<name>.css` — Design-spezifische Styles
   - `src/designs/<name>/store.ts` — Falls Zustand-State nötig (hover, scroll, etc.)

2. **Registriere in `src/designs/registry.ts`** mit id, name, description, component, cssClass, fonts

3. **Nutze GSAP + ScrollTrigger** für alle Animationen (Entry, Scroll-basiert, Loops)
   - Immer in `useEffect` mit `gsap.context()` + cleanup
   - `gsap.registerPlugin(ScrollTrigger)` am Datei-Anfang

4. **Definiere eine klare Farbpalette** (3-4 Farben) und konsistente Font-Kombination

5. **Baue 5-6 Sektionen:** Hero, Services/Leistungen, Value Prop, Prozess/Ablauf, Portfolio, Kontakt/CTA

6. **Responsive:** Tailwind Breakpoints (md:, lg:), Mobile-First

7. **Erlaubte Imports:**
   ```
   gsap, gsap/ScrollTrigger
   @react-three/fiber, @react-three/drei, three
   zustand
   lucide-react (Icons)
   React (useEffect, useRef, useState)
   ```

8. **Content-Sprache:** Deutsch oder Englisch (konsistent innerhalb eines Designs)

9. **Performance:** Lazy Loading via React.lazy, WebGL nur wenn nötig, CSS-Transitions für einfache Hover-Effekte
