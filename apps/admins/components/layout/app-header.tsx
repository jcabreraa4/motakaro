'use client';

import { useEffect } from 'react';
import { usePathname } from '@/hooks/use-pathname';
import { useAppStateStore } from '@/store/state-store';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
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

  const showChat = useAppStateStore((state) => state.showChat);
  const toggleChat = useAppStateStore((state) => state.toggleChat);

  const subroute = useAppStateStore((state) => state.subroute);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

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
      <div className="flex items-center gap-8">
        <AppPresence className="hidden select-none 2xl:flex" />
        <Button
          size="icon-sm"
          variant="ghost"
          className="cursor-pointer text-zinc-400 hover:bg-transparent"
          onClick={toggleChat}
        >
          <BotIcon className={cn('size-6', showChat && 'text-black')} />
        </Button>
      </div>
    </header>
  );
}
