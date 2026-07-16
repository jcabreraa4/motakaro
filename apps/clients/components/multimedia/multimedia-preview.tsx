import dynamic from 'next/dynamic';

import { BanIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

import { RenderAudio } from '@/components/multimedia/render/render-audio';
import { RenderImage } from '@/components/multimedia/render/render-image';
import { RenderPoster } from '@/components/multimedia/render/render-poster';
import { RenderVideo } from '@/components/multimedia/render/render-video';
import { mediaType } from '@/utils/media-type';

const RenderIframe = dynamic(() => import('@/components/multimedia/render/render-iframe').then((m) => m.RenderIframe), { ssr: false });

interface MultimediaPreviewProps {
  src: string;
  type: string;
  className?: string;
}

export function MultimediaPreview({ src, type, className }: MultimediaPreviewProps) {
  const fileType = mediaType(type);

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md border select-none', className)}>
      {fileType === 'image' ? (
        <RenderImage
          fill
          src={src}
        />
      ) : fileType === 'video' ? (
        <RenderVideo
          fill
          src={src}
        />
      ) : fileType === 'audio' ? (
        <RenderAudio
          fill
          src={src}
        />
      ) : fileType === 'other' ? (
        <RenderIframe src={src} />
      ) : (
        <RenderPoster
          icon={BanIcon}
          text="Unknown Type"
        />
      )}
    </div>
  );
}
