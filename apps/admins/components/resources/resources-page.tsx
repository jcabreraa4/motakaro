'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { ListVideoIcon, TriangleAlertIcon, VideoOffIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { MultimediaThumbnail, MultimediaVideo } from '@/components/multimedia/multimedia-render';
import { useHeader } from '@/hooks/use-header';

interface ResourcesPageProps {
  preloaded: Preloaded<typeof api.resources.get>;
}

export function ResourcesPage({ preloaded }: ResourcesPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <ResourcesLoaded preloaded={preloaded} />;
}

function ResourcesLoaded({ preloaded }: ResourcesPageProps) {
  const { setBreadcrumbs } = useHeader();

  const resource = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (resource) setBreadcrumbs([{ text: resource.name || 'Untitled Resource' }]);
    return () => setBreadcrumbs([]);
  }, [resource, setBreadcrumbs]);

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
      <section className="flex w-full max-w-5xl flex-col justify-center md:px-5">
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
      </section>
    </main>
  );
}
