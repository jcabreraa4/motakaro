import { useUser } from '@clerk/nextjs';
import { type UIMessage, useUIMessages } from '@convex-dev/agent/react';
import { MessageSquareIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@workspace/ui/chatbot/conversation';
import { Message, MessageContent, MessageResponse } from '@workspace/ui/chatbot/message';
import { Button } from '@workspace/ui/components/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';
import { cn } from '@workspace/ui/lib/utils';

export function ChatbotMessages({ threadId }: { threadId: string }) {
  const { user } = useUser();
  const { results: messages, status, loadMore } = useUIMessages(api.messages.list, { threadId }, { initialNumItems: 4, stream: true });

  return (
    <div className={cn('flex w-full flex-1 justify-center', messages.length !== 0 && 'overflow-y-scroll')}>
      <div className="w-full">
        <Conversation className={cn(messages.length === 0 && 'h-full')}>
          <ConversationContent className={cn(messages.length === 0 ? 'h-full px-0' : 'px-2')}>
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
      {messages.map((message) => (
        <Message
          key={message.key}
          from={message.role}
        >
          <MessageContent className="text-md lg:text-lg">
            <MessageResponse>{message.text}</MessageResponse>
          </MessageContent>
        </Message>
      ))}
    </>
  );
}
