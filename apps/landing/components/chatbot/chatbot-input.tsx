import { useState } from 'react';

import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatStatus, UIMessage } from 'ai';
import { FileTextIcon, PlusIcon, SendHorizontalIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentMedia, AttachmentTitle } from '@workspace/ui/components/attachment';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@workspace/ui/components/input-group';
import { Spinner } from '@workspace/ui/components/spinner';

interface ChatbotInputProps {
  status: ChatStatus;
  sendMessage: UseChatHelpers<UIMessage>['sendMessage'];
}

export function ChatbotInput({ status, sendMessage }: ChatbotInputProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const busy = status === 'submitted' || status === 'streaming';
  const disabled = busy || (!input.trim() && files.length === 0);

  function handleSubmit() {
    // Check Status
    if (disabled) return;

    // Convert Files
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));

    // Send Message
    sendMessage({ text: input, files: transfer.files }).catch(() => toast.error('An internal error has occurred.'));

    // Clean Inputs
    setInput('');
    setFiles([]);
  }

  return (
    <InputGroup>
      <input
        multiple
        type="file"
        id="file-input"
        className="hidden"
        onChange={(e) => {
          // Convert Files
          const selected = Array.from(e.target.files ?? []);

          // Insert Files
          setFiles((current) => [...current, ...selected]);

          // Reset Input
          e.target.value = '';
        }}
      />
      {files.length > 0 && (
        <InputGroupAddon
          align="block-start"
          className="flex-wrap"
        >
          {files.map((file, index) => (
            <Attachment
              size="sm"
              key={index}
            >
              <AttachmentMedia>
                <FileTextIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{file.name}</AttachmentTitle>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction onClick={() => setFiles((current) => current.filter((item) => item !== file))}>
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </InputGroupAddon>
      )}
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
      <InputGroupAddon
        align="block-end"
        className="flex justify-between"
      >
        <InputGroupButton
          asChild
          size="icon-sm"
          variant="outline"
          className="cursor-pointer"
        >
          <label htmlFor="file-input">
            <PlusIcon />
          </label>
        </InputGroupButton>
        <InputGroupButton
          size="icon-sm"
          variant="default"
          onClick={handleSubmit}
          disabled={disabled}
        >
          {busy ? <Spinner /> : <SendHorizontalIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
