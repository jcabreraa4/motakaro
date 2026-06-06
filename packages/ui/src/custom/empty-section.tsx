import type { LucideIcon } from 'lucide-react';

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';

interface EmptySectionProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptySection({ icon: Icon, title, description, children }: EmptySectionProps) {
  return (
    <section className="flex min-h-0 flex-1 items-center justify-center select-none">
      <Empty>
        <EmptyHeader>
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
