'use client';

import Link from 'next/link';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { AudioRender, ImageRender, OtherRender, VideoRender } from '@/components/multimedia/media-render';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { mediaType } from '@/utils/media-type';
import { FileTextIcon } from 'lucide-react';

export function MediaPage({ preloaded }: { preloaded: Preloaded<typeof api.multimedia.get> }) {
  const file = usePreloadedQuery(preloaded);

  if (!file)
    return (
      <main className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The file you are looking for could not be found.</p>
        </div>
        <Link href="/multimedia">
          <Button className="cursor-pointer">
            <FileTextIcon />
            Check Multimedia
          </Button>
        </Link>
      </main>
    );

  const type = mediaType(file.type);

  return (
    <main className="flex w-full flex-1 justify-center p-3 lg:p-5">
      <section className="flex w-full max-w-5xl flex-col justify-center gap-6 md:px-5">
        {type === 'image' ? (
          <ImageRender
            src={file.url}
            alt={file.name}
            width={file.width}
            height={file.height}
            className="mx-auto h-full border border-black"
          />
        ) : type === 'video' ? (
          <div className="relative aspect-video overflow-hidden rounded-md border border-black bg-black">
            <VideoRender
              interact
              src={file.url}
            />
          </div>
        ) : type === 'audio' ? (
          <div className="relative aspect-video overflow-hidden rounded-md border border-black bg-black">
            <AudioRender
              interact
              src={file.url}
            />
          </div>
        ) : (
          <div className="relative h-[80vh] overflow-hidden rounded-md border border-black bg-black">
            <OtherRender
              interact
              src={file.url}
            />
          </div>
        )}
      </section>
    </main>
  );
}
