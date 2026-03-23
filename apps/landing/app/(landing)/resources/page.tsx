'use client';

import { useQuery } from 'convex/react';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { VideoDialog } from '@workspace/ui/custom/video-dialog';
import { api } from '@workspace/backend/_generated/api';
import { cn } from '@workspace/ui/lib/utils';

export default function Page() {
  const resources = useQuery(api.resources.list, { filter: 'published' });
  const filteredResources = resources?.filter((resource) => resource.embed && resource.name);

  function openLink(link: string) {
    if (!link) return;
    window.open(link, '_blank');
  }

  if (!resources) return <CircleLoader />;

  return (
    <main className="container mx-auto flex flex-1 flex-col px-3 py-25 xl:px-5">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl font-black xl:text-5xl">Video Resources</h1>
        <div className="grid grid-flow-row grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredResources?.map((resource) => (
            <div
              key={resource._id}
              className="flex flex-col gap-2"
            >
              <VideoDialog
                videoSrc={resource.embed}
                thumbnailSrc={resource.thumbnail || '/header.webp'}
                thumbnailAlt={resource.name}
              />
              <p
                className={cn(`truncate text-xl font-bold transition select-none xl:text-xl`, resource.link && 'cursor-pointer hover:underline')}
                onClick={() => openLink(resource.link)}
              >
                {resource.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
