import { cn } from '@workspace/ui/lib/utils';

interface AppHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading1({ children, className }: AppHeadingProps) {
  return <h1 className={cn('text-3xl font-black lg:text-5xl', className)}>{children}</h1>;
}

export function Heading2({ children, className }: AppHeadingProps) {
  return <h2 className={cn('text-2xl font-bold lg:text-3xl', className)}>{children}</h2>;
}

export function Heading3({ children, className }: AppHeadingProps) {
  return <h3 className={cn('text-xl font-semibold lg:text-2xl', className)}>{children}</h3>;
}

export function Paragraph({ children, className }: AppHeadingProps) {
  return <p className={cn('text-lg font-medium', className)}>{children}</p>;
}
