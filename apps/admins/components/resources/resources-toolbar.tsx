import { type LucideIcon, CopyIcon, ExpandIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { RemoveDialog } from '@/components/resources/remove-dialog';
import { UpdateDialog } from '@/components/resources/update-dialog';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Resource } from '@workspace/backend/schema';
import { copyText } from '@/utils/copy-text';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

interface SectionButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  isActive?: boolean;
}

function SectionButton({ onClick, icon: Icon, isActive }: SectionButtonProps) {
  const isMobile = useIsMobile();

  return (
    <Button
      onClick={onClick}
      size={isMobile ? 'icon' : 'default'}
      variant={isActive ? 'default' : 'outline'}
      className="cursor-pointer"
    >
      <Icon />
    </Button>
  );
}

export function ResourcesToolbar({ resource }: { resource: Resource }) {
  const router = useRouter();
  const updateFile = useMutation(api.resources.update);

  const sectionButtons = [
    {
      icon: StarIcon,
      onClick: () => updateFile({ id: resource._id, starred: !resource.starred }).finally(() => toast.success(resource.starred ? 'Resource removed from starred successfully.' : 'Resource added to starred successfully.')),
      isActive: resource.starred
    },
    {
      icon: CopyIcon,
      onClick: () => {
        if (!resource.link) {
          toast.error('The resource has no link available.');
          return;
        }
        copyText({ text: resource.link, type: 'link' });
      }
    }
  ];

  function handleClick() {
    if (!resource._id) return;
    router.push(`/resources/${resource._id}`);
  }

  return (
    <div className="flex gap-3">
      {sectionButtons.map((sectionButton, index) => (
        <SectionButton
          key={index}
          {...sectionButton}
        />
      ))}
      <UpdateDialog resource={resource}>
        <Button
          variant="outline"
          className="cursor-pointer"
        >
          <PenIcon />
        </Button>
      </UpdateDialog>
      <RemoveDialog id={resource._id}>
        <Button
          variant="outline"
          className="cursor-pointer"
        >
          <TrashIcon />
        </Button>
      </RemoveDialog>
      <SectionButton
        icon={ExpandIcon}
        onClick={handleClick}
      />
    </div>
  );
}
