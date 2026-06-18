import { create } from 'zustand';

interface ChatbotStore {
  chatbot: boolean;
  setChatbot: (chatbot: boolean) => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  chatbot: false,
  setChatbot: (chatbot: boolean) => set({ chatbot })
}));
