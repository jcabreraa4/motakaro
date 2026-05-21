import { useRouter } from 'next/navigation';

import { ImageOffIcon, TriangleAlertIcon } from 'lucide-react';

import type { Id } from '@workspace/backend/_generated/dataModel';
import { cn } from '@workspace/ui/lib/utils';

import { ImageRender, Thumbnail } from '@/components/multimedia/multimedia-render';

interface ResourcePreviewProps {
  id?: Id<'resources'>;
  src: string;
  name?: string;
}

export function ResourcesPreview({ id, src, name }: ResourcePreviewProps) {
  const router = useRouter();

  function handleClick() {
    if (!id) return;
    router.push(`/resources/${id}`);
  }

  const invalidSrc = src && !src.startsWith('http') && !src.startsWith('/');

  return (
    <div
      onClick={handleClick}
      className={cn('relative aspect-video overflow-hidden rounded-md border border-black bg-black select-none dark:border-white', id && 'cursor-pointer')}
    >
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
          alt={name || 'Image'}
          className="object-cover"
        />
      )}
    </div>
  );
}
