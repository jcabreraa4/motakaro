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

export function SectionTitle({ children, className }: AppSectionProps) {
  return <h2 className={cn('text-3xl font-black select-none lg:text-4xl', className)}>{children}</h2>;
}

export function SectionSubtitle({ children, className }: AppSectionProps) {
  return <h3 className={cn('text-xl font-semibold select-none lg:text-2xl', className)}>{children}</h3>;
}
