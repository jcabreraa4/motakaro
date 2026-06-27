import type { ThreadDoc } from '@convex-dev/agent';
import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

export interface ChatbotThreadsProps {
  threads: ThreadDoc[];
  setThreadId: (threadId: string) => void;
}

export function ChatbotThreads({ threads, setThreadId }: ChatbotThreadsProps) {
  const removeThread = useMutation(api.threads.remove);

  return (
    <div className="flex flex-col gap-3">
      {threads.map((thread) => (
        <div
          key={thread._id}
          className="flex"
        >
          <Button
            variant="outline"
            className="flex-1 cursor-pointer justify-start truncate rounded-r-none"
            onClick={() => setThreadId(thread._id)}
          >
            <span className="truncate">{thread.title}</span>
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer rounded-l-none border-l-0"
            onClick={() => removeThread({ id: thread._id })}
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}
