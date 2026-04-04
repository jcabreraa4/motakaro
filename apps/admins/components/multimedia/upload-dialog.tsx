import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { FileDropzone } from '@workspace/ui/custom/file-dropzone';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { ButtonVariant } from '@workspace/ui/types/button';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useDropzone } from 'react-dropzone';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

const validTypes = ['image', 'video', 'pdf', 'audio'];

interface UploadDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

export function UploadDialog({ variant = 'default', className }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = useMutation(api.multimedia.upload);
  const createFile = useMutation(api.multimedia.create);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    disabled: loading,
    onDrop: (files) => {
      setFile(files[0]!);
    }
  });

  async function handleUpload() {
    if (!file) return;
    try {
      setLoading(true);
      const fileType = file.type;
      let width: number | undefined;
      let height: number | undefined;

      // Check for Width and Height
      if (fileType.includes('image')) {
        // Obtain Image Sizes
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
        // Obtain Video Sizes
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

      // Upload File
      const fetchUrl = await uploadFile();
      const response = await fetch(fetchUrl, { method: 'POST', headers: { 'Content-Type': fileType }, body: file });
      const { storageId } = await response.json();
      await createFile({ name: file.name, type: fileType, size: file.size, storageId: storageId, width, height });

      toast.success('The file was uploaded successfully.');
      setOpen(false);
      setFile(null);
    } catch {
      toast.error('The file could not be uploaded.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          <PlusIcon />
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
          <div className="flex flex-col gap-5 overflow-hidden">
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
        ) : (
          <FileDropzone
            isDragActive={isDragActive}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        )}
        {file && (
          <DialogFooter>
            {loading ? (
              <Button
                disabled
                variant="default"
                className="w-full"
              >
                <Loader2Icon className="animate-spin" />
                Uploading File...
              </Button>
            ) : (
              <>
                {validTypes.some((validType) => file?.type.includes(validType)) && (
                  <Button
                    onClick={handleUpload}
                    className="flex-1 cursor-pointer"
                  >
                    <PlusIcon />
                    Upload File
                  </Button>
                )}
                <Button
                  onClick={() => setFile(null)}
                  className="flex-1 cursor-pointer"
                >
                  <TrashIcon />
                  Remove File
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
