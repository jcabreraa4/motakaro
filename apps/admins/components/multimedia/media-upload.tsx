'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash, UploadCloud } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { MediaPreview } from '@/components/multimedia/media-preview';
import { ButtonVariant } from '@workspace/ui/types/button';
import { api } from '@workspace/backend/_generated/api';
import { sizeToText } from '@/utils/size-to-text';
import { cn } from '@workspace/ui/lib/utils';
import { toast } from 'sonner';

const validTypes = ['image', 'video', 'pdf', 'audio'];

interface MediaUploadProps {
  variant?: ButtonVariant;
  className?: string;
}

export function MediaUpload({ variant = 'default', className }: MediaUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateUrl = useMutation(api.multimedia.storage);
  const fileUpload = useMutation(api.multimedia.create);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    disabled: isLoading,
    onDrop: (files) => {
      const selectedFile = files[0];
      if (!selectedFile) return;
      setFile(selectedFile);
    }
  });

  async function uploadFile() {
    if (!file) return;
    try {
      setIsLoading(true);
      const fileType = file.type || 'application/octet-stream';
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
      const fetchUrl = await generateUrl();
      const response = await fetch(fetchUrl, { method: 'POST', headers: { 'Content-Type': fileType }, body: file });
      const { storageId } = await response.json();
      await fileUpload({ name: file.name, type: fileType, size: file.size, storageId: storageId, width, height });
      toast.success('The file was uploaded successfully.');
      setOpen(false);
      setFile(null);
    } catch {
      toast.error('The file could not be uploaded.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !isLoading) {
          setFile(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          <Plus />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription className="lg:hidden">Images, videos, audios or pdfs.</DialogDescription>
          <DialogDescription className="hidden lg:block">Upload images, videos, audios or pdfs.</DialogDescription>
        </DialogHeader>
        {file ? (
          <div className="space-y-4">
            <MediaPreview
              src={URL.createObjectURL(file)}
              type={file.type || 'application/octet-stream'}
              interact={!isLoading}
            />
            <div className="flex h-13 flex-col gap-1 overflow-hidden">
              <p className="truncate text-lg font-semibold">{file.name}</p>
              <p className="text-sm text-gray-500">{sizeToText(file.size)}</p>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps({ role: 'button', tabIndex: 0 })}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
          >
            <input
              {...getInputProps()}
              className="hidden"
              multiple={false}
            />
            <UploadCloud className="h-6 w-6 text-gray-500 dark:text-white/90" />
            <p className="text-sm text-gray-600 dark:text-white/90">Drag and drop, or click to select a file</p>
          </div>
        )}
        {file && (
          <DialogFooter>
            {isLoading ? (
              <Button
                variant="outline"
                className="w-full animate-pulse hover:bg-inherit"
              >
                Uploading...
              </Button>
            ) : (
              <div className="flex w-full flex-col gap-3">
                {validTypes.some((validType) => file?.type.includes(validType)) && (
                  <Button
                    onClick={uploadFile}
                    className="w-full cursor-pointer"
                  >
                    <Plus />
                    Upload File
                  </Button>
                )}
                <Button
                  onClick={() => setFile(null)}
                  className="w-full cursor-pointer"
                >
                  <Trash />
                  Delete File
                </Button>
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
