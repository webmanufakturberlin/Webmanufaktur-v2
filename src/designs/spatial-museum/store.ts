import { create } from 'zustand';

interface AppState {
  cursorState: 'default' | 'hover' | 'hidden';
  scrollProgress: number;
  setCursorState: (state: 'default' | 'hover' | 'hidden') => void;
  setScrollProgress: (progress: number) => void;
}

export const useStore = create<AppState>((set) => ({
  cursorState: 'default',
  scrollProgress: 0,
  setCursorState: (state) => set({ cursorState: state }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));
