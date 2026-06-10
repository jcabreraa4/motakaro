import Link from 'next/link';

import { useMutation } from 'convex/react';
import { ExpandIcon, ExternalLinkIcon, type LucideIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Resource } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';

import { RemoveDialog } from '@/components/resources/remove-dialog';
import { UpdateDialog } from '@/components/resources/update-dialog';

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

  function toggleStarred() {
    updateResource({ id: resource._id, starred: !resource.starred }).finally(() => {
      toast.success(resource.starred ? 'File removed from starred successfully.' : 'File added to starred successfully.');
    });
  }

  function openLink() {
    if (!resource.link) {
      toast.error('No video attached to this resource.');
      return;
    }
    window.open(resource.link, '_blank');
  }

  return (
    <div className="flex gap-3">
      <ToolbarButton
        icon={StarIcon}
        onClick={toggleStarred}
        isActive={resource.starred}
      />
      <ToolbarButton
        icon={ExternalLinkIcon}
        onClick={openLink}
      />
      <UpdateDialog resource={resource}>
        <ToolbarButton icon={PenIcon} />
      </UpdateDialog>
      <RemoveDialog id={resource._id}>
        <ToolbarButton icon={TrashIcon} />
      </RemoveDialog>
      <Link href={`/resources/${resource._id}`}>
        <ToolbarButton icon={ExpandIcon} />
      </Link>
    </div>
  );
}
