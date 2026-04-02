import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TOTAL_BEARS = 5;

const CLUES: Record<number, string> = {
  0: 'Das Industriedesign verbirgt den nächsten Bären. Wechsle das Design über den Button rechts unten!',
  1: 'Ein Museum wartet auf dich. Entdecke das Spatial Museum Design!',
  2: 'Im brutalen Raster schlummert der nächste Bär. Suche Schlicht & Spielerisch!',
  3: 'Sieh durch das Glas – der letzte Bär versteckt sich im Brutalist Glass Design!',
  4: 'Du hast alle 5 Berliner Bären gefunden! Dein Rabattcode wartet auf dich.',
};

export interface PendingClue {
  bearId: number;
  clue: string;
  isLast: boolean;
}

interface HuntState {
  foundBears: number[];
  pendingClue: PendingClue | null;
  isCompleted: boolean;
  showSecretPage: boolean;

  findBear: (id: number) => void;
  dismissClue: () => void;
  openSecretPage: () => void;
  closeSecretPage: () => void;
  resetHunt: () => void;
}

export const useHuntStore = create<HuntState>()(
  persist(
    (set, get) => ({
      foundBears: [],
      pendingClue: null,
      isCompleted: false,
      showSecretPage: false,

      findBear: (id: number) => {
        const { foundBears } = get();
        if (foundBears.includes(id)) return;
        const newFound = [...foundBears, id];
        const isCompleted = newFound.length === TOTAL_BEARS;
        set({
          foundBears: newFound,
          isCompleted,
          pendingClue: {
            bearId: id,
            clue: CLUES[id],
            isLast: isCompleted,
          },
        });
      },

      dismissClue: () => set({ pendingClue: null }),
      openSecretPage: () => set({ showSecretPage: true }),
      closeSecretPage: () => set({ showSecretPage: false }),
      resetHunt: () =>
        set({ foundBears: [], isCompleted: false, pendingClue: null, showSecretPage: false }),
    }),
    {
      name: 'wmb-bear-hunt',
      partialize: (state) => ({
        foundBears: state.foundBears,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
