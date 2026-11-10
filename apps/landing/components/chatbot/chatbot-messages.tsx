import type { ChatStatus, UIMessage } from 'ai';

import { Bubble, BubbleContent } from '@workspace/ui/components/bubble';
import { Message, MessageContent } from '@workspace/ui/components/message';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@workspace/ui/components/message-scroller';
import { Spinner } from '@workspace/ui/components/spinner';

interface ChatbotMessagesProps {
  status: ChatStatus;
  messages: UIMessage[];
}

export function ChatbotMessages({ status, messages }: ChatbotMessagesProps) {
  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent aria-busy={status === 'streaming'}>
            {messages.map((message) => {
              const isUser = message.role === 'user';

              return (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={isUser}
                >
                  {message.parts.map(
                    (part, partIndex) =>
                      part.type === 'text' && (
                        <Message
                          key={partIndex}
                          align={isUser ? 'end' : 'start'}
                        >
                          <MessageContent>
                            <Bubble
                              align={isUser ? 'end' : 'start'}
                              variant={isUser ? 'muted' : 'ghost'}
                            >
                              <BubbleContent>{part.text}</BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      )
                  )}
                </MessageScrollerItem>
              );
            })}
            {status === 'submitted' && (
              <MessageScrollerItem key="spinner">
                <Message align="start">
                  <MessageContent>
                    <Spinner />
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
