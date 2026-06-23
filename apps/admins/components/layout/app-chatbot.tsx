'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { PlusIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { useChatbot } from '@/hooks/use-chatbot';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { open } = useChatbot();

  const createThread = useMutation(api.threads.create);

  const { status, results: threads, isLoading } = usePaginatedQuery(api.threads.list, isLoaded ? {} : 'skip', { initialNumItems: 20 });

  const [threadId, setThreadId] = useState(threads[0]?._id);

  useEffect(() => {
    if (threads.length === 0) return;
    setThreadId(threads[0]?._id);
  }, [threads]);

  if (!open) return null;

  if (status === 'LoadingFirstPage') return <GenericLoader />;

  if (!threadId) return null;

  return (
    <section className="flex w-full flex-col items-center gap-2 py-2 lg:pb-5 xl:w-120 xl:border-l print:hidden">
      <header className="flex h-14 w-full items-center gap-2 border-b px-3">
        <div className="flex w-full gap-2 overflow-x-auto">
          {threads.map((thread) => (
            <Button
              key={thread._id}
              variant={thread._id === threadId ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setThreadId(thread._id)}
            >
              {thread.title}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          aria-label="New thread"
          className="cursor-pointer"
          onClick={() => {
            createThread().then((id) => {
              setThreadId(id);
            });
          }}
        >
          <PlusIcon />
        </Button>
      </header>
      <ChatbotMessages threadId={threadId} />
      <ChatbotInput threadId={threadId} />
    </section>
  );
}
