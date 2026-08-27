import { ImageOffIcon, TriangleAlertIcon } from 'lucide-react';

import { RenderImage } from '@workspace/render/components/render-image';
import { RenderPoster } from '@workspace/render/components/render-poster';
import { cn } from '@workspace/ui/lib/utils';

interface ResourcesPreviewProps {
  src: string;
  className?: string;
}

export function ResourcesPreview({ src, className }: ResourcesPreviewProps) {
  const invalidSrc = src && !src.startsWith('http') && !src.startsWith('/');

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md border', className)}>
      {!src ? (
        <RenderPoster
          icon={ImageOffIcon}
          text="No Thumbnail"
        />
      ) : invalidSrc ? (
        <RenderPoster
          icon={TriangleAlertIcon}
          text="Invalid Thumbnail"
        />
      ) : (
        <RenderImage
          fill
          src={src}
        />
      )}
    </div>
  );
}
