import { create } from 'zustand';

interface AppStateStore {
  showChat: boolean;
  toggleChat: () => void;
  showKnowledge: boolean;
  toggleKnowledge: () => void;
  subroute: string | null;
  setSubroute: (name: string | null) => void;
}

export const useAppStateStore = create<AppStateStore>((set) => ({
  showChat: false,
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  showKnowledge: false,
  toggleKnowledge: () => set((state) => ({ showKnowledge: !state.showKnowledge })),
  subroute: null,
  setSubroute: (subroute: string | null) => set({ subroute })
}));
