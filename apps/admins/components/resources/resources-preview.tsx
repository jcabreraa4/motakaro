import { ImageOffIcon, TriangleAlertIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

import { MultimediaImage, MultimediaThumbnail } from '@/components/multimedia/multimedia-render';

interface ResourcesPreviewProps {
  src: string;
  className?: string;
}

export function ResourcesPreview({ src, className }: ResourcesPreviewProps) {
  const invalidSrc = src && !src.startsWith('http') && !src.startsWith('/');

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md border select-none', className)}>
      {!src ? (
        <MultimediaThumbnail
          icon={ImageOffIcon}
          text="No Thumbnail"
        />
      ) : invalidSrc ? (
        <MultimediaThumbnail
          icon={TriangleAlertIcon}
          text="Invalid Thumbnail"
        />
      ) : (
        <MultimediaImage
          fill
          src={src}
        />
      )}
    </div>
  );
}
