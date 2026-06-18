'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Fragment } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { GhostIcon } from 'lucide-react';
import { MoonIcon, SunIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useChatbot } from '@/hooks/use-chatbot';
import { useHeader } from '@/hooks/use-header';
import { useLocation } from '@/hooks/use-location';

function HeaderBreadcrumb() {
  const { section } = useLocation();
  const { breadcrumbs } = useHeader();
  const { handleChatbot } = useChatbot();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href={`/${section}`}
            onClick={handleChatbot}
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
                  onClick={handleChatbot}
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

  const employees = useQuery(api.employees.list, isLoaded ? { filter: 'actives' } : 'skip');
  const filteredEmployees = employees?.filter((employee) => employee.clerkId !== userId);

  if (!filteredEmployees || filteredEmployees.length === 0) return null;

  return (
    <>
      <div className={cn('flex items-center gap-2', className)}>
        {filteredEmployees.map((employee) => (
          <Tooltip key={employee._id}>
            <TooltipTrigger asChild>
              <div className="relative cursor-default">
                <Avatar className="size-6">
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
      <Separator
        orientation="vertical"
        className={cn('ml-2 data-[orientation=vertical]:h-4', className)}
      />
    </>
  );
}

interface HeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function HeaderButton({ children, onClick, className }: HeaderButtonProps) {
  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className={cn('cursor-pointer bg-transparent! text-primary/85 hover:bg-transparent! dark:hover:text-white', className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ChatbotButton({ className }: { className?: string }) {
  const { chatbot, setChatbot } = useChatbot();

  return (
    <HeaderButton
      onClick={() => setChatbot(!chatbot)}
      className={cn(chatbot && 'text-black dark:text-white', className)}
    >
      <GhostIcon className="size-5" />
    </HeaderButton>
  );
}

export function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <HeaderButton
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={className}
    >
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </HeaderButton>
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
