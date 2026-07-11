import { cn } from '@workspace/ui/lib/utils';

interface AppSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ children, className }: AppSectionProps) {
  return <section className={cn('border-b lg:px-20', className)}>{children}</section>;
}

export function SectionInner({ children, className }: AppSectionProps) {
  return <div className={cn('mx-auto flex flex-col gap-6 py-5 lg:container lg:gap-8 lg:border-x lg:py-10', className)}>{children}</div>;
}

export function SectionContent({ children, className }: AppSectionProps) {
  return <div className={cn('px-3 lg:px-10', className)}>{children}</div>;
}
