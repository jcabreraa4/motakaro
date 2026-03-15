'use client';

import { useState } from 'react';
import { CopyIcon, DownloadIcon, ExpandIcon, LucideIcon, PenIcon, SaveIcon, StarIcon, TrashIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { MediaFile } from '@workspace/backend/schema';
import { copyText } from '@/utils/copy-text';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

interface SectionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  isActive?: boolean;
}

type UrlMediaFile = MediaFile & { url: string | null };

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

function UpdateDialog({ file }: { file: MediaFile }) {
  const [open, setOpen] = useState<boolean>(false);
  const [info, setInfo] = useState({ name: file.name, note: file.note });

  const deleteFile = useMutation(api.multimedia.remove);
  const updateFile = useMutation(api.multimedia.update);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <SectionButton
          onClick={() => {}}
          icon={PenIcon}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update File</DialogTitle>
          <DialogDescription>Change your file&apos;s information.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            value={info.note}
            className="h-20"
            onChange={(e) => setInfo({ ...info, note: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() =>
              updateFile({ id: file._id, name: info.name, note: info.note }).finally(() => {
                toast.success('File updated successfully.');
                setOpen(false);
              })
            }
          >
            <SaveIcon />
            Update File
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() =>
              deleteFile({ id: file._id }).finally(() => {
                toast.success('File deleted successfully.');
                setOpen(false);
              })
            }
          >
            <TrashIcon />
            Delete File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MediaToolbar({ file }: { file: UrlMediaFile }) {
  const router = useRouter();
  const updateFile = useMutation(api.multimedia.update);

  const sectionButtons = [
    {
      icon: StarIcon,
      onClick: () => updateFile({ id: file._id, starred: !file.starred }).finally(() => toast.success(file.starred ? 'File removed from starred successfully.' : 'File added to starred successfully.')),
      isActive: file.starred
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
      <UpdateDialog file={file} />
      <SectionButton
        icon={ExpandIcon}
        onClick={handleClick}
      />
    </div>
  );
}
