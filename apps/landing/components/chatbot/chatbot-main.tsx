'use client';

import { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { BotIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/shadcn/dialog';

import { SectionContent } from '@/components/layout/app-section';

export function ChatbotMain() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chatbot'
    })
  });

  const busy = status === 'submitted' || status === 'streaming';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed right-4 bottom-4 z-50 shadow-lg">
          <BotIcon />
          Talk to Tokito
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] w-[80vw] max-w-[80vw]!">
        <DialogHeader>
          <DialogTitle>Tokito</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
