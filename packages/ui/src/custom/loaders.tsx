import { Spinner } from '@workspace/ui/components/spinner';
import { cn } from '@workspace/ui/lib/utils';

export function CircleLoader({ className }: { className?: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <Spinner className={cn('size-14', className)} />
    </div>
  );
}
