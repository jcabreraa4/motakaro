import { create } from 'zustand';

interface AgentsStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  input: string;
  setInput: (input: string) => void;
}

export const useAgentsStore = create<AgentsStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  input: '',
  setInput: (input: string) => set({ input })
}));
