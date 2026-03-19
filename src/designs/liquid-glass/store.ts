import { create } from 'zustand';

interface AppState {
  hoveredService: number | null;
  setHoveredService: (id: number | null) => void;
  ctaHovered: boolean;
  setCtaHovered: (hovered: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hoveredService: null,
  setHoveredService: (id) => set({ hoveredService: id }),
  ctaHovered: false,
  setCtaHovered: (hovered) => set({ ctaHovered: hovered }),
}));
