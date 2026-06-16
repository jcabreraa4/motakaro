import { BanIcon } from 'lucide-react';

import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { cn } from '@workspace/ui/lib/utils';

import { MultimediaAudio, MultimediaFile, MultimediaImage, MultimediaThumbnail, MultimediaVideo } from '@/components/multimedia/multimedia-render';
import { mediaType } from '@/utils/media-type';

interface MultimediaPreviewProps {
  src: string;
  type: string;
  interact?: boolean;
  preview?: boolean;
  className?: string;
}

export function MultimediaPreview({ src, type, interact, preview, className }: MultimediaPreviewProps) {
  const isMobile = useIsMobile();
  const fileType = mediaType(type);

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md border select-none', className)}>
      {fileType === 'image' ? (
        <MultimediaImage
          fill
          src={src}
        />
      ) : fileType === 'video' ? (
        <MultimediaVideo
          src={src}
          preview={preview}
          interact={interact || isMobile}
        />
      ) : fileType === 'audio' ? (
        <MultimediaAudio
          src={src}
          interact={interact || isMobile}
        />
      ) : fileType === 'other' ? (
        <MultimediaFile
          src={src}
          interact={interact || isMobile}
        />
      ) : (
        <MultimediaThumbnail
          icon={BanIcon}
          text="Type not Allowed"
        />
      )}
    </div>
  );
}
