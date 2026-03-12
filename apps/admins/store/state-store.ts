import { create } from 'zustand';

interface AppStateStore {
  showChat: boolean;
  toggleChat: () => void;
}

export const useAppStateStore = create<AppStateStore>((set) => ({
  showChat: false,
  toggleChat: () => set((state) => ({ showChat: !state.showChat }))
}));
