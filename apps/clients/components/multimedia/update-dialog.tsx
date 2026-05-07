import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { MediaFile } from '@workspace/backend/schema';
import { useMutation } from 'convex/react';
import { SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateDialogProps {
  file: MediaFile;
  children: React.ReactNode;
}

export function UpdateDialog({ file, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: file.name, note: file.note });

  const updateFile = useMutation(api.multimedia.clientsUpdate);

  function handleUpdate() {
    updateFile({ id: file._id, name: info.name, note: info.note }).finally(() => {
      toast.success('File updated successfully.');
      setOpen(false);
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Update File</SheetTitle>
          <SheetDescription className="hidden lg:block">Update selected file&apos;s information.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4 lg:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled File"
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
        </div>
        <SheetFooter>
          <Button
            className="cursor-pointer"
            onClick={handleUpdate}
          >
            <SaveIcon />
            Update File
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
