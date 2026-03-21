'use client';

import { MediaDialog } from '@workspace/ui/custom/media-dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@workspace/ui/components/card';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { api } from '@workspace/backend/_generated/api';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';

export default function Page() {
  const resources = useQuery(api.resources.list);

  function openResource(link: string) {
    if (!link) return;
    window.open(link, '_blank');
  }

  if (!resources) return <CircleLoader />;

  return (
    <main className="container mx-auto flex flex-1 flex-col px-3 py-25 xl:px-5">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl font-black xl:text-5xl">Video Resources</h1>
        <div className="grid grid-flow-row grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {resources.map((resource) => (
            <Card
              key={resource._id}
              className="m-0 border-0 p-0 shadow-white"
            >
              <CardContent className="mx-0 px-0">
                <MediaDialog
                  videoSrc={resource.embed}
                  thumbnailSrc={resource.thumbnail || '/header.webp'}
                  thumbnailAlt={resource.name}
                />
              </CardContent>
              <CardHeader className="mx-0 px-0">
                <CardTitle
                  className={cn(`line-clamp-2 text-xl font-bold transition xl:text-xl`, resource.link && 'cursor-pointer hover:underline')}
                  onClick={() => openResource(resource.link)}
                >
                  {resource.name}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
