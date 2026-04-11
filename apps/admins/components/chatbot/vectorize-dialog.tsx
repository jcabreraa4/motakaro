import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { FileDropzone } from '@workspace/ui/custom/file-dropzone';
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { ButtonVariant } from '@workspace/ui/types/button';
import { Button } from '@workspace/ui/components/button';
import { useDropzone } from 'react-dropzone';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface VectorizeDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

const validTypes = ['pdf'];

export function VectorizeDialog({ variant = 'default', className }: VectorizeDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    disabled: loading,
    onDrop: (files) => {
      setFile(files[0]!);
    }
  });

  async function handleVectorize() {
    if (!file) return;
    try {
      setLoading(true);
      toast.success('The file was processed successfully.');
      setOpen(false);
      setFile(null);
    } catch {
      toast.error('The file could not be processed.');
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
          Vectorize File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vectorize File</DialogTitle>
          <DialogDescription>This will serve as knowledge for the AI assistant.</DialogDescription>
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
                Processing File...
              </Button>
            ) : (
              <>
                {validTypes.some((validType) => file?.type.includes(validType)) && (
                  <Button
                    onClick={handleVectorize}
                    className="flex-1 cursor-pointer"
                  >
                    <PlusIcon />
                    Vectorize File
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
