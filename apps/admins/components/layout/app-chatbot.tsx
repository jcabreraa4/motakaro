'use client';

import { usePathname } from '@/hooks/use-pathname';
import { useAppStateStore } from '@/store/state-store';
import { cn } from '@workspace/ui/lib/utils';

const chatbotPage = 'chatbots';

interface AppChatbotProps {
  className?: string;
}

export function AppChatbot({ className }: AppChatbotProps) {
  const { segments } = usePathname();
  const hideChat = segments[0] === chatbotPage;

  const showChat = useAppStateStore((state) => state.showChat);

  if (hideChat || !showChat) return null;

  return <section className={cn('w-120 border-l', className)}></section>;
}
