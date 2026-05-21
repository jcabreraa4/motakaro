import { useState } from 'react';

import { useMutation } from 'convex/react';
import { LinkIcon, RotateCcwIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { MediaFile } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { Label } from '@workspace/ui/components/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

import { copyText } from '@/utils/copy-text';

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

  function handleReset() {
    setInfo({ name: file.name, note: file.note });
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
          <InputGroup onClick={() => copyText({ text: file.url!, type: 'link' })}>
            <InputGroupInput
              readOnly
              value={file.url!}
              className="cursor-pointer"
            />
            <InputGroupAddon className="cursor-pointer">
              <LinkIcon />
            </InputGroupAddon>
          </InputGroup>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled File"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              className={cn(info.name !== file.name && 'border-red-500')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={info.note}
              onChange={(e) => setInfo({ ...info, note: e.target.value })}
              className={cn('h-20', info.note !== file.note && 'border-red-500')}
            />
          </div>
        </div>
        <SheetFooter className="gap-3">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleReset}
          >
            <RotateCcwIcon />
            Reset Changes
          </Button>
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
