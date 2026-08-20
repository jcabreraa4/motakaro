import { XIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { useChatbot } from '@/hooks/use-chatbot';

export function ChatbotHeader() {
  const { setOpen } = useChatbot();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-sidebar px-4 md:h-16 md:bg-transparent">
      <p className="text-sm font-medium">Ghostty Agents</p>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => setOpen(!open)}
      >
        <XIcon className="size-5" />
      </Button>
    </header>
  );
}
