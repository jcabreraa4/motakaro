import type { ThreadDoc } from '@convex-dev/agent';
import { useMutation } from 'convex/react';
import { PlusIcon, TrashIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

export interface ChatbotThreadsProps {
  threads: ThreadDoc[];
  setThreadId: (threadId: string) => void;
}

export function ChatbotThreads({ threads, setThreadId }: ChatbotThreadsProps) {
  const createThread = useMutation(api.threads.create);
  const removeThread = useMutation(api.threads.remove);

  return (
    <div className="flex h-full flex-col gap-3 p-3 md:gap-5 md:p-5">
      <Button
        variant="outline"
        className="w-full cursor-pointer"
        onClick={() => createThread().then((id) => setThreadId(id))}
      >
        <PlusIcon />
        Create Thread
      </Button>
      <div className="flex flex-col gap-3">
        {threads.map((thread) => (
          <div
            key={thread._id}
            className="flex"
          >
            <Button
              variant="outline"
              className="flex-1 cursor-pointer rounded-r-none"
              onClick={() => setThreadId(thread._id)}
            >
              {thread.title}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer rounded-l-none border-l-0"
              onClick={() => removeThread({ threadId: thread._id })}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
