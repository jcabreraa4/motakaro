import { useState } from 'react';

import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';

interface MultimediaRemoveProps {
  id: Id<'multimedia'>;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function MultimediaRemove({ id, onSuccess, children }: MultimediaRemoveProps) {
  const removeFile = useMutation(api.multimedia.remove);

  const [open, setOpen] = useState(false);

  function handleRemove() {
    removeFile({ id })
      .then(() => {
        setOpen(false);
        toast.success('File deleted successfully.');
        onSuccess?.();
      })
      .catch(() => toast.error('An internal error has occurred.'));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription className="md:hidden">This action cannot be undone.</DialogDescription>
          <DialogDescription className="hidden md:block">Are you sure? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={handleRemove}
          >
            <TrashIcon />
            Delete File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
