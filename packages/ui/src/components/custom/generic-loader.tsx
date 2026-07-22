import { Spinner } from '@workspace/ui/components/spinner';
import { cn } from '@workspace/ui/lib/utils';

export function GenericLoader({ className }: { className?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner className={cn('size-14', className)} />
    </div>
  );
}
