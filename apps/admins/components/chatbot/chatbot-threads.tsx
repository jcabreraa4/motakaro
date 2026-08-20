import type { ThreadDoc } from '@convex-dev/agent';
import { useMutation } from 'convex/react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

import { AppSection } from '@/components/layout/app-section';

export interface ChatbotThreadsProps {
  threads: ThreadDoc[];
  setThreadId: (threadId: string) => void;
}

export function ChatbotThreads({ threads, setThreadId }: ChatbotThreadsProps) {
  const createThread = useMutation(api.threads.create);
  const removeThread = useMutation(api.threads.remove);

  function handleCreate() {
    createThread()
      .then((id) => setThreadId(id))
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  function handleRemove(id: string) {
    removeThread({ id }).catch(() => toast.error('An internal error has ocurred.'));
  }

  return (
    <AppSection className="flex flex-col gap-5">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleCreate}
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
              className="flex-1 justify-start truncate rounded-r-none"
              onClick={() => setThreadId(thread._id)}
            >
              <span className="truncate">{thread.title}</span>
            </Button>
            <Button
              variant="outline"
              className="rounded-l-none border-l-0"
              onClick={() => handleRemove(thread._id)}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
    </AppSection>
  );
}
