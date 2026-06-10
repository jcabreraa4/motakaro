import { BanIcon } from 'lucide-react';

import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { cn } from '@workspace/ui/lib/utils';

import { AudioRender, ImageRender, OtherRender, Thumbnail, VideoRender } from '@/components/multimedia/multimedia-render';
import { mediaType } from '@/utils/media-type';

interface MultimediaPreviewProps {
  src: string;
  type: string;
  interact?: boolean;
  preview?: boolean;
  className?: string;
}

export function MultimediaPreview({ src, type, interact = false, preview = false, className }: MultimediaPreviewProps) {
  const isMobile = useIsMobile();
  const fileType = mediaType(type);

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md border select-none', className)}>
      {fileType === 'image' ? (
        <ImageRender
          fill
          src={src}
          alt="Image Preview"
          className="object-cover"
        />
      ) : fileType === 'video' ? (
        <VideoRender
          src={src}
          preview={preview}
          interact={interact || isMobile}
        />
      ) : fileType === 'audio' ? (
        <AudioRender
          src={src}
          interact={interact || isMobile}
        />
      ) : fileType === 'other' ? (
        <OtherRender
          src={src}
          interact={interact || isMobile}
        />
      ) : (
        <Thumbnail
          icon={BanIcon}
          text="Type not Allowed"
        />
      )}
    </div>
  );
}
