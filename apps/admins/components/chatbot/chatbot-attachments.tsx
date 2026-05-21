import { useState } from 'react';

import { TrashIcon } from 'lucide-react';

import { Suggestions } from '@workspace/ui/chatbot/suggestion';
import { Button } from '@workspace/ui/components/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@workspace/ui/components/hover-card';
import { cn } from '@workspace/ui/lib/utils';

import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';

function Attachment({ file }: { file: File }) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer rounded-l-none border-l-0"
          onClick={() => setOpen(true)}
        >
          {file.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="end"
        className="p-0.5"
      >
        <MultimediaPreview
          preview
          src={URL.createObjectURL(file)}
          name={file.name}
          type={file.type}
        />
      </HoverCardContent>
    </HoverCard>
  );
}

interface ChatbotAttachmentsProps {
  files: File[];
  setFiles: (files: File[]) => void;
  className?: string;
}

export function ChatbotAttachments({ files, setFiles, className }: ChatbotAttachmentsProps) {
  return (
    <Suggestions className={cn('flex gap-3', className)}>
      {files.map((file, index) => (
        <div
          key={index}
          className="flex"
        >
          <Button
            variant="outline"
            className="cursor-pointer rounded-r-none"
            onClick={() => setFiles(files.filter((_, i) => i !== index))}
          >
            <TrashIcon />
          </Button>
          <Attachment file={file} />
        </div>
      ))}
    </Suggestions>
  );
}
