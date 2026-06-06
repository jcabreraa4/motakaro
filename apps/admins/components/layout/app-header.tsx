'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { BotIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { HeaderButton } from '@workspace/ui/custom/header-button';
import { ThemeButton } from '@workspace/ui/custom/theme-button';
import { cn } from '@workspace/ui/lib/utils';

import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useChatbot } from '@/hooks/use-chatbot';
import { useHeader } from '@/hooks/use-header';
import { usePathname } from '@/hooks/use-pathname';
import { usePresence } from '@/hooks/use-presence';

function HeaderBreadcrumb() {
  const { segments } = usePathname();
  const { closeMobile } = useChatbot();
  const { subroute, setSubroute } = useHeader();

  useEffect(() => {
    if (!segments[1]) setSubroute(null);
  }, [segments[1]]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem onClick={closeMobile}>
          <Link href={`/${segments[0]}`}>
            <BreadcrumbPage className="font-medium capitalize select-none">{segments[0]}</BreadcrumbPage>
          </Link>
        </BreadcrumbItem>
        {subroute && (
          <>
            <BreadcrumbSeparator className="hidden text-black lg:block dark:text-white" />
            <BreadcrumbItem className="pointer-events-none hidden select-none lg:block">
              <BreadcrumbPage>{subroute}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function UserPresence({ className }: { className?: string }) {
  const { actives } = usePresence();

  if (!actives || actives.length === 0) return null;

  return (
    <div className={cn('flex gap-2', className)}>
      {actives.map((employee) => (
        <Tooltip key={employee._id}>
          <TooltipTrigger asChild>
            <div className="relative cursor-default">
              <Avatar className="size-8">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-xs">{employee.name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-background bg-green-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{`${employee.name ?? ''} ${employee.surname ?? ''}`.trim()}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function ChatbotButton() {
  const { chatbot, toggleChatbot } = useChatbot();

  return (
    <HeaderButton
      onClick={toggleChatbot}
      className={cn(chatbot && 'text-black dark:text-white')}
    >
      <BotIcon className="size-6" />
    </HeaderButton>
  );
}

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-x border-t bg-sidebar px-3 transition-[width,height] ease-linear md:h-16 md:rounded-t-md md:bg-white md:px-4 dark:bg-sidebar dark:md:bg-[#0A0A0A] print:hidden">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <HeaderBreadcrumb />
      </div>
      <div className="flex gap-8">
        <UserPresence className="hidden select-none 2xl:flex" />
        <div className="flex gap-2">
          <ChatbotButton />
          <NotificationsPopover />
          <ThemeButton className="hidden md:flex" />
        </div>
      </div>
    </header>
  );
}
