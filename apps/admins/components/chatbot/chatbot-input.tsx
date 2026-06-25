import { useState } from 'react';

import { useMutation } from 'convex/react';
import { PaperclipIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@workspace/ui/chatbot/prompt-input';

import { ChatbotAttachments } from '@/components/chatbot/chatbot-attachments';

interface ChatbotInputProps {
  threadId: string;
  className?: string;
}

export function ChatbotInput({ threadId, className }: ChatbotInputProps) {
  const createMessage = useMutation(api.messages.create);

  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  async function handleSubmit() {
    await createMessage({ threadId, prompt: input.trim() })
      .then(() => setInput(''))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  return (
    <>
      {files.length !== 0 && (
        <div className="h-9 w-full">
          <ChatbotAttachments
            files={files}
            setFiles={setFiles}
            className={className}
          />
        </div>
      )}
      <PromptInput
        multiple
        globalDrop
        onSubmit={handleSubmit}
        className={className}
      >
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Can I help you with anything?"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <input
              multiple
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])}
            />
            <PromptInputButton
              asChild
              variant="outline"
              className="cursor-pointer"
            >
              <label htmlFor="file-upload">
                <PaperclipIcon />
              </label>
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!(input.trim() || files.length > 0)}
            className="cursor-pointer"
          />
        </PromptInputFooter>
      </PromptInput>
    </>
  );
}
