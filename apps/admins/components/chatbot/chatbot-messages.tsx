import { useUser } from '@clerk/nextjs';
import { type UIMessage } from '@convex-dev/agent/react';
import { MessageSquareIcon } from 'lucide-react';

import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@workspace/ui/chatbot/conversation';
import { Message, MessageContent, MessageResponse } from '@workspace/ui/chatbot/message';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { cn } from '@workspace/ui/lib/utils';

export function ChatbotMessages({ messages }: { messages: UIMessage[] }) {
  const { user, isLoaded } = useUser();

  return (
    <Conversation className={cn(messages.length === 0 && 'h-full')}>
      <ConversationContent className={cn(messages.length === 0 ? 'h-full px-0' : 'px-2')}>
        {messages.length === 0 && (
          <ConversationEmptyState className="h-full select-none">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquareIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">No Messages Yet</EmptyTitle>
                {isLoaded && <EmptyDescription className="text-md">How can I help you today, {user?.firstName}?</EmptyDescription>}
              </EmptyHeader>
            </Empty>
          </ConversationEmptyState>
        )}
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
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
