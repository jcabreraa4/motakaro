'use client';

import { BanIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AudioRender, ImageRender, OtherRender, VideoRender } from '@/components/multimedia/media-render';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Id } from '@workspace/backend/_generated/dataModel';
import { mediaType } from '@/utils/media-type';
import { cn } from '@workspace/ui/lib/utils';

interface MediaPreviewProps {
  id?: Id<'multimedia'>;
  src: string;
  name?: string;
  type: string;
  interact?: boolean;
}

export function MediaPreview({ id, src, name, type, interact = false }: MediaPreviewProps) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const fileType = mediaType(type);

  function handleClick() {
    if (!id) return;
    router.push(`/multimedia/${id}`);
  }

  return (
    <div
      className={cn('relative aspect-video overflow-hidden rounded-md border border-black bg-black select-none', id && 'cursor-pointer')}
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
        <div className="flex aspect-video items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-100 dark:text-black">
          <BanIcon className="size-6 lg:size-8" />
          <p className="text-lg font-semibold lg:text-2xl">Type not Allowed</p>
        </div>
      )}
    </div>
  );
}
