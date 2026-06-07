'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { ThemeButton } from '@workspace/ui/custom/theme-button';

import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useHeader } from '@/hooks/use-header';
import { usePathname } from '@/hooks/use-pathname';

function HeaderBreadcrumb() {
  const { segments } = usePathname();
  const { subroute, setSubroute } = useHeader();

  useEffect(() => {
    if (!segments[1]) setSubroute(null);
  }, [segments[1]]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
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

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-x border-t bg-sidebar px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:h-16 md:rounded-t-md md:bg-white md:px-4 dark:bg-sidebar dark:md:bg-[#0A0A0A] print:hidden">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <HeaderBreadcrumb />
      </div>
      <div className="flex gap-2">
        <NotificationsPopover />
        <ThemeButton className="hidden md:flex" />
      </div>
    </header>
  );
}
