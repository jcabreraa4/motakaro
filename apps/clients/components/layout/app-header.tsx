'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { HeaderThemeButton } from '@workspace/ui/custom/theme-buttons';

import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { usePathname } from '@/hooks/use-pathname';
import { useMainStore } from '@/store/main-store';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function AppHeader() {
  const { segments } = usePathname();
  const section = capitalize(segments[0]!);

  const subroute = useMainStore((state) => state.subroute);
  const setSubroute = useMainStore((state) => state.setSubroute);

  function cleanSubroute() {
    setSubroute(null);
  }

  useEffect(() => {
    if (!segments[1]) cleanSubroute();
  }, [segments[1]]);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-sidebar px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:bg-inherit lg:px-4 xl:h-16 print:hidden">
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
      <div className="flex gap-2">
        <NotificationsPopover />
        <HeaderThemeButton className="hidden lg:flex" />
      </div>
    </header>
  );
}
