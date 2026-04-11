import { Suggestions } from '@workspace/ui/chatbot/suggestion';
import { Button } from '@workspace/ui/components/button';
import { TrashIcon } from 'lucide-react';

interface ChatbotAttachmentsProps {
  files: File[];
  setFiles: (files: File[]) => void;
  className?: string;
}

export function ChatbotAttachments({ files, setFiles, className }: ChatbotAttachmentsProps) {
  return (
    <Suggestions className={className}>
      {files.map((file, index) => (
        <div
          key={index}
          className="flex gap-1"
        >
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setFiles(files.filter((_, i) => i !== index))}
          >
            <TrashIcon />
            {file.name}
          </Button>
        </div>
      ))}
    </Suggestions>
  );
}
