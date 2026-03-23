import { ResourcePreview } from '@/components/resources/resource-preview';
import { ResourceToolbar } from '@/components/resources/resource-toolbar';
import { ResourceInfo } from '@/components/resources/resource-info';
import { useAppStateStore } from '@/store/state-store';
import { Resource } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';

export function ResourcesTable({ resources }: { resources: Resource[] }) {
  const showChat = useAppStateStore((state) => state.showChat);

  const starredResources = resources.filter((file) => file.starred);
  const nonStarredResources = resources.filter((file) => !file.starred);

  return (
    <>
      {starredResources.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', showChat ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {starredResources.map((resource) => (
            <div
              key={resource._id}
              className="flex flex-col gap-5"
            >
              <ResourcePreview
                id={resource._id}
                src={resource.thumbnail}
                name={resource.name}
              />
              <ResourceInfo
                name={resource.name}
                published={resource.published}
              />
              <ResourceToolbar resource={resource} />
            </div>
          ))}
        </div>
      )}
      {nonStarredResources.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', showChat ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {nonStarredResources.map((resource) => (
            <div
              key={resource._id}
              className="flex flex-col gap-5"
            >
              <ResourcePreview
                id={resource._id}
                src={resource.thumbnail}
                name={resource.name}
              />
              <ResourceInfo
                name={resource.name}
                published={resource.published}
              />
              <ResourceToolbar resource={resource} />
            </div>
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </>
  );
}
