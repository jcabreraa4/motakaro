import { ClockAlertIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';
import type { Notification } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';

interface NotificationIconProps {
  type: Notification['type'];
  className?: string;
}

export function NotificationIcon({ type, className }: NotificationIconProps) {
  if (type === 'event') return <InfoIcon className={className} />;
  if (type === 'reminder') return <ClockAlertIcon className={className} />;
  if (type === 'warning') return <TriangleAlertIcon className={className} />;
}

export function NotificationsTable({ notifications }: { notifications: Notification[] }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={cn('flex flex-col border p-6 shadow-sm', notification.starred ? 'bg-primary text-white dark:text-black' : 'bg-sidebar')}
        >
          <div className="flex items-center gap-2">
            <NotificationIcon
              type={notification.type}
              className={cn(notification.starred && 'text-yellow-500')}
            />
            <p className="text-lg font-semibold">{notification.name}</p>
          </div>
          <p>{notification.content}</p>
        </div>
      ))}
    </section>
  );
}
