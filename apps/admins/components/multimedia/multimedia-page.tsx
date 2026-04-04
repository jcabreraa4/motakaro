'use client';

import { useEffect } from 'react';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { AudioRender, ImageRender, OtherRender, VideoRender } from '@/components/multimedia/multimedia-render';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useAppStateStore } from '@/store/state-store';
import { mediaType } from '@/utils/media-type';
import { FileTextIcon } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

interface MultimediaPageProps {
  preloaded: Preloaded<typeof api.multimedia.get>;
}

export function MultimediaPage({ preloaded }: MultimediaPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <CircleLoader />;
  return <MediaPageInner preloaded={preloaded} />;
}

function MediaPageInner({ preloaded }: MultimediaPageProps) {
  const file = usePreloadedQuery(preloaded);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  useEffect(() => {
    if (file) setSubroute(file.name);
  }, [file, setSubroute]);

  if (!file) {
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
  }

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
            className="max-h-[80vh] rounded-lg border border-black bg-black dark:border-white"
          />
        ) : type === 'video' ? (
          <div className="relative overflow-hidden">
            <VideoRender
              interact
              src={file.url}
              width={file.width}
              height={file.height}
              className="max-h-[80vh] w-full rounded-lg border border-black bg-black dark:border-white"
            />
          </div>
        ) : type === 'audio' ? (
          <div className="relative aspect-video overflow-hidden rounded-md border border-black bg-black dark:border-white">
            <AudioRender
              interact
              src={file.url}
            />
          </div>
        ) : (
          <div className="relative h-[80vh] overflow-hidden rounded-md border border-black bg-black dark:border-white">
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
