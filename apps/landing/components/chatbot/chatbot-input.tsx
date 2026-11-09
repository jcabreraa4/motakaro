import { useState } from 'react';

import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatStatus, UIMessage } from 'ai';
import { PlusIcon, SendHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@workspace/ui/components/input-group';
import { Spinner } from '@workspace/ui/components/spinner';

interface ChatbotInputProps {
  status: ChatStatus;
  sendMessage: UseChatHelpers<UIMessage>['sendMessage'];
}

export function ChatbotInput({ status, sendMessage }: ChatbotInputProps) {
  const [input, setInput] = useState('');

  const isBusy = status === 'submitted' || status === 'streaming';

  function handleSubmit() {
    sendMessage({ text: input })
      .then(() => setInput(''))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  return (
    <InputGroup>
      <InputGroupTextarea
        value={input}
        className="min-h-12"
        placeholder="Can I help you with anything?"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          size="icon-sm"
          variant="outline"
        >
          <PlusIcon />
        </InputGroupButton>
        <InputGroupButton
          size="icon-sm"
          variant="default"
          onClick={handleSubmit}
          disabled={!input.trim() || isBusy}
        >
          {isBusy ? <Spinner /> : <SendHorizontalIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
