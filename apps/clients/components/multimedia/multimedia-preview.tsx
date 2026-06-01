import { useRouter } from 'next/navigation';

import { BanIcon } from 'lucide-react';

import type { Id } from '@workspace/backend/_generated/dataModel';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { cn } from '@workspace/ui/lib/utils';

import { AudioRender, ImageRender, OtherRender, Thumbnail, VideoRender } from '@/components/multimedia/multimedia-render';
import { mediaType } from '@/utils/media-type';

interface MultimediaPreviewProps {
  id?: Id<'multimedia'>;
  src: string;
  name?: string;
  type: string;
  interact?: boolean;
  preview?: boolean;
}

export function MultimediaPreview({ id, src, name, type, interact = false, preview = false }: MultimediaPreviewProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const fileType = mediaType(type);

  function openFile() {
    if (!id) return;
    router.push(`/multimedia/${id}`);
  }

  return (
    <div
      className={cn('relative aspect-video overflow-hidden rounded-md border border-black bg-black select-none dark:border-white', id && 'cursor-pointer')}
      onClick={openFile}
    >
      {fileType === 'image' ? (
        <ImageRender
          fill
          src={src}
          alt={name || 'Image'}
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
