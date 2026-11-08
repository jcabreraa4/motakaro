'use client';

import { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

export default function Page() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chatbot'
    })
  });

  const busy = status === 'submitted' || status === 'streaming';

  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner className="flex flex-1">
        <SectionContent className="relative flex flex-1 flex-col gap-4">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className="whitespace-pre-wrap"
              >
                <b>{message.role === 'user' ? 'Tú' : 'Tokito'}:</b> {message.parts.map((part, i) => (part.type === 'text' ? <span key={i}>{part.text}</span> : null))}
              </div>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim() || busy) return;
              sendMessage({ text: input });
              setInput('');
            }}
          >
            <input
              className="flex-1 rounded border px-3 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe algo..."
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded border px-4 py-2"
            >
              Enviar
            </button>
          </form>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
