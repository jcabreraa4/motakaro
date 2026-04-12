'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useAppStateStore } from '@/store/state-store';
import { type ModelId, initialModel } from '@/lib/chatbot/models';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';
import { ChatbotAttachments } from '@/components/chatbot/chatbot-attachments';
import { ChatbotSuggestions } from '@/components/chatbot/chatbot-suggestions';
import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatMessage } from '@/app/api/chatbot/tools';
import { DefaultChatTransport } from 'ai';
import { useUser } from '@clerk/nextjs';
import { usePathname } from '@/hooks/use-pathname';

export function AppChatbot() {
  const { user } = useUser();
  const { fullPath } = usePathname();
  const { messages, setMessages, status, sendMessage, regenerate } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chatbot'
    })
  });

  const showChat = useAppStateStore((state) => state.showChat);

  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [lastInput, setLastInput] = useState('');
  const [chatModel, setChatModel] = useState<ModelId>(initialModel);

  const system = `User's first name: ${user?.firstName}. Current location within the app: ${fullPath}.`;

  function handleSubmit() {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    sendMessage(
      { text: input, files: dt.files },
      {
        body: {
          model: chatModel,
          system: system
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
          system: system
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
    <main className="flex w-full flex-col items-center gap-2 border-l py-5 xl:w-120">
      <section className="flex w-full flex-1 justify-center overflow-y-scroll">
        <div className="w-full">
          <ChatbotMessages
            messages={messages}
            status={status}
            regenerate={regenerate}
            lastInput={lastInput}
          />
        </div>
      </section>
      {((messages.length === 0 && !input.trim()) || files.length !== 0) && (
        <section className="h-9 w-full px-5">
          {messages.length === 0 && !input.trim() && files.length === 0 ? (
            <ChatbotSuggestions handleSubmit={handleSuggestion} />
          ) : (
            <ChatbotAttachments
              files={files}
              setFiles={setFiles}
            />
          )}
        </section>
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
        className="w-full px-5"
      />
    </main>
  );
}
