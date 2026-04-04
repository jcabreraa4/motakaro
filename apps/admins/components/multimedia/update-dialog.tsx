import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Textarea } from '@workspace/ui/components/textarea';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { useMutation } from 'convex/react';
import { SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateDialogProps {
  id: Id<'multimedia'>;
  name: string;
  note: string;
  children: React.ReactNode;
}

export function UpdateDialog({ id, name, note, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name, note });

  const updateFile = useMutation(api.multimedia.update);

  function handleUpdate() {
    updateFile({ id, name: info.name, note: info.note }).finally(() => {
      toast.success('File updated successfully.');
      setOpen(false);
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
          <DialogTitle>Update File</DialogTitle>
          <DialogDescription>Update the selected file&apos;s information.</DialogDescription>
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
          <Button
            className="flex-1 cursor-pointer"
            onClick={handleUpdate}
          >
            <SaveIcon />
            Update File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
