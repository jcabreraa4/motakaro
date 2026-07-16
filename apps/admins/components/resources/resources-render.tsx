import { TriangleAlertIcon, VideoOffIcon } from 'lucide-react';

import type { Resource } from '@workspace/backend/schema';

import { RenderPoster } from '@/components/multimedia/render/render-poster';

export function ResourcesRender({ resource }: { resource: Resource }) {
  const invalidEmbed = resource.embed && !resource.embed.startsWith('http');

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-5xl">
        {!resource.embed ? (
          <RenderPoster
            icon={VideoOffIcon}
            text="No Video Attached"
            className="aspect-video border"
          />
        ) : invalidEmbed ? (
          <RenderPoster
            icon={TriangleAlertIcon}
            text="Invalid Video Embed"
            className="aspect-video border"
          />
        ) : (
          <div className="relative">
            <iframe
              src={resource.embed}
              allowFullScreen
              title="Media Player"
              className="aspect-video h-full w-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        )}
      </div>
    </section>
  );
}
