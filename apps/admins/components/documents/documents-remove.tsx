import { useState } from 'react';

import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';

interface DocumentsRemoveProps {
  id: Id<'documents'>;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function DocumentsRemove({ id, onSuccess, children }: DocumentsRemoveProps) {
  const removeDocument = useMutation(api.documents.remove);

  const [open, setOpen] = useState(false);

  function handleRemove() {
    removeDocument({ id })
      .then(() => {
        setOpen(false);
        toast.success('Document deleted successfully.');
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
          <DialogTitle>Delete Document</DialogTitle>
          <DialogDescription className="md:hidden">This action cannot be undone.</DialogDescription>
          <DialogDescription className="hidden md:block">Are you sure? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={handleRemove}
            >
              <TrashIcon />
              Delete Document
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
