import { create } from 'zustand';

interface ChatbotStore {
  chatbot: boolean;
  toggleChatbot: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  chatbot: false,
  toggleChatbot: () => set((state) => ({ chatbot: !state.chatbot }))
}));
