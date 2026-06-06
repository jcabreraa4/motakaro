import { create } from 'zustand';

interface HeaderStore {
  subroute: string | null;
  setSubroute: (name: string | null) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  subroute: null,
  setSubroute: (subroute: string | null) => set({ subroute })
}));
