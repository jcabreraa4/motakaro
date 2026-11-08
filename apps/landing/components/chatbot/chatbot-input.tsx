import { useState } from 'react';

import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatStatus, UIMessage } from 'ai';
import { SendHorizontalIcon } from 'lucide-react';

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
    sendMessage({ text: input });
    setInput('');
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
          onClick={handleSubmit}
          disabled={!input.trim() || isBusy}
        >
          {isBusy ? <Spinner /> : <SendHorizontalIcon />}
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
