import Link from 'next/link';

import type { Resource } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';

import { ResourcesInfo } from '@/components/resources/resources-info';
import { ResourcesPreview } from '@/components/resources/resources-preview';
import { ResourcesToolbar } from '@/components/resources/resources-toolbar';
import { useLayout } from '@/hooks/use-layout';

export function ResourcesTable({ resources }: { resources: Resource[] }) {
  const { chatbot } = useLayout();

  const starredResources = resources.filter((file) => file.starred);
  const nonStarredResources = resources.filter((file) => !file.starred);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
      {starredResources.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', chatbot ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {starredResources.map((resource) => (
            <div
              key={resource._id}
              className="flex flex-col gap-5"
            >
              <Link href={`/resources/${resource._id}`}>
                <ResourcesPreview
                  src={resource.thumbnail}
                  className="cursor-pointer"
                />
              </Link>
              <ResourcesInfo
                name={resource.name}
                published={resource.published}
              />
              <ResourcesToolbar resource={resource} />
            </div>
          ))}
        </div>
      )}
      {nonStarredResources.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', chatbot ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {nonStarredResources.map((resource) => (
            <div
              key={resource._id}
              className="flex flex-col gap-5"
            >
              <Link href={`/resources/${resource._id}`}>
                <ResourcesPreview
                  src={resource.thumbnail}
                  className="cursor-pointer"
                />
              </Link>
              <ResourcesInfo
                name={resource.name}
                published={resource.published}
              />
              <ResourcesToolbar resource={resource} />
            </div>
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </section>
  );
}
