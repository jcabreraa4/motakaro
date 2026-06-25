import { useShallow } from 'zustand/react/shallow';

import { useChatbotStore } from '@/store/chatbot-store';

export function useChatbot() {
  const { open, setOpen } = useChatbotStore(
    useShallow((state) => ({
      open: state.open,
      setOpen: state.setOpen
    }))
  );

  return { open, setOpen };
}
