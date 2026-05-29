import { useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { BellIcon, CheckCheckIcon, ExternalLinkIcon, NavigationIcon, TriangleAlertIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import type { Notification } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

export function NotificationsTable({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();

  const updateNotification = useMutation(api.notifications.update);

  function handleLink(link: string) {
    if (link.startsWith('/')) {
      router.push(link);
    } else {
      window.open(link, '_blank');
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={cn('flex flex-col gap-3 rounded-md border bg-sidebar p-5', notification.starred && 'bg-primary text-white dark:text-black')}
        >
          <div className="flex h-9 items-center justify-between select-none">
            <div className="flex items-center gap-2">
              {notification.starred ? <TriangleAlertIcon className="text-yellow-500" /> : <BellIcon />}
              <p className="text-lg font-semibold">{format(new Date(notification._creationTime), 'MMM dd, yyyy · HH:mm')}</p>
            </div>
            <div className="flex gap-2">
              {notification.link && (
                <Button
                  variant={notification.starred ? 'secondary' : 'default'}
                  className={cn('cursor-pointer')}
                  onClick={() => handleLink(notification.link!)}
                >
                  {notification.link.startsWith('/') ? <NavigationIcon /> : <ExternalLinkIcon />}
                  <span className="hidden lg:flex">{notification.link.startsWith('/') ? 'Internal Link' : 'External Link'}</span>
                </Button>
              )}
              {!notification.read && (
                <Button
                  onClick={() => updateNotification({ id: notification._id, read: true })}
                  className={cn('cursor-pointer', notification.starred && 'bg-red-700 text-white hover:bg-red-700/85')}
                >
                  <CheckCheckIcon />
                  <span className="hidden lg:flex">Mark as Read</span>
                </Button>
              )}
            </div>
          </div>
          <Separator className={cn(notification.starred ? 'dark:bg-black' : 'bg-primary')} />
          <p className="text-lg font-semibold">{notification.name}</p>
          {notification.content && <p>{notification.content}</p>}
        </div>
      ))}
    </section>
  );
}
