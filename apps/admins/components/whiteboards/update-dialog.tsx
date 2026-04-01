import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { useMutation } from 'convex/react';
import { SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';

interface UpdateDialogProps {
  id: Id<'whiteboards'>;
  name: string;
  note: string;
  children: React.ReactNode;
}

export function UpdateDialog({ id, name, note, children }: UpdateDialogProps) {
  const [info, setInfo] = useState({ name, note });

  const updateWhiteboard = useMutation(api.whiteboards.update);

  function updateInfo() {
    updateWhiteboard({ id, name: info.name, note: info.note }).finally(() => {
      toast.success('Whiteboard updated successfully.');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Whiteboard</DialogTitle>
          <DialogDescription>Update the selected whiteboard&apos;s information.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            className="h-20"
            value={info.note}
            onChange={(e) => setInfo({ ...info, note: e.target.value })}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full cursor-pointer"
              onClick={updateInfo}
            >
              <SaveIcon />
              Update Whiteboard
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
