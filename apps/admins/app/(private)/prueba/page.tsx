'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import type { ChatStatus } from 'ai';
import { useAction, useMutation, useQuery } from 'convex/react';
import { BotIcon, Loader2Icon, MessageSquareIcon, PlusIcon, SparklesIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@workspace/ui/chatbot/conversation';
import { Message, MessageContent, MessageResponse } from '@workspace/ui/chatbot/message';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';

import { ChatbotAttachments } from '@/components/chatbot/chatbot-attachments';
import { ChatbotInput } from '@/components/chatbot/chatbot-input';
import { ChatbotSuggestions } from '@/components/chatbot/chatbot-suggestions';

import { type UIMessage, useSmoothText, useUIMessages } from '../../../../../packages/backend/node_modules/@convex-dev/agent/dist/react/index.js';

type AssistantThread = {
  id: string;
  title: string;
  status: 'active' | 'archived';
  createdAt: number;
};

type AssistantUIMessage = UIMessage & {
  key?: string;
  text?: string;
  status?: string;
};

function formatThreadDate(value: number) {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(value);
}

function createThreadTitle(prompt: string) {
  const cleanPrompt = prompt.replaceAll(/\s+/g, ' ').trim();
  if (!cleanPrompt) return 'New conversation';
  return cleanPrompt.length > 48 ? `${cleanPrompt.slice(0, 48)}…` : cleanPrompt;
}

function getMessageText(message: AssistantUIMessage) {
  if (message.text) return message.text;

  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

function AssistantMessage({ message }: { message: AssistantUIMessage }) {
  const text = getMessageText(message);
  const [visibleText] = useSmoothText(text, {
    startStreaming: message.status === 'streaming'
  });

  if (!text.trim()) return null;

  return (
    <Message from={message.role}>
      <MessageContent className={cn(message.role === 'assistant' && 'w-full text-base leading-relaxed')}>
        <MessageResponse>{message.status === 'streaming' ? visibleText : text}</MessageResponse>
      </MessageContent>
    </Message>
  );
}

function ThreadButton({ thread, active, pending, onClick }: { thread: AssistantThread; active: boolean; pending: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('w-full rounded-lg border p-3 text-left transition hover:bg-muted', active ? 'border-primary bg-muted' : 'border-transparent')}
    >
      <div className="flex items-start gap-2">
        <MessageSquareIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{thread.title}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatThreadDate(thread.createdAt)}</span>
            {pending && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Loader2Icon className="size-3 animate-spin" />
                Streaming
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Page() {
  const { isLoaded } = useAuth();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [pendingThreadIds, setPendingThreadIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const threads = useQuery(api.assistant.listThreads, isLoaded ? {} : 'skip');
  const createThread = useMutation(api.assistant.createThread);
  const sendMessage = useAction(api.assistant.sendMessage);

  const messagesQuery = useUIMessages(api.assistant.listThreadMessages, activeThreadId ? { threadId: activeThreadId } : 'skip', {
    initialNumItems: 50,
    stream: true
  });

  const messages = messagesQuery.results as AssistantUIMessage[];
  const activeThread = useMemo(() => threads?.find((thread) => thread.id === activeThreadId) ?? null, [threads, activeThreadId]);
  const activeThreadIsPending = activeThreadId ? pendingThreadIds.includes(activeThreadId) : false;
  const chatStatus: ChatStatus = activeThreadIsPending ? 'streaming' : 'ready';

  useEffect(() => {
    if (!threads || threads.length === 0) return;

    const activeThreadExists = activeThreadId ? threads.some((thread) => thread.id === activeThreadId) : false;
    const firstThread = threads[0];
    if (!activeThreadExists && firstThread) {
      setActiveThreadId(firstThread.id);
    }
  }, [threads, activeThreadId]);

  async function handleNewThread() {
    setError(null);
    const threadId = await createThread({ title: 'New conversation' });
    setActiveThreadId(threadId);
    setInput('');
    setFiles([]);
  }

  async function submitPrompt(promptInput: string) {
    const prompt = promptInput.trim();
    if (!prompt || activeThreadIsPending) return;

    if (files.length > 0) {
      setError('Este assistant de Convex todavía no soporta adjuntos. Elimina los archivos para enviar el mensaje.');
      return;
    }

    setError(null);
    setInput('');
    setFiles([]);

    let threadId = activeThreadId;
    if (!threadId) {
      threadId = await createThread({ title: createThreadTitle(prompt) });
      setActiveThreadId(threadId);
    }

    setPendingThreadIds((current) => (current.includes(threadId) ? current : [...current, threadId]));

    try {
      await sendMessage({
        threadId,
        prompt,
        system: `Fecha actual: ${new Date().toISOString()}. Zona horaria del navegador: ${Intl.DateTimeFormat().resolvedOptions().timeZone}.`
      });
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'No se pudo enviar el mensaje.');
    } finally {
      setPendingThreadIds((current) => current.filter((id) => id !== threadId));
    }
  }

  function handleSubmit() {
    void submitPrompt(input);
  }

  function handleSuggestion(suggestion: string) {
    void submitPrompt(suggestion);
  }

  function emptyChat() {
    setInput('');
    setFiles([]);
    setError(null);
  }

  return (
    <main className="grid h-full w-full grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[18rem_1fr] lg:gap-5 lg:p-5">
      <aside className="flex min-h-0 flex-col rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4" />
            <h1 className="font-semibold">AI Threads</h1>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={handleNewThread}
            disabled={!isLoaded}
            className="cursor-pointer"
          >
            <PlusIcon />
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-1 p-2">
            {!threads ? (
              <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                Loading threads...
              </div>
            ) : threads.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No hay threads todavía. Envía un mensaje para crear el primero.</div>
            ) : (
              threads.map((thread) => (
                <ThreadButton
                  key={thread.id}
                  thread={thread}
                  active={thread.id === activeThreadId}
                  pending={pendingThreadIds.includes(thread.id)}
                  onClick={() => setActiveThreadId(thread.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      <section className="flex min-h-0 flex-col rounded-xl border bg-card">
        <header className="flex items-center justify-between gap-3 border-b p-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BotIcon className="size-4" />
              <h2 className="truncate font-semibold">{activeThread?.title ?? 'Motakaro Assistant'}</h2>
            </div>
            <p className="text-sm text-muted-foreground">Streaming en tiempo real con Convex Agent</p>
          </div>
          {activeThreadIsPending && (
            <div className="hidden items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground sm:flex">
              <Loader2Icon className="size-3 animate-spin" />
              Generating
            </div>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <Conversation className="h-full">
            <ConversationContent className={cn('min-h-full', messages.length === 0 && 'h-full')}>
              {messagesQuery.status === 'LoadingFirstPage' ? (
                <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" />
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<BotIcon className="size-8" />}
                  title="No messages yet"
                  description="Crea o selecciona un thread y empieza a hablar con el asistente."
                />
              ) : (
                messages.map((message) => (
                  <AssistantMessage
                    key={message.key ?? `${message.role}-${message.order}-${message.stepOrder}`}
                    message={message}
                  />
                ))
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        <div className="border-t p-3">
          {error && <div className="mb-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          {(messages.length === 0 || files.length !== 0) && (
            <div className="mb-2 h-9">
              {messages.length === 0 && !input.trim() && files.length === 0 ? (
                <ChatbotSuggestions
                  handleSubmit={handleSuggestion}
                  className="justify-start"
                />
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
            status={chatStatus}
            handleSubmit={handleSubmit}
            emptyChat={emptyChat}
            className="px-0"
          />
        </div>
      </section>
    </main>
  );
}
