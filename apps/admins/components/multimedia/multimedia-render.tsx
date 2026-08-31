import dynamic from 'next/dynamic';

import type { MediaFile } from '@workspace/backend/schema';
import { RenderAudio } from '@workspace/render/components/render-audio';
import { RenderImage } from '@workspace/render/components/render-image';
import { RenderVideo } from '@workspace/render/components/render-video';
import { extractType } from '@workspace/render/utils/extract-type';

const RenderIframe = dynamic(() => import('@workspace/render/components/render-iframe').then((m) => m.RenderIframe), { ssr: false });

export function MultimediaRender({ file }: { file: MediaFile }) {
  const type = extractType(file.type);

  return (
    <section className="relative h-full w-full overflow-hidden lg:rounded-md lg:border lg:p-5">
      {type === 'image' ? (
        <RenderImage src={file.url!} />
      ) : type === 'video' ? (
        <RenderVideo
          controls
          src={file.url!}
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
