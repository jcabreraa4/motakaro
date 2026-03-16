import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteDialogProps {
  id: Id<'documents'>;
  redirect?: boolean;
  children: React.ReactNode;
}

export function RemoveDialog({ id, redirect = false, children }: DeleteDialogProps) {
  const router = useRouter();
  const deleteDocument = useMutation(api.documents.remove);

  function removeDocument() {
    deleteDocument({ id }).finally(() => {
      toast.success('Document removed successfully.');
      if (redirect) router.push('/documents');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Document</DialogTitle>
          <DialogDescription>Remove document from your account.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={removeDocument}
            >
              <TrashIcon />
              Remove Document
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
