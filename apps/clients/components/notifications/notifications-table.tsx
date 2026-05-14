import type { Notification } from '@workspace/backend/schema';
import { TriangleAlertIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

export function NotificationsTable({ notifications }: { notifications: Notification[] }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={cn('flex cursor-default flex-col gap-1 rounded-md border p-5', notification.starred ? 'bg-primary text-white dark:text-black' : 'bg-sidebar')}
        >
          <div className="flex items-center gap-2">
            {notification.starred && <TriangleAlertIcon className="text-yellow-500" />}
            <p className="text-lg font-semibold">{notification.name}</p>
          </div>
          <p>{notification.content}</p>
        </div>
      ))}
    </section>
  );
}
