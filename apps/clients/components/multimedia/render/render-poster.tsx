import { type LucideIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

interface RenderPosterProps {
  icon?: LucideIcon;
  text?: string;
  className?: string;
}

export function RenderPoster({ icon: Icon, text, className }: RenderPosterProps) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center gap-2 bg-sidebar p-5 select-none', className)}>
      {Icon && <Icon className="min-h-8 min-w-8" />}
      {text && <p className="truncate text-xl font-semibold">{text}</p>}
    </div>
  );
}
