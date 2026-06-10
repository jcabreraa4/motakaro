import Link from 'next/link';

import { useMutation } from 'convex/react';
import { DownloadIcon, ExpandIcon, type LucideIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { MediaFile } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';

import { RemoveDialog } from '@/components/multimedia/remove-dialog';
import { UpdateDialog } from '@/components/multimedia/update-dialog';

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

export function MultimediaToolbar({ file }: { file: MediaFile }) {
  const updateFile = useMutation(api.multimedia.update);

  function toggleStarred() {
    updateFile({ id: file._id, starred: !file.starred }).finally(() => {
      toast.success(file.starred ? 'File removed from starred successfully.' : 'File added to starred successfully.');
    });
  }

  return (
    <div className="flex gap-3">
      <ToolbarButton
        icon={StarIcon}
        onClick={toggleStarred}
        isActive={file.starred}
      />
      <ToolbarButton
        icon={DownloadIcon}
        onClick={() => mediaDownload(file.url!, file.name)}
      />
      <UpdateDialog file={file}>
        <ToolbarButton icon={PenIcon} />
      </UpdateDialog>
      <RemoveDialog id={file._id}>
        <ToolbarButton icon={TrashIcon} />
      </RemoveDialog>
      <Link href={`/multimedia/${file._id}`}>
        <ToolbarButton icon={ExpandIcon} />
      </Link>
    </div>
  );
}
