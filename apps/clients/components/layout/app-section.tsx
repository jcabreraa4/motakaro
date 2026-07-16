import { cn } from '@workspace/ui/lib/utils';

interface AppSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AppSection({ children, className }: AppSectionProps) {
  return <main className={cn('h-full w-full overflow-hidden p-3 md:p-5', className)}>{children}</main>;
}
