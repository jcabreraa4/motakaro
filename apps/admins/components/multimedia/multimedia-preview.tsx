import { Thumbnail, ImageRender, VideoRender, AudioRender, OtherRender } from '@/components/multimedia/multimedia-render';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Id } from '@workspace/backend/_generated/dataModel';
import { mediaType } from '@/utils/media-type';
import { cn } from '@workspace/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { BanIcon } from 'lucide-react';

interface MultimediaPreviewProps {
  id?: Id<'multimedia'>;
  src: string;
  name?: string;
  type: string;
  interact?: boolean;
}

export function MultimediaPreview({ id, src, name, type, interact = false }: MultimediaPreviewProps) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const fileType = mediaType(type);

  function handleClick() {
    if (!id) return;
    router.push(`/multimedia/${id}`);
  }

  return (
    <div
      className={cn('relative aspect-video overflow-hidden rounded-md border border-black bg-black select-none dark:border-white', id && 'cursor-pointer')}
      onClick={handleClick}
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
