import { create } from 'zustand';

interface LayoutStore {
  chatbot: boolean;
  toggleChatbot: () => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  chatbot: false,
  toggleChatbot: () => set((state) => ({ chatbot: !state.chatbot }))
}));
