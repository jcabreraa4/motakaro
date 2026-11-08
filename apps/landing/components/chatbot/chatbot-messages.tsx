import type { UIMessage } from 'ai';

import { Conversation, ConversationContent, ConversationScrollButton } from '@workspace/ui/components/chatbot/conversation';
import { Message, MessageResponse } from '@workspace/ui/components/chatbot/message';

export function ChatbotMessages({ messages }: { messages: UIMessage[] }) {
  return (
    <Conversation className="min-h-0 flex-1 overflow-y-auto">
      <ConversationContent>
        {messages.map((message, index) => (
          <Message
            key={index}
            from={message.role}
          >
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>;
              }
            })}
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
