import dynamic from 'next/dynamic';

import type { MediaFile } from '@workspace/backend/schema';

import { RenderAudio } from '@/components/multimedia/render/render-audio';
import { RenderImage } from '@/components/multimedia/render/render-image';
import { RenderVideo } from '@/components/multimedia/render/render-video';
import { mediaType } from '@/utils/media-type';

const RenderIframe = dynamic(() => import('@/components/multimedia/render/render-iframe').then((m) => m.RenderIframe), { ssr: false });

export function MultimediaRender({ file }: { file: MediaFile }) {
  const type = mediaType(file.type);

  return (
    <section className="relative h-full w-full overflow-hidden lg:rounded-md lg:border lg:p-5">
      {type === 'image' ? (
        <RenderImage
          src={file.url!}
          width={file.width}
          height={file.height}
        />
      ) : type === 'video' ? (
        <RenderVideo
          controls
          src={file.url!}
          width={file.width}
          height={file.height}
        />
      ) : type === 'audio' ? (
        <RenderAudio
          controls
          src={file.url!}
        />
      ) : (
        <RenderIframe
          controls
          src={file.url!}
        />
      )}
    </section>
  );
}
