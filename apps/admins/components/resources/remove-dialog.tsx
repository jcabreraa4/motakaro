import { useState } from 'react';

import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';

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
          <DialogDescription className="md:hidden">This action cannot be undone.</DialogDescription>
          <DialogDescription className="hidden md:block">Are you sure? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
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
