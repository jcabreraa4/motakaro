import type { MediaFile } from '@workspace/backend/schema';

import { MultimediaAudio, MultimediaFile, MultimediaImage, MultimediaVideo } from '@/components/multimedia/multimedia-render';
import { mediaType } from '@/utils/media-type';

export function MultimediaViewer({ file }: { file: MediaFile }) {
  const type = mediaType(file.type);

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-5xl">
        {type === 'image' ? (
          <MultimediaImage
            src={file.url!}
            width={file.width}
            height={file.height}
            className="max-h-[80vh] rounded-lg border"
          />
        ) : type === 'video' ? (
          <div className="relative overflow-hidden">
            <MultimediaVideo
              interact
              src={file.url!}
              width={file.width}
              height={file.height}
              className="max-h-[80vh] w-full rounded-lg border"
            />
          </div>
        ) : type === 'audio' ? (
          <div className="relative aspect-video overflow-hidden rounded-md border">
            <MultimediaAudio
              interact
              src={file.url!}
            />
          </div>
        ) : (
          <div className="relative h-[80vh] overflow-hidden rounded-md border">
            <MultimediaFile
              interact
              src={file.url!}
            />
          </div>
        )}
      </div>
    </section>
  );
}
