'use client';

import type { Route } from 'next';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Fragment } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { NotificationsPopover } from '@/components/notifications/notifications-popover';
import { useHeader } from '@/hooks/use-header';
import { useLocation } from '@/hooks/use-location';

function HeaderBreadcrumb() {
  const { section } = useLocation();
  const { breadcrumbs } = useHeader();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href={`/${section}` as Route}>
            <BreadcrumbPage className="font-medium capitalize select-none">{section}</BreadcrumbPage>
          </Link>
        </BreadcrumbItem>
        {breadcrumbs.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator className="hidden lg:block" />
            <BreadcrumbItem className={cn('hidden select-none lg:block', item.href && 'cursor-pointer')}>
              {item.href ? (
                <Link href={item.href as Route}>
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

export function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className={className}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </Button>
  );
}

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-sidebar px-3 md:h-16 md:bg-transparent md:px-4 print:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
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
