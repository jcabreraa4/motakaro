import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { BellIcon, TriangleAlertIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import type { Notification } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@workspace/ui/components/popover';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import { cn } from '@workspace/ui/lib/utils';

function NotificationsItem({ notification }: { notification: Notification }) {
  return (
    <div className={cn('relative flex h-20 cursor-pointer flex-col justify-between border-t p-4 hover:bg-secondary', notification.starred && 'bg-primary text-white hover:bg-primary/85 dark:text-black')}>
      {!notification.read && <span className="absolute top-2 right-2 size-2 rounded-full bg-red-600" />}
      <div className="flex items-center gap-2">
        {notification.starred && <TriangleAlertIcon className="size-5 min-w-5 text-yellow-500" />}
        <p className="truncate font-semibold">{notification.name}</p>
      </div>
      <p className="truncate">{notification.content}</p>
    </div>
  );
}

export function NotificationsPopover() {
  const { isLoaded } = useAuth();

  const [open, setOpen] = useState(false);

  const notifications = useQuery(api.notifications.list, isLoaded ? { limit: 8 } : 'skip');
  const hasUnread = notifications?.some((notification) => notification.read === false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn('relative cursor-pointer bg-transparent! text-primary/85 hover:bg-transparent! dark:hover:text-white', open && 'dark:text-white')}
        >
          <BellIcon className="size-5" />
          {hasUnread && <span className="absolute top-0 right-0 size-2 rounded-full bg-primary" />}
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
          <div className="flex max-h-80 min-h-0 flex-1 flex-col overflow-y-auto rounded-b-lg select-none">
            {notifications?.map((notification) => (
              <Link
                key={notification._id}
                onClick={() => setOpen(false)}
                href={`/notifications?search=${notification._id}`}
              >
                <NotificationsItem notification={notification} />
              </Link>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
