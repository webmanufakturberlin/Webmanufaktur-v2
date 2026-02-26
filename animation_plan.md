# Implementationsplan: Neue Elite-Animationen

## 1. Hero-Sektion (Der erste Eindruck)
**Das Ziel:** Der Text "WE CODE" und "VISION" sollen majestätisch und asynchron einfliegen, während der Rest der Seite (Buttons, Hintergrund) sofort da ist.
*   **"WE CODE":** Fliegt *langsam* von der **rechten Seite** herein (X-Translation von +100% auf 0) gepaart mit einem leichten Fade-In.
*   **"VISION":** Fliegt *noch langsamer* von der **linken Seite** herein (X-Translation von -100% auf 0).
*   **Umsetzung:** Wir nutzen CSS-Keyframes (`hero-slide-right` und `hero-slide-left`) mit unterschiedlichen `animation-duration`-Werten (z.B. 1.5s und 2.5s) in der Datei `Hero.tsx`.

## 2. Scroll-Animationen (Einzigartig & Rückgängig machbar)
**Das Ziel:** Jede der 6 Sektionen bekommt einen **einzigartigen** Übergang. Außerdem werden Animationen **rückgängig gemacht**, wenn man nach oben scrollt (sie verschwinden wieder in ihrem Ursprungszustand und triggern neu, wenn man runterscrollt).
*   **Umsetzung:** Wir passen den `IntersectionObserver` in der Datei `App.tsx` (im Element `SectionReveal`) so an, dass er `isIntersecting` in *beide* Richtungen live überwacht und keine Elemente "unobserved" lässt. 

### Meine Vorschläge für die 6 einzigartigen Sektionen:

1.  **Section 1 (Impact / Zahlen): "The 3D Unfold"**
    *   *Effekt:* Faltet sich wie ein Laptop aus dem Boden nach oben hin auf (3D Rotation auf der X-Achse kombiniert mit Scale-Up).
2.  **Section 2 (Features / Work): "The Glass Materialize"**
    *   *Effekt:* Startet komplett milchig und extrem verschwommen (`blur(30px)`) und wird langsam gestochen scharf, während es leicht reinzoomt.
3.  **Section 3 (Methodology / Prozess): "The Diagonal Spring"**
    *   *Effekt:* Schießt diagonal von unten rechts nach oben links ins Bild und wippt ("Bounces") physisch am Ende leicht nach.
4.  **Section 4 (AI Lab): "The Horizon Expand"**
    *   *Effekt:* Das Element wächst von der absoluten Mitte wie ein Strahl nach Außen (erst ein waagerechter Strich, der dann in der Höhe aufpoppt - via `clip-path` oder `scaleY`).
5.  **Section 5 (Company / Proof): "The Deep Dive"**
    *   *Effekt:* Kommt von weit "hinten" aus dem Bildschirm geflogen (`scale(0.3)` auf `scale(1)`) und materialisiert sich durch die Z-Achse nach vorne.
6.  **Section 6 (CTA / Contact): "The Magnetic Drop"**
    *   *Effekt:* Fällt von *oben* ins Bild und federt nachgiebig ein, fast so als würde es magnetisch auf den Boden aufschlagen.

## 3. Umsetzungsschritte
1.  **CSS-Klassen modifizieren (`index.css`):**
    *   Entfernen der alten Animationen.
    *   Hinzufügen der neuen Keyframes und Transitions für Hero und die 6 Sektions-Animationen. Alle Transitions brauchen einen flüssigen `cubic-bezier` Kurven-Verlauf für Premium-Feeling.
2.  **`App.tsx` anpassen:**
    *   `IntersectionObserver` so umschreiben, dass er `isVisible` auf `false` setzt, sobald das Element das Sichtfeld verlässt (Rückgängig-Feature).
    *   Den 6 Sektionen ihre neuen `anim-...` Props zuweisen.
3.  **`Hero.tsx` anpassen:**
    *   Den Texten "WE CODE" und "VISION" eigene Tailwind/CSS-Klassen geben, damit sie unabhängig voneinander langsam reinfliegen.

---
**Was denkst du über diese 6 Vorschläge? Sollen wir den Plan so ausführen?**
