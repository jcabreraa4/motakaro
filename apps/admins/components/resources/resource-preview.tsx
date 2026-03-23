'use client';

import { useRouter } from 'next/navigation';
import { CircleAlertIcon } from 'lucide-react';
import { ImageRender, Thumbnail } from '@/components/multimedia/media-render';
import { Id } from '@workspace/backend/_generated/dataModel';
import { cn } from '@workspace/ui/lib/utils';

interface ResourcePreviewProps {
  id?: Id<'resources'>;
  src: string;
  name?: string;
}

export function ResourcePreview({ id, src, name }: ResourcePreviewProps) {
  const router = useRouter();

  function handleClick() {
    if (!id) return;
    router.push(`/resources/${id}`);
  }

  return (
    <div
      className={cn('relative aspect-video overflow-hidden rounded-md border border-black bg-black select-none dark:border-white', id && 'cursor-pointer')}
      onClick={handleClick}
    >
      {src ? (
        <ImageRender
          fill
          src={src}
          alt={name || 'Image'}
          className="object-cover"
        />
      ) : (
        <Thumbnail
          icon={CircleAlertIcon}
          text="No Thumbnail"
        />
      )}
    </div>
  );
}
