import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { useMutation } from 'convex/react';
import { SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateDialogProps {
  document: Document;
  children: React.ReactNode;
}

export function UpdateDialog({ document, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: document.name, note: document.note });

  const updateDocument = useMutation(api.documents.update);

  function updateInfo() {
    updateDocument({ id: document._id, name: info.name, note: info.note }).finally(() => {
      toast.success('Document updated successfully.');
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
          <SheetTitle>Update Document</SheetTitle>
          <SheetDescription className="hidden lg:block">Update selected document&apos;s information.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4 lg:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled Document"
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
            onClick={updateInfo}
          >
            <SaveIcon />
            Update Document
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
