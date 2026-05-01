import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RemoveDialogProps {
  id: Id<'resources'>;
  children: React.ReactNode;
}

export function RemoveDialog({ id, children }: RemoveDialogProps) {
  const [open, setOpen] = useState(false);

  const removeResource = useMutation(api.resources.remove);

  function handleDelete() {
    removeResource({ id }).finally(() => {
      toast.success('Resource deleted successfully.');
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="flex-1 cursor-pointer"
            onClick={handleDelete}
          >
            <TrashIcon />
            Delete Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
