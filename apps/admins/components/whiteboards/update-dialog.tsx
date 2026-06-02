import { useState } from 'react';

import { useMutation } from 'convex/react';
import { RotateCcwIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

interface UpdateDialogProps {
  whiteboard: Whiteboard;
  children: React.ReactNode;
}

export function UpdateDialog({ whiteboard, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: whiteboard.name, note: whiteboard.note, starred: whiteboard.starred.toString() });

  const updateWhiteboard = useMutation(api.whiteboards.update);

  function updateInfo() {
    updateWhiteboard({ id: whiteboard._id, name: info.name, note: info.note, starred: info.starred === 'true' }).finally(() => {
      toast.success('Whiteboard updated successfully.');
      setOpen(false);
    });
  }

  function handleReset() {
    setInfo({ name: whiteboard.name, note: whiteboard.note, starred: whiteboard.starred.toString() });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Update Whiteboard</SheetTitle>
          <SheetDescription className="md:hidden">Update whiteboard information.</SheetDescription>
          <SheetDescription className="hidden md:block">Update selected whiteboard&apos;s information.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4 lg:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled Whiteboard"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              className={cn(whiteboard.name !== info.name && 'border-red-500')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={info.note}
              onChange={(e) => setInfo({ ...info, note: e.target.value })}
              className={cn('h-20', info.note !== whiteboard.note && 'border-red-500')}
            />
          </div>
          <div className="hidden flex-col gap-2 xl:flex">
            <Label>Starred</Label>
            <Select
              value={info.starred}
              onValueChange={(value) => setInfo({ ...info, starred: value })}
            >
              <SelectTrigger className={cn('w-full cursor-pointer', info.starred !== whiteboard.starred.toString() && 'border-red-500')}>
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
            Reset Changes
          </Button>
          <Button
            className="cursor-pointer"
            onClick={updateInfo}
          >
            <SaveIcon />
            Update Whiteboard
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
