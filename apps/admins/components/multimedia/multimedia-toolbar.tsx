import { useRouter } from 'next/navigation';

import { DownloadIcon, PenIcon, TrashIcon } from 'lucide-react';

import type { MediaFile } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';

import { MultimediaRemove } from '@/components/multimedia/multimedia-remove';
import { MultimediaUpdate } from '@/components/multimedia/multimedia-update';

export function MultimediaToolbar({ file }: { file: MediaFile }) {
  const { push } = useRouter();

  return (
    <section className="flex gap-3">
      <MultimediaUpdate file={file}>
        <Button
          variant="outline"
          className="cursor-pointer"
        >
          <PenIcon />
          Update
        </Button>
      </MultimediaUpdate>
      <MultimediaRemove
        id={file._id}
        onSuccess={() => push('/multimedia')}
      >
        <Button
          variant="outline"
          className="cursor-pointer"
        >
          <TrashIcon />
          Delete
        </Button>
      </MultimediaRemove>
      <Button
        variant="outline"
        className="cursor-pointer"
      >
        <DownloadIcon />
        Download
      </Button>
    </section>
  );
}
