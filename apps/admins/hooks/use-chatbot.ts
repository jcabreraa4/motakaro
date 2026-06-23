import { useAuth } from '@clerk/nextjs';
import { useUIMessages } from '@convex-dev/agent/react';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { useShallow } from 'zustand/react/shallow';

import { api } from '@workspace/backend/_generated/api';

import { useChatbotStore } from '@/store/chatbot-store';

export function useChatbot() {
  const { isLoaded } = useAuth();

  const { open, setOpen, activeThreadId, setActiveThreadId } = useChatbotStore(
    useShallow((state) => ({
      open: state.open,
      setOpen: state.setOpen,
      activeThreadId: state.activeThreadId,
      setActiveThreadId: state.setActiveThreadId
    }))
  );

  const threads = usePaginatedQuery(api.threads.list, isLoaded ? {} : 'skip', { initialNumItems: 20 });

  const createThread = useMutation(api.threads.create);
  const removeThread = useMutation(api.threads.remove);
  const sendMessage = useMutation(api.messages.create);

  const messages = useUIMessages(api.messages.list, activeThreadId ? { threadId: activeThreadId } : 'skip', { initialNumItems: 30, stream: true });

  const handleCreateThread = async () => {
    const threadId = await createThread();
    setActiveThreadId(threadId);
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
  };

  const handleRemoveThread = async (threadId: string) => {
    await removeThread({ threadId });
    if (activeThreadId === threadId) setActiveThreadId(null);
  };

  const handleSendMessage = async (message: string) => {
    if (!activeThreadId || !message.trim()) return;
    await sendMessage({ threadId: activeThreadId, message });
  };

  return {
    open,
    setOpen,
    activeThreadId,
    threads,
    handleCreateThread,
    handleSelectThread,
    handleRemoveThread,
    messages,
    handleSendMessage
  };
}
