import { create } from 'zustand';

interface MainStore {
  subroute: string | null;
  setSubroute: (name: string | null) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  subroute: null,
  setSubroute: (subroute: string | null) => set({ subroute })
}));
