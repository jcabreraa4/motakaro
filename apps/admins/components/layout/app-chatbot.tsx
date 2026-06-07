'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { useAuth } from '@clerk/nextjs';
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { DefaultChatTransport } from 'ai';
import { useQuery } from 'convex/react';
import { GhostIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { ChatMessage } from '@/app/api/chatbot/tools';
import { ChatbotAttachments } from '@/components/chatbot/chatbot-attachments';
import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { ChatbotSuggestions } from '@/components/chatbot/chatbot-suggestions';
import { useChatbot } from '@/hooks/use-chatbot';
import { usePathname } from '@/hooks/use-pathname';

export function AppChatbot() {
  const { push } = useRouter();
  const { isLoaded } = useAuth();
  const { fullPath } = usePathname();
  const { chatbot, toggleChatbot } = useChatbot();

  const { messages, setMessages, status, sendMessage, regenerate, addToolOutput } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({ api: '/api/chatbot' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      if (toolCall.toolName === 'userRedirect') {
        const { section, id } = toolCall.input;
        const path = id ? `${section}/${id}` : section;
        push(path);
        addToolOutput({
          tool: 'userRedirect',
          toolCallId: toolCall.toolCallId,
          output: {
            success: true,
            redirect: path
          }
        });
      }
    }
  });

  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [lastInput, setLastInput] = useState('');

  // Request Data
  const employee = useQuery(api.employees.get, isLoaded ? {} : 'skip');
  const system = `User's name is: ${employee?.name} ${employee?.surname}. User's role within Motakaro is: ${employee?.role}. Current location within the app: ${fullPath}.`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function handleSubmit() {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    sendMessage(
      { text: input, files: dt.files },
      {
        body: {
          system: system,
          timezone: timezone
        }
      }
    );
    setLastInput(input);
    setInput('');
    setFiles([]);
  }

  function handleSuggestion(suggestion: string) {
    sendMessage(
      { text: suggestion },
      {
        body: {
          system: system,
          timezone: timezone
        }
      }
    );
    setLastInput(suggestion);
  }

  function emptyChat() {
    setMessages([]);
    setLastInput('');
    setInput('');
    setFiles([]);
  }

  if (!chatbot) return null;

  return (
    <section className="flex w-full flex-col items-center gap-2 pb-2 lg:pb-5 xl:w-120 xl:border-l print:hidden">
      <div className="h-9 w-full px-2">
        <div className="flex h-full w-full items-center justify-between px-2">
          <div className="flex gap-1.5">
            <GhostIcon className="size-4.5" />
            <span className="text-sm select-none">Assistant</span>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={toggleChatbot}
            className="cursor-pointer"
          >
            <XIcon />
          </Button>
        </div>
        <Separator />
      </div>
      <div className={cn('flex w-full flex-1 justify-center', messages.length !== 0 && 'overflow-y-scroll')}>
        <div className="w-full">
          <ChatbotMessages
            messages={messages}
            status={status}
            regenerate={regenerate}
            lastInput={lastInput}
          />
        </div>
      </div>
      {(messages.length === 0 || files.length !== 0) && (
        <div className="h-9 w-full px-2 lg:px-5">
          {messages.length === 0 && !input.trim() && files.length === 0 ? (
            <ChatbotSuggestions handleSubmit={handleSuggestion} />
          ) : (
            <ChatbotAttachments
              files={files}
              setFiles={setFiles}
            />
          )}
        </div>
      )}
      <ChatbotInput
        input={input}
        setInput={setInput}
        files={files}
        setFiles={setFiles}
        status={status}
        handleSubmit={handleSubmit}
        emptyChat={emptyChat}
        className="w-full px-2 lg:px-5"
      />
    </section>
  );
}
