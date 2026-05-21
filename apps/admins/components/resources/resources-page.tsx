'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { ListVideoIcon, TriangleAlertIcon, VideoOffIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { CircleLoader } from '@workspace/ui/custom/loaders';

import { Thumbnail, VideoRender } from '@/components/multimedia/multimedia-render';
import { useMainStore } from '@/store/main-store';

interface ResourcePageProps {
  preloaded: Preloaded<typeof api.resources.get>;
}

export function ResourcePage({ preloaded }: ResourcePageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <CircleLoader />;
  return <ResourcePageInner preloaded={preloaded} />;
}

function ResourcePageInner({ preloaded }: ResourcePageProps) {
  const resource = usePreloadedQuery(preloaded);
  const setSubroute = useMainStore((state) => state.setSubroute);

  useEffect(() => {
    if (resource) setSubroute(resource.name);
  }, [resource, setSubroute]);

  if (!resource) {
    return (
      <main className="flex w-full flex-col items-center justify-center gap-5 select-none">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The resource you are looking for could not be found.</p>
        </div>
        <Link href="/resources">
          <Button className="cursor-pointer">
            <ListVideoIcon />
            Check Resources
          </Button>
        </Link>
      </main>
    );
  }

  const invalidEmbed = resource.embed && !resource.embed.startsWith('http');

  return (
    <main className="flex w-full flex-1 justify-center p-3 lg:p-5">
      <section className="flex w-full max-w-5xl flex-col justify-center gap-6 md:px-5">
        {!resource.embed ? (
          <Thumbnail
            icon={VideoOffIcon}
            text="No Video Attached"
            className="aspect-video border border-black dark:border-white"
          />
        ) : invalidEmbed ? (
          <Thumbnail
            icon={TriangleAlertIcon}
            text="Invalid Video Embed"
            className="aspect-video border border-black dark:border-white"
          />
        ) : (
          <div className="relative">
            <VideoRender
              external
              src={resource.embed}
              className="aspect-video max-h-[80vh] w-full rounded-lg border border-black bg-black dark:border-white"
            />
          </div>
        )}
      </section>
    </main>
  );
}
