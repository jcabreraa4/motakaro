import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteDialogProps {
  id: Id<'documents'>;
  redirect?: boolean;
  children: React.ReactNode;
}

export function RemoveDialog({ id, redirect = false, children }: DeleteDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const removeDocument = useMutation(api.documents.remove);

  function handleDelete() {
    removeDocument({ id }).finally(() => {
      toast.success('Document removed successfully.');
      setOpen(false);
      if (redirect) router.push('/documents');
    });
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
          <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={handleDelete}
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
