import { MicIcon, PaperclipIcon } from 'lucide-react';

import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@workspace/ui/chatbot/prompt-input';
import { cn } from '@workspace/ui/lib/utils';

interface ChatbotInputProps {
  input: string;
  setInput: (input: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  handleSubmit: () => void;
  className?: string;
}

export function ChatbotInput({ input, setInput, files, setFiles, handleSubmit, className }: ChatbotInputProps) {
  return (
    <PromptInput
      globalDrop
      multiple
      onSubmit={handleSubmit}
      className={cn(className, !input && 'select-none')}
    >
      <PromptInputBody>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Can I help you with anything?"
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools className="items-between flex w-full justify-between pe-3">
          <div className="flex gap-2">
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
            <PromptInputButton
              variant="outline"
              className="cursor-pointer"
            >
              <MicIcon />
            </PromptInputButton>
          </div>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!(input.trim() || files.length > 0)}
          className="cursor-pointer"
        />
      </PromptInputFooter>
    </PromptInput>
  );
}
