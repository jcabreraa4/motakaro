import { PromptInput, PromptInputBody, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from '@workspace/ui/chatbot/prompt-input';
import { ChatbotDialog } from '@/components/chatbot/chatbot-dialog';
import { type ModelId } from '@/lib/chatbot/models';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { ChatStatus } from 'ai';

interface ChatbotInputProps {
  model: ModelId;
  setModel: (model: ModelId) => void;
  input: string;
  setInput: (input: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  status: ChatStatus;
  handleSubmit: () => void;
  emptyChat: () => void;
  className?: string;
}

export function ChatbotInput({ model, setModel, input, setInput, files, setFiles, status, handleSubmit, emptyChat, className }: ChatbotInputProps) {
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
            <PromptInputButton
              asChild
              variant="outline"
              className="cursor-pointer"
            >
              <label htmlFor="file-upload">
                <PlusIcon size={16} />
              </label>
            </PromptInputButton>
            <input
              multiple
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])}
            />
            <PromptInputButton
              variant="outline"
              className="cursor-pointer"
              onClick={emptyChat}
            >
              <TrashIcon size={16} />
            </PromptInputButton>
          </div>
          <ChatbotDialog
            chatModel={model}
            setChatModel={setModel}
          />
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!(input.trim() || files.length > 0) || status === 'streaming'}
          status={status}
          className="cursor-pointer"
        />
      </PromptInputFooter>
    </PromptInput>
  );
}
