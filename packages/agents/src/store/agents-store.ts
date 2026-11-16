import { create } from 'zustand';

interface AgentsStore {
  agents: boolean;
  setAgents: (agents: boolean) => void;
}

export const useAgentsStore = create<AgentsStore>((set) => ({
  agents: false,
  setAgents: (agents: boolean) => set({ agents })
}));
