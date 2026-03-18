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
  id: Id<'whiteboards'>;
  name: string;
  children: React.ReactNode;
}

export function UpdateDialog({ id, name, children }: UpdateDialogProps) {
  const [input, setInput] = useState(name);

  const updateWhiteboard = useMutation(api.whiteboards.update);

  function renameWhiteboard() {
    updateWhiteboard({ id, name: input }).finally(() => {
      toast.success('Whiteboard renamed successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Whiteboard</DialogTitle>
          <DialogDescription>Rename the selected whiteboard.</DialogDescription>
        </DialogHeader>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full cursor-pointer"
              onClick={renameWhiteboard}
            >
              <SaveIcon />
              Rename Whiteboard
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
