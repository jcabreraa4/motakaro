'use client';

import { useState } from 'react';

import { useEveAgent } from 'eve/react';

import { Button } from '@workspace/ui/components/shadcn/button';
import { Input } from '@workspace/ui/components/shadcn/input';
import { cn } from '@workspace/ui/lib/utils';

import { Heading2, Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL;

export default function Page() {
  const agent = useEveAgent({ baseUrl: chatbotUrl });
  const [message, setMessage] = useState('');

  const isBusy = agent.status !== 'idle';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (text.length === 0 || isBusy) return;
    setMessage('');
    void agent.send(text);
  }

  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner className="flex flex-1">
        <SectionContent className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <Heading2>Tokito</Heading2>
            <Button
              variant="outline"
              onClick={() => agent.newSession()}
            >
              Nueva conversación
            </Button>
          </div>

          <div className="flex min-h-64 flex-1 flex-col gap-3 overflow-y-auto">
            {agent.messages.length === 0 ? (
              <Paragraph className="text-muted-foreground">Envía un mensaje para empezar.</Paragraph>
            ) : (
              agent.messages.map((item) => (
                <article
                  key={item.id}
                  className={cn('flex max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2', item.role === 'user' ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-muted')}
                >
                  {item.parts.map((part, index) => {
                    if (part.type === 'text' && part.text.length > 0) {
                      return <p key={part.id ?? index}>{part.text}</p>;
                    }
                    if (part.type === 'tool') {
                      return (
                        <p
                          key={part.callId}
                          className="text-xs opacity-70"
                        >
                          {part.label}
                        </p>
                      );
                    }
                    return null;
                  })}
                </article>
              ))
            )}
          </div>

          {agent.error ? <Paragraph className="text-destructive">{agent.error.message}</Paragraph> : null}

          <form
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isBusy}
              placeholder={isBusy ? 'El agente está escribiendo…' : 'Escribe un mensaje…'}
            />
            <Button
              type="submit"
              disabled={isBusy || message.trim().length === 0}
            >
              Enviar
            </Button>
          </form>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
