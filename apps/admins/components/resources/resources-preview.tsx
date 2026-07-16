import { ImageOffIcon, TriangleAlertIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

import { RenderImage } from '@/components/multimedia/render/render-image';
import { RenderPoster } from '@/components/multimedia/render/render-poster';

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
