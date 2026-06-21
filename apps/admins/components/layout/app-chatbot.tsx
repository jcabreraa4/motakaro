'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useUIMessages } from '@convex-dev/agent/react';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { Loader2Icon, PlusIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { useChatbot } from '@/hooks/use-chatbot';

import { ChatbotAttachments } from '../chatbot/chatbot-attachments';
import { ChatbotInput } from '../chatbot/chatbot-input';
import { ChatbotMessages } from '../chatbot/chatbot-messages';
import { ChatbotSuggestions } from '../chatbot/chatbot-suggestions';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { chatbot } = useChatbot();

  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [threadId, setThreadId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [creatingThread, setCreatingThread] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const createThread = useMutation(api.threads.create);
  const removeThread = useMutation(api.threads.remove);
  const createMessage = useMutation(api.messages.create);

  const { results: threads, status: threadsStatus } = usePaginatedQuery(api.threads.list, isLoaded && chatbot ? {} : 'skip', {
    initialNumItems: 20
  });

  const { results: messages, status: messagesStatus } = useUIMessages(api.messages.list, isLoaded && threadId ? { threadId } : 'skip', {
    initialNumItems: 30,
    stream: true
  });

  useEffect(() => {
    if (!isLoaded || !chatbot || threadId || creatingThread || threadsStatus === 'LoadingFirstPage') return;

    const firstThread = threads[0];
    if (firstThread) {
      setThreadId(firstThread._id);
      return;
    }

    setCreatingThread(true);
    void createThread()
      .then(setThreadId)
      .finally(() => setCreatingThread(false));
  }, [chatbot, createThread, creatingThread, isLoaded, threadId, threads, threadsStatus]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  async function handleSubmit() {
    const message = input.trim();
    if (!message || !threadId || sending) return;

    setInput('');
    setSending(true);

    try {
      await createMessage({ threadId, message });
    } finally {
      setSending(false);
    }
  }

  async function handleReset() {
    setCreatingThread(true);

    try {
      setInput('');
      setThreadId(await createThread());
    } finally {
      setCreatingThread(false);
    }
  }

  async function handleRemoveThread(event: MouseEvent<HTMLButtonElement>, targetThreadId: string) {
    event.stopPropagation();

    await removeThread({ threadId: targetThreadId });

    if (targetThreadId !== threadId) return;

    const nextThread = threads.find((thread) => thread._id !== targetThreadId);
    setInput('');
    setThreadId(nextThread?._id ?? (await createThread()));
  }

  function getThreadLabel(thread: (typeof threads)[number]) {
    if (thread.title && thread.title !== 'Motakaro Assistant') return thread.title;

    const created = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(thread._creationTime));

    return `Chat ${created}`;
  }

  if (!chatbot) return null;

  const loading = !isLoaded || !threadId || messagesStatus === 'LoadingFirstPage';
  const disabled = loading || sending || creatingThread;

  return (
    <section className="flex w-full flex-col items-center gap-2 pb-2 lg:pb-5 xl:w-120 xl:border-l print:hidden">
      <header className="flex h-14 w-full items-center gap-2 border-b px-3">
        <div className="flex w-full gap-2 overflow-x-scroll">
          {threads.map((thread) => (
            <Button
              key={thread._id}
              onClick={() => setThreadId(thread._id)}
            >
              {thread.title}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          disabled={!isLoaded || creatingThread}
          onClick={handleReset}
          aria-label="New thread"
          className="cursor-pointer"
        >
          {creatingThread ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        </Button>
      </header>
      <div className={cn('flex w-full flex-1 justify-center', messages.length !== 0 && 'overflow-y-scroll')}>
        <div className="w-full">
          <ChatbotMessages messages={messages} />
        </div>
      </div>
      {(messages.length === 0 || files.length !== 0) && (
        <div className="h-9 w-full px-2 lg:px-5">
          {messages.length === 0 && !input.trim() && files.length === 0 ? (
            <ChatbotSuggestions handleSubmit={() => setInput('')} />
          ) : (
            <ChatbotAttachments
              files={files}
              setFiles={setFiles}
            />
          )}
        </div>
      )}
      <ChatbotInput
        input={input}
        setInput={setInput}
        files={files}
        setFiles={setFiles}
        handleSubmit={handleSubmit}
        className="w-full px-2 lg:px-5"
      />
    </section>
  );
}
