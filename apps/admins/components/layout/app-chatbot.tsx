'use client';

import { useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { usePaginatedQuery } from 'convex/react';
import { ArrowLeftIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { SidebarInset } from '@workspace/ui/components/sidebar';
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
    <SidebarInset className={cn('w-full min-w-100 md:max-w-100 print:hidden', !open && 'hidden')}>
      <ChatbotHeader />
      {!threadId ? (
        <ChatbotThreads
          threads={threads}
          setThreadId={setThreadId}
        />
      ) : (
        <div className="flex h-full flex-col gap-3 py-3 md:gap-5 md:py-5">
          <div className="px-3 md:px-5">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 truncate"
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
    </SidebarInset>
  );
}
