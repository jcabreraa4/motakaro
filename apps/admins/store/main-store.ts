import { create } from 'zustand';

interface MainStore {
  subroute: string | null;
  setSubroute: (name: string | null) => void;
  showChatbot: boolean;
  toggleChatbot: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  subroute: null,
  setSubroute: (subroute: string | null) => set({ subroute }),
  showChatbot: false,
  toggleChatbot: () => set((state) => ({ showChatbot: !state.showChatbot }))
}));
