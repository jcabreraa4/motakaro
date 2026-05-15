import { type LucideIcon, CopyIcon, DownloadIcon, ExpandIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { UpdateDialog } from '@/components/multimedia/update-dialog';
import { RemoveDialog } from '@/components/multimedia/remove-dialog';
import type { MediaFile } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { copyText } from '@/utils/copy-text';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

async function mediaDownload(url: string, name: string) {
  const toastId = toast.loading('Preparing the download of the file...');
  try {
    const blob = await fetch(url).then((r) => r.blob());
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: name || 'download'
    });
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('The file is ready to be downloaded.', { id: toastId });
  } catch (error) {
    console.error('Download error:', error);
    toast.error('An error occurred downloading the file.', { id: toastId });
  }
}

interface SectionButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  isActive?: boolean;
}

function SectionButton({ onClick, icon: Icon, isActive }: SectionButtonProps) {
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

export function MultimediaToolbar({ file }: { file: MediaFile }) {
  const router = useRouter();
  const updateFile = useMutation(api.multimedia.clientsUpdate);

  const sectionButtons = [
    {
      icon: StarIcon,
      onClick: () => updateFile({ id: file._id, clientsStarred: !file.clientsStarred }).finally(() => toast.success(file.clientsStarred ? 'File removed from starred successfully.' : 'File added to starred successfully.')),
      isActive: file.clientsStarred
    },
    {
      icon: CopyIcon,
      onClick: () => copyText({ text: file.url!, type: 'link' })
    },
    {
      icon: DownloadIcon,
      onClick: () => mediaDownload(file.url!, file.name)
    }
  ];

  function handleClick() {
    if (!file._id) return;
    router.push(`/multimedia/${file._id}`);
  }

  return (
    <div className="flex gap-3">
      {sectionButtons.map((sectionButton, index) => (
        <SectionButton
          key={index}
          {...sectionButton}
        />
      ))}
      <UpdateDialog file={file}>
        <Button
          variant="outline"
          className="cursor-pointer"
        >
          <PenIcon />
        </Button>
      </UpdateDialog>
      <RemoveDialog id={file._id}>
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
