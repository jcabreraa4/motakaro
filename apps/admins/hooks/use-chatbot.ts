import { useShallow } from 'zustand/react/shallow';

import { useIsMobile } from '@workspace/ui/hooks/use-mobile';

import { useChatbotStore } from '@/store/chatbot-store';

export function useChatbot() {
  const isMobile = useIsMobile();
  const { chatbot, toggleChatbot } = useChatbotStore(
    useShallow((state) => ({
      chatbot: state.chatbot,
      toggleChatbot: state.toggleChatbot
    }))
  );

  function closeMobile() {
    if (isMobile && chatbot) toggleChatbot();
  }

  return { chatbot, toggleChatbot, closeMobile };
}
