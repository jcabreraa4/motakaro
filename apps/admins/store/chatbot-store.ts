import { type UIMessage } from '@convex-dev/agent';
import { create } from 'zustand';

interface ChatbotStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  messages: [],
  setMessages: (messages: UIMessage[]) => set({ messages })
}));
