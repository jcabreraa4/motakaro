'use client';

import { usePathname } from '@/hooks/use-pathname';
import { KnowledgeSidebar } from '@/components/chatbots/knowledge-sidebar';
import { ChatbotsSidebar } from '@/components/chatbots/chatbots-sidebar';
import { useAppStateStore } from '@/store/state-store';
import { cn } from '@workspace/ui/lib/utils';

const chatbotPage = 'chatbots';

export function AppSideTool({ className }: { className?: string }) {
  const { segments } = usePathname();
  const isChatbotsPage = segments[0] === chatbotPage;

  const showChat = useAppStateStore((state) => state.showChat);
  const showKnowledge = useAppStateStore((state) => state.showKnowledge);

  if (!isChatbotsPage && showChat) {
    return <ChatbotsSidebar className={className} />;
  }

  if (isChatbotsPage && showKnowledge) {
    return <KnowledgeSidebar className={cn(className)} />;
  }

  return null;
}
