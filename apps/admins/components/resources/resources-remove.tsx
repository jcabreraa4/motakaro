import { useState } from 'react';

import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';

interface ResourcesRemoveProps {
  id: Id<'resources'>;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function ResourcesRemove({ id, onSuccess, children }: ResourcesRemoveProps) {
  const removeResource = useMutation(api.resources.remove);

  const [open, setOpen] = useState(false);

  function handleRemove() {
    removeResource({ id })
      .then(() => {
        setOpen(false);
        toast.success('Resource deleted successfully.');
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
          <DialogTitle>Delete Resource</DialogTitle>
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
            Delete Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
