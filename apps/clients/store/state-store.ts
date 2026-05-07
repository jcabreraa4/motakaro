import { create } from 'zustand';

interface AppStateStore {
  subroute: string | null;
  setSubroute: (name: string | null) => void;
}

export const useAppStateStore = create<AppStateStore>((set) => ({
  subroute: null,
  setSubroute: (subroute: string | null) => set({ subroute })
}));
