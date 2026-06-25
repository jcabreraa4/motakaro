'use client';

import { useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { ChatbotThreads } from '@/components/chatbot/chatbot-threads';
import { useChatbot } from '@/hooks/use-chatbot';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { open } = useChatbot();
  const { results: threads } = usePaginatedQuery(api.threads.list, isLoaded ? {} : 'skip', { initialNumItems: 20 });

  const createThread = useMutation(api.threads.create);

  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  const thread = threads.find((thread) => thread._id === threadId);

  return (
    <section className={cn('w-full xl:max-w-120 xl:border-l print:hidden', !open && 'hidden')}>
      {!threadId ? (
        <div className="flex h-full flex-col gap-3 p-3 md:gap-5 md:p-5">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => createThread().then((id) => setThreadId(id))}
          >
            <PlusIcon />
            Create Thread
          </Button>
          <ChatbotThreads
            threads={threads}
            setThreadId={setThreadId}
          />
        </div>
      ) : (
        <div className="flex h-full flex-col gap-3 py-3 md:gap-5 md:py-5">
          <div className="px-3 md:px-5">
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-2 truncate"
              onClick={() => setThreadId(undefined)}
            >
              <ArrowLeftIcon />
              <span className="truncate">{thread?.title || 'Untitled Thread'}</span>
            </Button>
          </div>
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
