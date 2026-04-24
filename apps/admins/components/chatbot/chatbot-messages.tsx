import { MeetingsList, MeetingsGet, DocumentsList, DocumentsGet, WhiteboardsList, WhiteboardsGet, MultimediaList, MultimediaGet, ResourcesList, ResourcesGet } from '@/components/chatbot/chatbot-tools';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@workspace/ui/chatbot/conversation';
import { type AttachmentData, Attachment, AttachmentPreview, AttachmentRemove, Attachments } from '@workspace/ui/chatbot/attachments';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from '@workspace/ui/chatbot/message';
import { OpenIn, OpenInChatGPT, OpenInClaude, OpenInContent, OpenInTrigger } from '@workspace/ui/chatbot/open-in-chat';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { Source, Sources, SourcesContent, SourcesTrigger } from '@workspace/ui/chatbot/sources';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@workspace/ui/chatbot/reasoning';
import { CopyIcon, Loader2Icon, MessageSquareIcon, RefreshCcwIcon } from 'lucide-react';
import type { ChatMessage } from '@/app/api/chatbot/tools';
import { copyText } from '@/utils/copy-text';
import { useUser } from '@clerk/nextjs';
import { Fragment } from 'react';
import { ChatStatus } from 'ai';

interface ChatbotMessagesProps {
  status: ChatStatus;
  messages: ChatMessage[];
  lastInput: string;
  regenerate: () => Promise<void>;
}

export function ChatbotMessages({ status, messages, lastInput, regenerate }: ChatbotMessagesProps) {
  const { user, isLoaded } = useUser();

  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 && (
          <ConversationEmptyState className="xl:mt-40">
            <Empty className="pointer-events-none select-none">
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
        {messages.map((message, messageIndex) => {
          const isLastMessage = messageIndex === messages.length - 1;
          const filePartsList = message.parts.filter((part) => part.type === 'file');
          const sourcePartsList = message.parts.filter((part) => part.type === 'source-url');

          return (
            <Fragment key={message.id}>
              {message.role === 'assistant' && sourcePartsList.length > 0 && (
                <Sources className="my-0">
                  <SourcesTrigger
                    count={sourcePartsList.length}
                    className="cursor-pointer"
                  />
                  {sourcePartsList.map((part, partIndex) => (
                    <SourcesContent key={`${message.id}-${partIndex}`}>
                      <Source
                        key={`${message.id}-${partIndex}`}
                        href={part.url}
                        title={part.url}
                      />
                    </SourcesContent>
                  ))}
                </Sources>
              )}
              {message.parts.map((part, partIndex) => {
                // Basic Interactions
                if (part.type === 'text') {
                  return (
                    <div
                      key={`${message.id}-${partIndex}`}
                      className="flex flex-col gap-3"
                    >
                      <Message from={message.role}>
                        {filePartsList.length > 0 && (
                          <Attachments variant="inline">
                            {filePartsList.map((file, fileIndex) => {
                              const attachmentData: AttachmentData = { ...file, id: `${message.id}-${fileIndex}` };
                              return (
                                <Attachment
                                  key={attachmentData.id}
                                  data={attachmentData}
                                >
                                  <AttachmentPreview />
                                  <AttachmentRemove />
                                </Attachment>
                              );
                            })}
                          </Attachments>
                        )}
                        {part.text.trim() && (
                          <MessageContent className="text-md lg:text-lg">
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        )}
                      </Message>
                      {message.role === 'assistant' && isLastMessage && (
                        <MessageActions className="-ml-2">
                          <MessageAction
                            label="Copy"
                            className="cursor-pointer"
                            onClick={() => copyText({ text: part.text, type: 'message' })}
                          >
                            <CopyIcon />
                          </MessageAction>
                          <MessageAction
                            label="Retry"
                            className="cursor-pointer"
                            onClick={() => regenerate()}
                          >
                            <RefreshCcwIcon />
                          </MessageAction>
                          <OpenIn query={lastInput}>
                            <OpenInTrigger />
                            <OpenInContent>
                              <OpenInChatGPT />
                              <OpenInClaude />
                            </OpenInContent>
                          </OpenIn>
                        </MessageActions>
                      )}
                    </div>
                  );
                } else if (part.type === 'reasoning') {
                  return (
                    <Reasoning
                      key={`${message.id}-${partIndex}`}
                      className="w-full"
                      isStreaming={status === 'streaming' && partIndex === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  );
                }

                // Tools Interactions
                if (part.type === 'tool-meetingsList') {
                  return (
                    <MeetingsList
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-meetingsGet') {
                  return (
                    <MeetingsGet
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-documentsList') {
                  return (
                    <DocumentsList
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-documentsGet') {
                  return (
                    <DocumentsGet
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-whiteboardsList') {
                  return (
                    <WhiteboardsList
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-whiteboardsGet') {
                  return (
                    <WhiteboardsGet
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-multimediaList') {
                  return (
                    <MultimediaList
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-multimediaGet') {
                  return (
                    <MultimediaGet
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-resourcesList') {
                  return (
                    <ResourcesList
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                } else if (part.type === 'tool-resourcesGet') {
                  return (
                    <ResourcesGet
                      key={`${message.id}-${partIndex}`}
                      part={part}
                    />
                  );
                }
              })}
            </Fragment>
          );
        })}
        {status === 'submitted' && <Loader2Icon className="animate-spin text-muted-foreground" />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
