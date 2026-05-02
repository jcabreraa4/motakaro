'use client';

import { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@workspace/ui/components/popover';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@workspace/ui/components/breadcrumb';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import { usePathname } from '@/hooks/use-pathname';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function AppHeader() {
  const { segments } = usePathname();

  const [open, setOpen] = useState(false);

  const section = capitalize(segments[0]!);

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
            <BreadcrumbItem>
              <Link href={`/${segments[0]}`}>
                <BreadcrumbPage className="font-medium select-none">{section}</BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-2">
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              className={cn('cursor-pointer bg-transparent! text-zinc-500 hover:bg-transparent! dark:text-zinc-400 dark:hover:text-white', open && 'dark:text-white')}
            >
              <BellIcon className="size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 gap-0 p-0"
          >
            <PopoverHeader className="px-4 py-3">
              <PopoverTitle className="flex items-center justify-between select-none">
                Notifications
                <Link href="/notifications">
                  <Button
                    variant="link"
                    className="h-fit cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    View all
                  </Button>
                </Link>
              </PopoverTitle>
            </PopoverHeader>
            <Separator />
            <div className="max-h-90 px-4 py-5">
              <p className="leading-none font-medium">There are no new notifications!</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
