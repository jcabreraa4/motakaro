'use client';

import { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { BotIcon, XIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { MotakaroLogo } from '@workspace/ui/components/custom/motakaro-logo';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@workspace/ui/components/dialog';

import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotMessages } from '@/components/chatbot/chatbot-messages';

export function ChatbotMain() {
  const [open, setOpen] = useState(false);

  const { status, messages, sendMessage } = useChat({
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
        <Button className="fixed right-5 bottom-5 z-50 shadow-lg hover:bg-primary">
          <BotIcon />
          Assistant
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex h-[80vh] w-full flex-col gap-3 sm:max-w-[80vw]"
      >
        <DialogHeader className="flex h-fit flex-row items-center justify-between">
          <MotakaroLogo />
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            <XIcon />
          </Button>
        </DialogHeader>
        <ChatbotMessages
          messages={messages}
          status={status}
        />
        <ChatbotInput
          status={status}
          sendMessage={sendMessage}
        />
      </DialogContent>
    </Dialog>
  );
}
