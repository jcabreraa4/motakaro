'use client';

import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useUIMessages } from '@convex-dev/agent/react';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { Loader2Icon, PlusIcon, SendIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

import { useChatbot } from '@/hooks/use-chatbot';
import { suggestions } from '@/lib/chatbot/suggestions';

export function AppChatbot() {
  const { isLoaded } = useAuth();
  const { chatbot } = useChatbot();

  const [input, setInput] = useState('');
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

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

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
    <section className="flex h-full w-full flex-col border-t bg-background xl:w-120 xl:border-t-0 xl:border-l print:hidden">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {threadsStatus === 'LoadingFirstPage' ? (
            <div className="flex h-8 items-center gap-2 rounded-md bg-muted px-2.5 text-xs text-muted-foreground">
              <Loader2Icon className="size-3 animate-spin" />
              Loading...
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread._id}
                className="group/thread relative max-w-36 shrink-0"
              >
                <button
                  type="button"
                  className={cn('flex h-8 w-full cursor-pointer items-center rounded-md border px-2 pr-6 text-sm transition', thread._id === threadId ? 'border-primary bg-primary text-primary-foreground' : 'border-transparent bg-muted/50 hover:bg-muted')}
                  onClick={() => setThreadId(thread._id)}
                >
                  <span className="truncate">{getThreadLabel(thread)}</span>
                </button>
                <button
                  type="button"
                  aria-label="Delete thread"
                  className="absolute top-1/2 right-1 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm opacity-0 transition group-hover/thread:opacity-100 hover:bg-background/60"
                  onClick={(event) => void handleRemoveThread(event, thread._id)}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={!isLoaded || creatingThread}
          onClick={handleReset}
          aria-label="New thread"
          className="cursor-pointer"
        >
          {creatingThread ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        </Button>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div
          ref={viewportRef}
          className="flex h-full flex-col gap-3 overflow-y-auto p-3"
        >
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Loading chat...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-1 flex-col justify-end gap-2">
              {suggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-md border bg-muted/30 px-3 py-2 text-left text-sm transition hover:bg-muted"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.key}
                className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div className={cn('max-w-[85%] rounded-md px-3 py-2 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}>
                  <p className="break-words whitespace-pre-wrap">{message.text || (message.status === 'streaming' ? '...' : '')}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </ScrollArea>

      <form
        className="flex shrink-0 gap-2 border-t p-3"
        onSubmit={handleSubmit}
      >
        <Textarea
          value={input}
          disabled={disabled}
          placeholder="Ask anything..."
          rows={1}
          className="max-h-32 min-h-10 resize-none"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || input.trim().length === 0}
          aria-label="Send message"
          className="cursor-pointer self-end"
        >
          {sending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        </Button>
      </form>
    </section>
  );
}
