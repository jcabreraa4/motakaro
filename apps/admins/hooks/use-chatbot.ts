import { useShallow } from 'zustand/react/shallow';

import { useIsMobile } from '@workspace/ui/hooks/use-mobile';

import { useChatbotStore } from '@/store/chatbot-store';

export function useChatbot() {
  const isMobile = useIsMobile();

  const { chatbot, setChatbot } = useChatbotStore(
    useShallow((state) => ({
      chatbot: state.chatbot,
      setChatbot: state.setChatbot
    }))
  );

  function handleChatbot() {
    if (isMobile && chatbot) setChatbot(false);
  }

  return { chatbot, setChatbot, handleChatbot };
}
