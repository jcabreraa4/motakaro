import { GlobeIcon, GlobeOffIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

interface ResourceInfoProps {
  name: string;
  published: boolean;
  className?: string;
}

export function ResourcesInfo({ name, published, className }: ResourceInfoProps) {
  return (
    <div className={cn('flex h-13 flex-col gap-1 overflow-hidden', className)}>
      <div className="flex items-center">
        <div className="min-w-8">{published ? <GlobeIcon /> : <GlobeOffIcon />}</div>
        <p className="truncate text-lg font-semibold">{name || 'Untitled Resource'}</p>
      </div>
      <p className="truncate text-sm text-gray-500">{published ? 'Already Published' : 'Not Published'}</p>
    </div>
  );
}
