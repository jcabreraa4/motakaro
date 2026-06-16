import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useMutation } from 'convex/react';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Carousel, CarouselContent, CarouselItem } from '@workspace/ui/components/carousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { FileDropzone } from '@workspace/ui/custom/file-dropzone';
import { cn } from '@workspace/ui/lib/utils';

import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';

const validTypes = ['image', 'video', 'pdf', 'audio'];

interface MultimediaUploadProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function MultimediaUpload({ onSuccess, children }: MultimediaUploadProps) {
  const uploadFile = useMutation(api.multimedia.sharedUpload);
  const createFile = useMutation(api.multimedia.clientCreate);

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
        const fileType = file.type;
        let width: number | undefined;
        let height: number | undefined;

        if (fileType.includes('image')) {
          await new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              width = img.naturalWidth;
              height = img.naturalHeight;
              resolve();
            };
          });
        } else if (fileType.includes('video')) {
          await new Promise<void>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              width = video.videoWidth;
              height = video.videoHeight;
              URL.revokeObjectURL(video.src);
              resolve();
            };
            video.src = URL.createObjectURL(file);
          });
        }

        const fetchUrl = await uploadFile();
        const response = await fetch(fetchUrl, { method: 'POST', headers: { 'Content-Type': fileType }, body: file });
        const { storageId } = await response.json();
        await createFile({ name: file.name, type: fileType, size: file.size, storageId, width, height });
      })
    );

    toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully.`);
    setFiles([]);
    setOpen(false);
    onSuccess?.();
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
                        interact={!loading}
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
                    className="flex-1 cursor-pointer"
                  >
                    <PlusIcon />
                    Upload {files.length} File{files.length > 1 ? 's' : ''}
                  </Button>
                )}
                <Button
                  onClick={() => setFiles([])}
                  className="flex-1 cursor-pointer"
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
