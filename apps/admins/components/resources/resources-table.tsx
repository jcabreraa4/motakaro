import Link from 'next/link';

import { useMutation } from 'convex/react';
import { ExpandIcon, ExternalLinkIcon, LucideIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Resource } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { ResourcesInfo } from '@/components/resources/resources-info';
import { ResourcesPreview } from '@/components/resources/resources-preview';
import { ResourcesRemove } from '@/components/resources/resources-remove';
import { ResourcesUpdate } from '@/components/resources/resources-update';
import { useChatbot } from '@/hooks/use-chatbot';

interface ItemButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

function ItemButton({ icon: Icon, onClick, isActive }: ItemButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={isActive ? 'default' : 'outline'}
      className="cursor-pointer"
    >
      <Icon />
    </Button>
  );
}

function ResourcesItem({ resource }: { resource: Resource }) {
  const updateResource = useMutation(api.resources.update);

  function handleUpdate() {
    updateResource({ id: resource._id, starred: !resource.starred })
      .then(() => toast.success(resource.starred ? 'Resource unstarred successfully.' : 'Resource starred successfully.'))
      .catch(() => toast.error('An internal error has occurred.'));
  }

  function openLink() {
    if (resource.link) window.open(resource.link, '_blank');
    else toast.error('No video attached to this resource.');
  }

  return (
    <div className="flex flex-col gap-5">
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
      <div className="flex gap-3">
        <ItemButton
          icon={StarIcon}
          onClick={handleUpdate}
          isActive={resource.starred}
        />
        <ItemButton
          icon={ExternalLinkIcon}
          onClick={openLink}
        />
        <ResourcesUpdate resource={resource}>
          <ItemButton icon={PenIcon} />
        </ResourcesUpdate>
        <ResourcesRemove id={resource._id}>
          <ItemButton icon={TrashIcon} />
        </ResourcesRemove>
        <Link href={`/resources/${resource._id}`}>
          <ItemButton icon={ExpandIcon} />
        </Link>
      </div>
    </div>
  );
}

export function ResourcesTable({ resources }: { resources: Resource[] }) {
  const { chatbot } = useChatbot();

  const starredResources = resources.filter((file) => file.starred);
  const nonStarredResources = resources.filter((file) => !file.starred);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
      {starredResources.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', chatbot ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {starredResources.map((resource) => (
            <ResourcesItem
              key={resource._id}
              resource={resource}
            />
          ))}
        </div>
      )}
      {nonStarredResources.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', chatbot ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {nonStarredResources.map((resource) => (
            <ResourcesItem
              key={resource._id}
              resource={resource}
            />
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </section>
  );
}
