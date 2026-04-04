import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RemoveDialogProps {
  id: Id<'whiteboards'>;
  redirect?: boolean;
  children: React.ReactNode;
}

export function RemoveDialog({ id, redirect = false, children }: RemoveDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteWhiteboard = useMutation(api.whiteboards.remove);

  function removeWhiteboard() {
    deleteWhiteboard({ id }).finally(() => {
      toast.success('Whiteboard removed successfully.');
      setOpen(false);
      if (redirect) router.push('/whiteboards');
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
          <DialogTitle>Remove Whiteboard</DialogTitle>
          <DialogDescription>Remove whiteboard from your account.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={removeWhiteboard}
            >
              <TrashIcon />
              Remove Whiteboard
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
