import { cn } from '@workspace/ui/lib/utils';

interface InsetSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function InsetSection({ children, className }: InsetSectionProps) {
  return <main className={cn('h-full w-full overflow-hidden p-3 md:p-5', className)}>{children}</main>;
}
