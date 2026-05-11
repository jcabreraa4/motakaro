import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { RotateCcwIcon, SaveIcon } from 'lucide-react';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateDialogProps {
  whiteboard: Whiteboard;
  children: React.ReactNode;
}

export function UpdateDialog({ whiteboard, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: whiteboard.name, note: whiteboard.note });

  const updateWhiteboard = useMutation(api.whiteboards.update);

  function updateInfo() {
    updateWhiteboard({ id: whiteboard._id, name: info.name, note: info.note }).finally(() => {
      toast.success('Whiteboard updated successfully.');
      setOpen(false);
    });
  }

  function handleReset() {
    setInfo({ name: whiteboard.name, note: whiteboard.note });
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
          <SheetDescription className="hidden lg:block">Update selected whiteboard&apos;s information.</SheetDescription>
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
