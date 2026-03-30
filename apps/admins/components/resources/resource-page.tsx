'use client';

import { useEffect } from 'react';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Thumbnail, VideoRender } from '@/components/multimedia/media-render';
import { CircleAlertIcon, ListVideoIcon } from 'lucide-react';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useAppStateStore } from '@/store/state-store';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

interface ResourcePageProps {
  preloadedResource: Preloaded<typeof api.resources.get>;
}

export function ResourcePage({ preloadedResource }: ResourcePageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <CircleLoader />;
  return <ResourcePageInner preloadedResource={preloadedResource} />;
}

function ResourcePageInner({ preloadedResource }: ResourcePageProps) {
  const resource = usePreloadedQuery(preloadedResource);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  useEffect(() => {
    if (resource) setSubroute(resource.name);
  }, [resource, setSubroute]);

  if (!resource) {
    return (
      <main className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The resource you are looking for could not be found.</p>
        </div>
        <Link href="/multimedia">
          <Button className="cursor-pointer">
            <ListVideoIcon />
            Check Resources
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 justify-center p-3 lg:p-5">
      <section className="flex w-full max-w-5xl flex-col justify-center gap-6 md:px-5">
        {resource.embed ? (
          <div className="relative">
            <VideoRender
              external
              src={resource.embed}
              className="aspect-video max-h-[80vh] w-full rounded-lg border border-black bg-black dark:border-white"
            />
          </div>
        ) : (
          <Thumbnail
            icon={CircleAlertIcon}
            text="No Video Linked"
            className="aspect-video border border-black dark:border-white"
          />
        )}
      </section>
    </main>
  );
}
