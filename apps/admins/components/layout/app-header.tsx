'use client';

import { useEffect } from 'react';
import { useMainStore } from '@/store/main-store';
import { usePathname } from '@/hooks/use-pathname';
import { Separator } from '@workspace/ui/components/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { HeaderThemeButton } from '@workspace/ui/custom/theme-buttons';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { AppPresence } from '@/components/layout/app-presence';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { BotIcon } from 'lucide-react';
import Link from 'next/link';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function AppHeader() {
  const { segments } = usePathname();
  const section = capitalize(segments[0]!);

  const subroute = useMainStore((state) => state.subroute);
  const setSubroute = useMainStore((state) => state.setSubroute);

  const showChatbot = useMainStore((state) => state.showChatbot);
  const toggleChatbot = useMainStore((state) => state.toggleChatbot);

  function cleanSubroute() {
    setSubroute(null);
  }

  useEffect(() => {
    if (!segments[1]) cleanSubroute();
  }, [segments[1]]);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-sidebar px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 lg:px-4 xl:h-16 print:hidden">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem onClick={cleanSubroute}>
              <Link href={`/${segments[0]}`}>
                <BreadcrumbPage className="font-medium select-none">{section}</BreadcrumbPage>
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
      </div>
      <div className="flex gap-8">
        <AppPresence className="hidden select-none 2xl:flex" />
        <div className="flex gap-2">
          <Button
            size="icon-sm"
            variant="ghost"
            className={cn('cursor-pointer text-zinc-500 hover:bg-transparent! dark:text-zinc-400 dark:hover:text-white', showChatbot && 'text-black dark:text-white')}
            onClick={toggleChatbot}
          >
            <BotIcon className="size-6" />
          </Button>
          <NotificationsPopover />
          <HeaderThemeButton className="hidden lg:flex" />
        </div>
      </div>
    </header>
  );
}
