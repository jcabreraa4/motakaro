import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { useMutation } from 'convex/react';
import { SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateDialogProps {
  id: Id<'documents'>;
  title: string;
  children: React.ReactNode;
}

export function UpdateDialog({ id, title, children }: UpdateDialogProps) {
  const [input, setInput] = useState(title);

  const updateDocument = useMutation(api.documents.update);

  function renameDocument() {
    updateDocument({ id, name: input }).finally(() => {
      toast.success('Document renamed successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Document</DialogTitle>
          <DialogDescription>Rename the selected document.</DialogDescription>
        </DialogHeader>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full cursor-pointer"
              onClick={renameDocument}
            >
              <SaveIcon />
              Rename Document
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
