import { ImageOffIcon, TriangleAlertIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

import { ImageRender, Thumbnail } from '@/components/multimedia/multimedia-render';

interface ResourcesPreviewProps {
  src: string;
  className?: string;
}

export function ResourcesPreview({ src, className }: ResourcesPreviewProps) {
  const invalidSrc = src && !src.startsWith('http') && !src.startsWith('/');

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md border select-none', className)}>
      {!src ? (
        <Thumbnail
          icon={ImageOffIcon}
          text="No Thumbnail"
        />
      ) : invalidSrc ? (
        <Thumbnail
          icon={TriangleAlertIcon}
          text="Invalid Thumbnail"
        />
      ) : (
        <ImageRender
          fill
          src={src}
          alt={'Resource Preview'}
          className="object-cover"
        />
      )}
    </div>
  );
}
