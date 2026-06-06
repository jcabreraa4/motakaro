import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

export function HeaderButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className={cn('cursor-pointer bg-transparent! text-zinc-500 hover:bg-transparent! dark:text-zinc-400 dark:hover:text-white', className)}
      {...props}
    />
  );
}
