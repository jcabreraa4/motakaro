'use client';

import { useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { usePaginatedQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { cn } from '@workspace/ui/lib/utils';

import { ChatbotHeader } from '@/components/chatbot/chatbot-header';
import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { ChatbotThreads } from '@/components/chatbot/chatbot-threads';
import { useChatbot } from '@/hooks/use-chatbot';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { open } = useChatbot();
  const { results: threads } = usePaginatedQuery(api.threads.list, isLoaded ? {} : 'skip', { initialNumItems: 20 });

  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  const thread = threads.find((thread) => thread._id === threadId);

  return (
    <section className={cn('w-full xl:max-w-120 xl:border-l print:hidden', !open && 'hidden')}>
      {!threadId ? (
        <ChatbotThreads
          threads={threads}
          setThreadId={setThreadId}
        />
      ) : (
        <div className="flex h-full flex-col gap-3 py-3 md:py-5">
          <ChatbotHeader
            title={thread!.title}
            exitThread={() => setThreadId(undefined)}
            className="px-3 md:px-5"
          />
          <ChatbotMessages
            threadId={threadId}
            className="px-3 md:px-5"
          />
          <ChatbotInput
            threadId={threadId}
            className="px-3 md:px-5"
          />
        </div>
      )}
    </section>
  );
}
