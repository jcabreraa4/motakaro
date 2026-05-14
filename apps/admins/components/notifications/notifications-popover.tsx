import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@workspace/ui/components/popover';
import { Separator } from '@workspace/ui/components/separator';
import { BellIcon, TriangleAlertIcon } from 'lucide-react';
import { Spinner } from '@workspace/ui/components/spinner';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

export function NotificationsPopover() {
  const { isLoaded } = useAuth();

  const [open, setOpen] = useState(false);

  const notifications = useQuery(api.notifications.list, isLoaded ? { limit: 8 } : 'skip');

  return (
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
        className="w-80 gap-0 rounded-lg p-0"
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
        {!notifications ? (
          <div className="flex items-center gap-2 p-4 select-none">
            <Spinner />
            <p className="animate-pulse">Loading notifications...</p>
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-4 select-none">
            <p>There are no notifications!</p>
          </div>
        ) : (
          <div className="flex max-h-77 min-h-0 flex-1 cursor-pointer flex-col overflow-y-auto rounded-b-lg select-none">
            {notifications?.map((notification) => (
              <Link
                key={notification._id}
                href={`/notifications?search=${notification._id}`}
              >
                <div
                  onClick={() => setOpen(false)}
                  className={cn('flex flex-col gap-1 border-t p-4', notification.starred ? 'bg-primary text-white hover:bg-primary/90 dark:text-black' : 'hover:bg-secondary')}
                >
                  <div className="flex items-center gap-2">
                    {notification.starred && <TriangleAlertIcon className="size-5 text-yellow-500" />}
                    <p className="truncate font-semibold">{notification.name}</p>
                  </div>
                  <p className="truncate">{notification.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
