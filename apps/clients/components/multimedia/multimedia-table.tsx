import Link from 'next/link';

import { useMutation } from 'convex/react';
import { DownloadIcon, ExpandIcon, LucideIcon, PenIcon, StarIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { MediaFile } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';

import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { MultimediaRemove } from '@/components/multimedia/multimedia-remove';
import { MultimediaUpdate } from '@/components/multimedia/multimedia-update';
import { downloadFile } from '@/utils/download-file';

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

function MultimediaItem({ file }: { file: MediaFile }) {
  const updateFile = useMutation(api.multimedia.clientUpdate);

  function handleUpdate() {
    updateFile({ id: file._id, clientStarred: !file.clientStarred })
      .then(() => toast.success(file.clientStarred ? 'File unstarred successfully.' : 'File starred successfully.'))
      .catch(() => toast.error('An internal error has occurred.'));
  }

  return (
    <div
      key={file._id}
      className="flex flex-col gap-5"
    >
      <Link href={`/multimedia/${file._id}`}>
        <MultimediaPreview
          src={file.url!}
          type={file.type}
        />
      </Link>
      <MultimediaInfo
        name={file.name}
        size={file.size}
        type={file.type}
      />
      <div className="flex gap-3">
        <ItemButton
          icon={StarIcon}
          onClick={handleUpdate}
          isActive={file.clientStarred}
        />
        <ItemButton
          icon={DownloadIcon}
          onClick={() => downloadFile(file.url!, file.name)}
        />
        <MultimediaUpdate file={file}>
          <ItemButton icon={PenIcon} />
        </MultimediaUpdate>
        <MultimediaRemove id={file._id}>
          <ItemButton icon={TrashIcon} />
        </MultimediaRemove>
        <Link href={`/multimedia/${file._id}`}>
          <ItemButton icon={ExpandIcon} />
        </Link>
      </div>
    </div>
  );
}

export function MultimediaTable({ multimedia }: { multimedia: MediaFile[] }) {
  const starredFiles = multimedia.filter((file) => file.clientStarred);
  const nonStarredFiles = multimedia!.filter((file) => !file.clientStarred);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
      {starredFiles.length != 0 && (
        <div className="grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {starredFiles.map((file) => (
            <MultimediaItem
              key={file._id}
              file={file}
            />
          ))}
        </div>
      )}
      {nonStarredFiles.length != 0 && (
        <div className="grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {nonStarredFiles.map((file) => (
            <MultimediaItem
              key={file._id}
              file={file}
            />
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </section>
  );
}
