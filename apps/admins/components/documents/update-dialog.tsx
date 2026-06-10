import { useState } from 'react';

import { useMutation } from 'convex/react';
import { RotateCcwIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

interface UpdateDialogProps {
  document: Document;
  children: React.ReactNode;
}

export function UpdateDialog({ document, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: document.name, note: document.note, starred: document.starred.toString() });

  const updateDocument = useMutation(api.documents.update);

  function updateInfo() {
    updateDocument({ id: document._id, name: info.name, note: info.note, starred: info.starred === 'true' }).finally(() => {
      toast.success('Document updated successfully.');
      setOpen(false);
    });
  }

  function handleReset() {
    setInfo({ name: document.name, note: document.note, starred: document.starred.toString() });
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
          <SheetDescription className="md:hidden">Update document information.</SheetDescription>
          <SheetDescription className="hidden md:block">Update selected document&apos;s information.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4 lg:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled Document"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              className={cn(info.name !== document.name && 'border-red-500')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={info.note}
              onChange={(e) => setInfo({ ...info, note: e.target.value })}
              className={cn('h-20', info.note !== document.note && 'border-red-500')}
            />
          </div>
          <div className="hidden flex-col gap-2 xl:flex">
            <Label>Starred</Label>
            <Select
              value={info.starred}
              onValueChange={(value) => setInfo({ ...info, starred: value })}
            >
              <SelectTrigger className={cn('w-full cursor-pointer', info.starred !== document.starred.toString() && 'border-red-500')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleReset}
          >
            <RotateCcwIcon />
            Clear Changes
          </Button>
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
