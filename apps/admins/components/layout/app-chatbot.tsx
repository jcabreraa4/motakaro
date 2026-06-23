'use client';

import { useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { useChatbot } from '@/hooks/use-chatbot';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { open } = useChatbot();

  const createThread = useMutation(api.threads.create);
  const removeThread = useMutation(api.threads.remove);

  const { results: threads, status, loadMore } = usePaginatedQuery(api.threads.list, isLoaded ? {} : 'skip', { initialNumItems: 20 });

  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const thread = threads.find((thread) => thread._id === threadId);

  if (!open) return null;

  return (
    <section className="w-full xl:max-w-120 xl:border-l print:hidden">
      {!threadId ? (
        <div className="flex h-full flex-col gap-3 p-3 lg:gap-5 lg:p-5">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => createThread({}).then((id) => setThreadId(id))}
          >
            <PlusIcon />
            Create Thread
          </Button>
          <div className="flex flex-col gap-2">
            {threads.map((thread) => (
              <Button
                key={thread._id}
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => setThreadId(thread._id)}
              >
                {thread.title}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-3 py-3 lg:py-5">
          <div className="flex w-full gap-3 px-3 lg:px-5">
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setThreadId(undefined)}
            >
              <ArrowLeftIcon />
              Threads
            </Button>
            <Button
              variant="outline"
              className="pointer-events-none flex-1 justify-start truncate"
            >
              <span className="truncate">{thread?.title}</span>
            </Button>
          </div>
          <ChatbotMessages threadId={threadId} />
          <ChatbotInput threadId={threadId} />
        </div>
      )}
    </section>
  );
}
