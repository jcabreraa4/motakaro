import { create } from 'zustand';

interface LayoutStore {
  agents: boolean;
  setAgents: (agents: boolean) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  agents: false,
  setAgents: (agents: boolean) => set({ agents })
}));
