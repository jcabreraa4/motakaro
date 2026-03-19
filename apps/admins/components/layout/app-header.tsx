'use client';

import { useEffect } from 'react';
import { usePathname } from '@/hooks/use-pathname';
import { useAppStateStore } from '@/store/state-store';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@workspace/ui/components/breadcrumb';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import { AppPresence } from '@/components/layout/app-presence';
import { Button } from '@workspace/ui/components/button';
import { BotIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

const chatbotPage = 'chatbots';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function AppHeader() {
  const { segments } = usePathname();
  const section = capitalize(segments[0]!);

  const showChatButton = segments[0] !== chatbotPage;

  const showChat = useAppStateStore((state) => state.showChat);
  const toggleChat = useAppStateStore((state) => state.toggleChat);

  const subroute = useAppStateStore((state) => state.subroute);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  function cleanSubroute() {
    setSubroute(null);
  }

  useEffect(() => {
    if (!segments[1]) cleanSubroute();
  });

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
                <BreadcrumbPage>{section}</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            {subroute && (
              <div className="pointer-events-none hidden items-center gap-2.5 select-none lg:flex">
                <BreadcrumbItem>
                  <ChevronRightIcon className="size-4 text-black dark:text-white" />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>{subroute}</BreadcrumbPage>
                </BreadcrumbItem>
              </div>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-5">
        <AppPresence className="hidden select-none 2xl:flex" />
        {showChatButton && (
          <Button
            variant={showChat ? 'default' : 'outline'}
            className="hidden cursor-pointer 2xl:block"
            onClick={toggleChat}
          >
            <BotIcon />
          </Button>
        )}
      </div>
    </header>
  );
}
