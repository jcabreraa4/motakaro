import type { ChatStatus, UIMessage } from 'ai';
import { Streamdown } from 'streamdown';

import { Bubble, BubbleContent } from '@workspace/ui/components/bubble';
import { Message, MessageContent } from '@workspace/ui/components/message';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@workspace/ui/components/message-scroller';
import { Spinner } from '@workspace/ui/components/spinner';

interface ChatbotTextsProps {
  status: ChatStatus;
  messages: UIMessage[];
}

export function ChatbotTexts({ status, messages }: ChatbotTextsProps) {
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
                          className="px-6"
                        >
                          <MessageContent>
                            {isUser ? (
                              <Bubble
                                align="end"
                                variant="muted"
                              >
                                <BubbleContent className="text-base font-medium">{part.text}</BubbleContent>
                              </Bubble>
                            ) : (
                              <Streamdown className="text-base font-medium">{part.text}</Streamdown>
                            )}
                          </MessageContent>
                        </Message>
                      )
                  )}
                </MessageScrollerItem>
              );
            })}
            {status === 'submitted' && (
              <MessageScrollerItem key="spinner">
                <Message
                  align="start"
                  className="px-6"
                >
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
