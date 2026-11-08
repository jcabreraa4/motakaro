import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useUploadFile } from '@convex-dev/r2/react';
import { useMutation } from 'convex/react';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Carousel, CarouselContent, CarouselItem } from '@workspace/ui/components/carousel';
import { FileDropzone } from '@workspace/ui/components/custom/file-dropzone';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { cn } from '@workspace/ui/lib/utils';

import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';

const validTypes = ['image', 'video', 'pdf', 'audio'];

interface MultimediaUploadProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function MultimediaUpload({ onSuccess, children }: MultimediaUploadProps) {
  const createFile = useMutation(api.multimedia.clientCreate);
  const uploadPublic = useUploadFile({
    generateUploadUrl: api.multimedia.sharedPublicUpload,
    syncMetadata: api.multimedia.sharedPublicSync
  });

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    disabled: loading,
    onDrop: (dropped) => setFiles((prev) => [...prev, ...dropped])
  });

  async function handleUpload() {
    setLoading(true);
    await Promise.all(
      files.map(async (file) => {
        const key = await uploadPublic(file);
        await createFile({ name: file.name, key, bucket: 'public', type: file.type, size: file.size });
      })
    )
      .then(() => {
        toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully.`);
        setFiles([]);
        setOpen(false);
        onSuccess?.();
      })
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  const validFiles = files.filter((f) => validTypes.some((t) => f.type.includes(t)));
  const canUpload = validFiles.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription className="lg:hidden">Images, videos, audios or pdfs.</DialogDescription>
          <DialogDescription className="hidden lg:block">Upload images, videos, audios or pdfs.</DialogDescription>
        </DialogHeader>
        {files.length !== 0 && (
          <div className={cn('cursor-pointer overflow-hidden', files.length === 1 && 'pointer-events-none')}>
            <Carousel>
              <CarouselContent>
                {files.map((file, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col gap-5">
                      <MultimediaPreview
                        src={URL.createObjectURL(file)}
                        type={file.type}
                      />
                      <MultimediaInfo
                        name={file.name}
                        size={file.size}
                        type={file.type}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
        <FileDropzone
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          className={cn(files.length !== 0 && 'hidden')}
        />
        {files.length !== 0 && (
          <DialogFooter className="flex-row">
            {loading ? (
              <Button
                disabled
                variant="default"
                className="w-full"
              >
                <Loader2Icon className="animate-spin" />
                Uploading...
              </Button>
            ) : (
              <>
                {canUpload && (
                  <Button
                    onClick={handleUpload}
                    className="flex-1"
                  >
                    <PlusIcon />
                    Upload {files.length} File{files.length > 1 ? 's' : ''}
                  </Button>
                )}
                <Button
                  onClick={() => setFiles([])}
                  className="flex-1"
                >
                  <TrashIcon />
                  Remove All
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
