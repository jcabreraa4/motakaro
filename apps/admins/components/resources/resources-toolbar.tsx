import Link from 'next/link';

import { useMutation } from 'convex/react';
import { ExpandIcon, ExternalLinkIcon, type LucideIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Resource } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';

import { ResourcesRemove } from '@/components/resources/resources-remove';
import { ResourcesUpdate } from '@/components/resources/resources-update';

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

function ToolbarButton({ icon: Icon, onClick, isActive }: ToolbarButtonProps) {
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

export function ResourcesToolbar({ resource }: { resource: Resource }) {
  const updateResource = useMutation(api.resources.update);

  function handleUpdate() {
    updateResource({ id: resource._id, starred: !resource.starred })
      .then(() => toast.success(resource.starred ? 'Resource starred successfully.' : 'Resource unstarred successfully.'))
      .catch(() => toast.error('An internal error has occurred.'));
  }

  function openLink() {
    if (resource.link) window.open(resource.link, '_blank');
    else toast.error('No video attached to this resource.');
  }

  return (
    <div className="flex gap-3">
      <ToolbarButton
        icon={StarIcon}
        onClick={handleUpdate}
        isActive={resource.starred}
      />
      <ToolbarButton
        icon={ExternalLinkIcon}
        onClick={openLink}
      />
      <ResourcesUpdate resource={resource}>
        <ToolbarButton icon={PenIcon} />
      </ResourcesUpdate>
      <ResourcesRemove id={resource._id}>
        <ToolbarButton icon={TrashIcon} />
      </ResourcesRemove>
      <Link href={`/resources/${resource._id}`}>
        <ToolbarButton icon={ExpandIcon} />
      </Link>
    </div>
  );
}
