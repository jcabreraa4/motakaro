'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useAppStateStore } from '@/store/state-store';
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { type ModelId, initialModel } from '@/lib/chatbot/models';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { ChatbotAttachments } from '@/components/chatbot/chatbot-attachments';
import { ChatbotSuggestions } from '@/components/chatbot/chatbot-suggestions';
import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { api } from '@workspace/backend/_generated/api';
import { ChatMessage } from '@/app/api/chatbot/tools';
import { usePathname } from '@/hooks/use-pathname';
import { useRouter } from 'next/navigation';
import { DefaultChatTransport } from 'ai';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs';

export function AppChatbot() {
  const router = useRouter();
  const showChat = useAppStateStore((state) => state.showChat);

  const { userId, isLoaded } = useAuth();
  const { fullPath } = usePathname();

  const { messages, setMessages, status, sendMessage, regenerate, addToolOutput } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({ api: '/api/chatbot' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      if (toolCall.toolName === 'usersRedirect') {
        const { section, id } = toolCall.input;
        const path = id ? `${section}/${id}` : section;
        router.push(path);
        addToolOutput({
          tool: 'usersRedirect',
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
  const [chatModel, setChatModel] = useState<ModelId>(initialModel);

  // Request Data
  const employee = useQuery(api.employees.get, isLoaded ? { clerkId: userId! } : 'skip');
  const system = `User's data: ${JSON.stringify(employee)}. Current location within the app: ${fullPath}.`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function handleSubmit() {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    sendMessage(
      { text: input, files: dt.files },
      {
        body: {
          model: chatModel,
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
          model: chatModel,
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

  if (!showChat) return null;

  return (
    <section className="flex w-full flex-col items-center gap-2 border-l py-2 shadow-md lg:py-5 xl:w-120 print:hidden">
      <div className="flex w-full flex-1 justify-center overflow-y-scroll">
        <div className="w-full">
          <ChatbotMessages
            messages={messages}
            status={status}
            regenerate={regenerate}
            lastInput={lastInput}
          />
        </div>
      </div>
      {((messages.length === 0 && !input.trim()) || files.length !== 0) && (
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
        model={chatModel}
        setModel={setChatModel}
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
