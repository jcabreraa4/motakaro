'use client';

import { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { BotIcon, XIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { MotakaroLogo } from '@workspace/ui/components/custom/motakaro-logo';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@workspace/ui/components/dialog';
import { Separator } from '@workspace/ui/components/separator';

import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotTexts } from '@/components/chatbot/chatbot-texts';

const initialMessages: UIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: "Hi, I'm Motakaro's AI assistant. How can I help you?" }]
  }
];

export function ChatbotMain() {
  const [open, setOpen] = useState(false);

  const { status, messages, sendMessage } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chatbot'
    })
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="blackout"
          className="fixed right-5 bottom-5 z-50"
        >
          <BotIcon />
          Assistant
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex h-[80vh] w-full flex-col gap-5 px-0 sm:max-w-[80vw]"
      >
        <DialogHeader className="flex h-fit flex-row items-center justify-between px-6">
          <MotakaroLogo />
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            <XIcon />
          </Button>
        </DialogHeader>
        <div className="px-6">
          <Separator />
        </div>
        <ChatbotTexts
          status={status}
          messages={messages}
        />
        <DialogFooter className="px-6">
          <ChatbotInput
            status={status}
            sendMessage={sendMessage}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
