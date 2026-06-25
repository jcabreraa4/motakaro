import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

interface ChatbotHeaderProps {
  title?: string;
  exitThread: () => void;
  className?: string;
}

export function ChatbotHeader({ title, exitThread, className }: ChatbotHeaderProps) {
  return (
    <div className={className}>
      <Button
        variant="outline"
        className="w-full cursor-pointer justify-start gap-2 truncate"
        onClick={exitThread}
      >
        <ArrowLeftIcon className="hidden lg:block" />
        <span className="truncate">{title || 'Untitled Thread'}</span>
      </Button>
    </div>
  );
}
