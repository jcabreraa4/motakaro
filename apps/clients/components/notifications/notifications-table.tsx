import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { BellIcon, CheckCheckIcon, TriangleAlertIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import type { Notification } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

export function NotificationsTable({ notifications }: { notifications: Notification[] }) {
  const updateNotification = useMutation(api.notifications.clientsUpdate);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={cn('flex flex-col gap-3 rounded-md border p-5', notification.starred ? 'bg-primary text-white dark:text-black' : 'bg-sidebar')}
        >
          <div className="flex h-9 items-center justify-between select-none">
            <div className="flex items-center gap-2">
              {notification.starred ? <TriangleAlertIcon className="text-yellow-500" /> : <BellIcon />}
              <p className="hidden text-lg font-semibold lg:flex">{format(new Date(notification._creationTime), 'MMM dd, yyyy · HH:mm')}</p>
              <p className="text-lg font-semibold lg:hidden">{format(new Date(notification._creationTime), 'MMM dd, yyyy')}</p>
            </div>
            {!notification.read && (
              <Button
                onClick={() => updateNotification({ id: notification._id, read: true })}
                className={cn('cursor-pointer', notification.starred && 'bg-red-700 text-white hover:bg-red-700/80')}
              >
                <CheckCheckIcon />
                Mark as Read
              </Button>
            )}
          </div>
          <Separator className={cn(notification.starred ? 'dark:bg-black' : 'bg-primary')} />
          <p className="text-lg font-semibold">{notification.name}</p>
          {notification.content && <p>{notification.content}</p>}
        </div>
      ))}
    </section>
  );
}
