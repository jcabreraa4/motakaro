import dynamic from 'next/dynamic';

import { BanIcon } from 'lucide-react';

import { RenderAudio } from '@workspace/render/components/render-audio';
import { RenderImage } from '@workspace/render/components/render-image';
import { RenderPoster } from '@workspace/render/components/render-poster';
import { RenderVideo } from '@workspace/render/components/render-video';
import { cn } from '@workspace/ui/lib/utils';

import { mediaType } from '@/utils/media-type';

const RenderIframe = dynamic(() => import('@workspace/render/components/render-iframe').then((m) => m.RenderIframe), { ssr: false });

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
