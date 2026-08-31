'use client';

import { useQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';

import { Heading2 } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { VideoDialog } from '@/components/ui/video-dialog';

function ResourcesTable({ children }: { children: React.ReactNode }) {
  return <div className="grid flex-1 grid-flow-row grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{children}</div>;
}

export default function Page() {
  const resources = useQuery(api.resources.list, { filter: 'published' });
  const filteredResources = resources?.filter((resource) => resource.embed.startsWith('http'));

  function openLink(link: string) {
    if (!link) return;
    window.open(link, '_blank');
  }

  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner className="flex flex-1">
        <SectionContent>
          <Heading2>Video Resources</Heading2>
        </SectionContent>
        <SectionContent className="flex flex-1">
          {resources ? (
            <ResourcesTable>
              {filteredResources?.map((resource) => (
                <div
                  key={resource._id}
                  className="flex flex-col gap-2"
                >
                  <VideoDialog
                    video={resource.embed}
                    thumbnail={resource.thumbnail?.startsWith('http') || resource.thumbnail?.startsWith('/') ? resource.thumbnail : '/header.webp'}
                  />
                  <p
                    className={cn(`truncate text-xl font-bold transition select-none xl:text-xl`, resource.link && 'cursor-pointer hover:underline')}
                    onClick={() => openLink(resource.link)}
                  >
                    {resource.name}
                  </p>
                </div>
              ))}
            </ResourcesTable>
          ) : (
            <ResourcesTable>
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2"
                >
                  <Skeleton className="aspect-video w-full border dark:border-none" />
                  <Skeleton className="h-9 w-full border dark:border-none" />
                </div>
              ))}
            </ResourcesTable>
          )}
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
