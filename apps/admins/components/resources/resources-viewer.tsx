import { TriangleAlertIcon, VideoOffIcon } from 'lucide-react';

import { Resource } from '@workspace/backend/schema';

import { MultimediaThumbnail, MultimediaVideo } from '@/components/multimedia/multimedia-render';

export function ResourcesViewer({ resource }: { resource: Resource }) {
  const invalidEmbed = resource.embed && !resource.embed.startsWith('http');

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-5xl">
        {!resource.embed ? (
          <MultimediaThumbnail
            icon={VideoOffIcon}
            text="No Video Attached"
            className="aspect-video border"
          />
        ) : invalidEmbed ? (
          <MultimediaThumbnail
            icon={TriangleAlertIcon}
            text="Invalid Video Embed"
            className="aspect-video border"
          />
        ) : (
          <div className="relative">
            <MultimediaVideo
              external
              src={resource.embed}
              className="aspect-video max-h-[80vh] w-full rounded-lg border"
            />
          </div>
        )}
      </div>
    </section>
  );
}
