'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Fragment } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { GhostIcon, UserRoundIcon } from 'lucide-react';
import { MoonIcon, SunIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger, useSidebar } from '@workspace/ui/components/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { cn } from '@workspace/ui/lib/utils';

import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useChatbot } from '@/hooks/use-chatbot';
import { useHeader } from '@/hooks/use-header';
import { useLocation } from '@/hooks/use-location';

function HeaderBreadcrumb() {
  const { section } = useLocation();
  const { breadcrumbs } = useHeader();
  const { setOpen } = useChatbot();

  const isMobile = useIsMobile();

  function closeChatbotInMobile() {
    if (isMobile) setOpen(false);
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href={`/${section}`}
            onClick={closeChatbotInMobile}
          >
            <BreadcrumbPage className="font-medium capitalize select-none">{section}</BreadcrumbPage>
          </Link>
        </BreadcrumbItem>
        {breadcrumbs.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator className="hidden lg:block" />
            <BreadcrumbItem className={cn('hidden select-none lg:block', item.href && 'cursor-pointer')}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={closeChatbotInMobile}
                >
                  <BreadcrumbPage>{item.text}</BreadcrumbPage>
                </Link>
              ) : (
                <BreadcrumbPage>{item.text}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function UserPresence({ className }: { className?: string }) {
  const { userId, isLoaded } = useAuth();

  const admins = useQuery(api.admins.list, isLoaded ? { filter: 'actives' } : 'skip');
  const filteredAdmins = admins?.filter((admin) => admin.clerkId !== userId);

  if (!filteredAdmins || filteredAdmins.length === 0) return null;

  return (
    <>
      <div className={cn('flex items-center gap-2', className)}>
        {filteredAdmins.map((admin) => (
          <Tooltip key={admin._id}>
            <TooltipTrigger asChild>
              <Avatar size="sm">
                <AvatarImage
                  src={admin.avatar}
                  alt={admin.name}
                  className="overflow-hidden"
                />
                <AvatarFallback className="overflow-hidden">
                  <UserRoundIcon className="size-5" />
                </AvatarFallback>
                <AvatarBadge className="bg-green-600" />
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{`${admin.name} ${admin.surname}`}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <Separator
        orientation="vertical"
        className={cn('ml-2 data-[orientation=vertical]:h-4', className)}
      />
    </>
  );
}

function ChatbotButton({ className }: { className?: string }) {
  const { open, setOpen } = useChatbot();

  return (
    <Button
      size="icon-sm"
      variant={open ? 'secondary' : 'ghost'}
      className={cn('cursor-pointer', className)}
      onClick={() => setOpen(!open)}
    >
      <GhostIcon className="size-5" />
    </Button>
  );
}

export function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className={cn('cursor-pointer', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </Button>
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
      <div className="flex items-center gap-2">
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
