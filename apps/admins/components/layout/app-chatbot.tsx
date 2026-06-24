'use client';

import { useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { ArrowLeftIcon, GhostIcon, PlusIcon, TrashIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { useChatbot } from '@/hooks/use-chatbot';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { open } = useChatbot();

  const createThread = useMutation(api.threads.create);
  const removeThread = useMutation(api.threads.remove);

  const { results: threads } = usePaginatedQuery(api.threads.list, isLoaded ? {} : 'skip', { initialNumItems: 20 });

  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const thread = threads.find((thread) => thread._id === threadId);

  return (
    <section className={cn('w-full xl:max-w-120 xl:border-l print:hidden', !open && 'hidden')}>
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
              <div
                key={thread._id}
                className="flex"
              >
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer rounded-r-none"
                  onClick={() => setThreadId(thread._id)}
                >
                  {thread.title}
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-l-none border-l-0"
                  onClick={() => removeThread({ threadId: thread._id })}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-2 py-3 lg:gap-3 lg:py-5">
          <div className="px-3 lg:px-5">
            <Button
              variant="outline"
              className="w-full cursor-pointer justify-start gap-2 truncate"
              onClick={() => setThreadId(undefined)}
            >
              <GhostIcon className="hidden lg:block" />
              <span className="truncate">{thread?.title || 'Untitled Thread'}</span>
            </Button>
          </div>
          <ChatbotMessages threadId={threadId} />
          <ChatbotInput threadId={threadId} />
        </div>
      )}
    </section>
  );
}
