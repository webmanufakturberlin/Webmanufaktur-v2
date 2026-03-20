import { create } from 'zustand';

interface AppState {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  hoveredService: number | null;
  setHoveredService: (id: number | null) => void;
  isHoveringInteractable: boolean;
  setIsHoveringInteractable: (isHovering: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  hoveredService: null,
  setHoveredService: (id) => set({ hoveredService: id }),
  isHoveringInteractable: false,
  setIsHoveringInteractable: (isHovering) => set({ isHoveringInteractable: isHovering }),
}));
