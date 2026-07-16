import type { LucideIcon } from 'lucide-react';

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { cn } from '@workspace/ui/lib/utils';

interface EmptySectionProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptySection({ icon: Icon, title, description, className, children }: EmptySectionProps) {
  return (
    <section className={cn('flex h-full w-full items-center justify-center select-none', className)}>
      <Empty>
        <EmptyHeader className="max-w-full">
          {Icon && (
            <EmptyMedia variant="icon">
              <Icon className="size-6" />
            </EmptyMedia>
          )}
          {title && <EmptyTitle className="text-xl">{title}</EmptyTitle>}
          {description && <EmptyDescription className="text-md hidden lg:block">{description}</EmptyDescription>}
        </EmptyHeader>
        {children && <EmptyContent>{children}</EmptyContent>}
      </Empty>
    </section>
  );
}
