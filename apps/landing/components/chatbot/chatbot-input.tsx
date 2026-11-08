import { useState } from 'react';

import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatStatus, UIMessage } from 'ai';

import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@workspace/ui/components/chatbot/prompt-input';

interface ChatbotInputProps {
  status: ChatStatus;
  sendMessage: UseChatHelpers<UIMessage>['sendMessage'];
}

export function ChatbotInput({ status, sendMessage }: ChatbotInputProps) {
  const [input, setInput] = useState('');

  function handleSubmit() {
    sendMessage({ text: input });
    setInput('');
  }

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Can I help you with anything?"
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools></PromptInputTools>
        <PromptInputSubmit
          disabled={!input.trim() || status === 'streaming'}
          className="cursor-pointer"
        />
      </PromptInputFooter>
    </PromptInput>
  );
}
