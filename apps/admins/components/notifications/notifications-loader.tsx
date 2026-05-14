import { Skeleton } from '@workspace/ui/components/skeleton';

export function NotificationsLoader() {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-25 w-full border dark:border-none"
        />
      ))}
    </section>
  );
}
