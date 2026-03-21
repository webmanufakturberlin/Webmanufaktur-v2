import { create } from 'zustand';

interface AppState {
  scrollProgress: number;
  isHoveringInteractive: boolean;
  setScrollProgress: (progress: number) => void;
  setIsHoveringInteractive: (isHovering: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scrollProgress: 0,
  isHoveringInteractive: false,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsHoveringInteractive: (isHovering) => set({ isHoveringInteractive: isHovering }),
}));
