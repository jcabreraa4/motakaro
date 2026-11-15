import type { UseEveAgentReturn } from 'eve/react';
import { Streamdown } from 'streamdown';

import { Bubble, BubbleContent } from '@workspace/ui/components/bubble';
import { Message, MessageContent } from '@workspace/ui/components/message';
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from '@workspace/ui/components/message-scroller';
import { Spinner } from '@workspace/ui/components/spinner';

export function AgentsMain({ agent }: { agent: UseEveAgentReturn }) {
  const busy = agent.status === 'busy';
  const pending = busy && agent.messages.at(-1)?.role === 'user';

  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent aria-busy={busy}>
            {agent.messages.map((message) => {
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
                          key={part.id ?? partIndex}
                          align={isUser ? 'end' : 'start'}
                          className="px-5"
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
                              <Streamdown
                                className="typeset typeset-docs text-base font-medium"
                                isAnimating={message.metadata?.status === 'streaming'}
                              >
                                {part.text}
                              </Streamdown>
                            )}
                          </MessageContent>
                        </Message>
                      )
                  )}
                </MessageScrollerItem>
              );
            })}
            {pending && (
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
