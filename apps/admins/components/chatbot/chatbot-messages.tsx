import { useEffect, useRef } from 'react';

import { useUser } from '@clerk/nextjs';
import { type UIMessage, useUIMessages } from '@convex-dev/agent/react';
import { CopyIcon, MessageSquareIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@workspace/ui/chatbot/conversation';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from '@workspace/ui/chatbot/message';
import { Button } from '@workspace/ui/components/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';
import { cn } from '@workspace/ui/lib/utils';

import { copyString } from '@/utils/copy-string';

export function ChatbotMessages({ threadId }: { threadId: string }) {
  const { user } = useUser();
  const { results: messages, status, loadMore } = useUIMessages(api.messages.list, { threadId }, { initialNumItems: 30, stream: true });

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages.length]);

  return (
    <div
      ref={messagesRef}
      className={cn('flex min-h-0 w-full flex-1 justify-center', messages.length !== 0 && 'overflow-y-scroll')}
    >
      <div className="w-full">
        <Conversation className={cn(messages.length === 0 && 'h-full')}>
          <ConversationContent className={cn(messages.length === 0 ? 'h-full px-0' : 'px-3 lg:px-5')}>
            {status === 'LoadingFirstPage' ? (
              <GenericLoader />
            ) : messages.length === 0 ? (
              <ConversationEmptyState className="h-full select-none">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageSquareIcon className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle className="text-xl">No Messages Yet</EmptyTitle>
                    <EmptyDescription className="text-md">How can I help you today, {user?.firstName}?</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </ConversationEmptyState>
            ) : (
              <>
                {status === 'CanLoadMore' && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => loadMore(20)}
                    >
                      Load More
                    </Button>
                  </div>
                )}
                <MessagesLoaded messages={messages} />
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
}

function MessagesLoaded({ messages }: { messages: UIMessage[] }) {
  return (
    <>
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;

        if (!message.text)
          return (
            <p
              key={message.key}
              className="animate-pulse"
            >
              Loading...
            </p>
          );

        return (
          <div
            key={message.key}
            className="flex flex-col gap-3"
          >
            <Message from={message.role}>
              <MessageContent className="text-md lg:text-lg">
                <MessageResponse>{message.text}</MessageResponse>
              </MessageContent>
            </Message>
            {message.role === 'assistant' && isLastMessage && (
              <MessageActions className="-ml-2">
                <MessageAction
                  label="Copy"
                  className="cursor-pointer"
                  onClick={() => copyString({ text: message.text, type: 'message' })}
                >
                  <CopyIcon />
                </MessageAction>
              </MessageActions>
            )}
          </div>
        );
      })}
    </>
  );
}
