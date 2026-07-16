import { Spinner } from '@workspace/ui/components/spinner';
import { cn } from '@workspace/ui/lib/utils';

export function RenderLoader({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 z-20 flex items-center justify-center bg-white', className)}>
      <Spinner className="size-8" />
    </div>
  );
}
