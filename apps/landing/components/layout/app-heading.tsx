import { cn } from '@workspace/ui/lib/utils';

interface AppHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading1({ children, className }: AppHeadingProps) {
  return <span className={cn('text-3xl font-extrabold lg:text-5xl', className)}>{children}</span>;
}

export function Heading2({ children, className }: AppHeadingProps) {
  return <span className={cn('text-2xl font-bold lg:text-3xl', className)}>{children}</span>;
}

export function Heading3({ children, className }: AppHeadingProps) {
  return <span className={cn('text-xl font-semibold lg:text-2xl', className)}>{children}</span>;
}

export function Paragraph({ children, className }: AppHeadingProps) {
  return <span className={cn('text-lg font-medium', className)}>{children}</span>;
}
