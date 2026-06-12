import { useShallow } from 'zustand/react/shallow';

import { useIsMobile } from '@workspace/ui/hooks/use-mobile';

import { useLayoutStore } from '@/store/layout-store';

export function useLayout() {
  const isMobile = useIsMobile();

  const { chatbot, toggleChatbot } = useLayoutStore(
    useShallow((state) => ({
      chatbot: state.chatbot,
      toggleChatbot: state.toggleChatbot
    }))
  );

  function closeMobileChatbot() {
    if (isMobile && chatbot) toggleChatbot();
  }

  return { chatbot, toggleChatbot, closeMobileChatbot };
}
