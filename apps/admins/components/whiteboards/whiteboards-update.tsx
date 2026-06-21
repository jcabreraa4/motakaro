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
import { Separator } from '@workspace/ui/components/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

interface WhiteboardsUpdateProps {
  whiteboard: Whiteboard;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function WhiteboardsUpdate({ whiteboard, onSuccess, children }: WhiteboardsUpdateProps) {
  const updateWhiteboard = useMutation(api.whiteboards.update);

  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: whiteboard.name, note: whiteboard.note, starred: whiteboard.starred.toString(), clientVisible: whiteboard.clientVisible.toString(), clientStarred: whiteboard.clientStarred.toString() });

  function handleUpdate() {
    updateWhiteboard({ id: whiteboard._id, name: info.name, note: info.note, starred: info.starred === 'true', clientVisible: info.clientVisible === 'true', clientStarred: info.clientStarred === 'true' })
      .then(() => {
        setOpen(false);
        toast.success('Whiteboard updated successfully.');
        onSuccess?.();
      })
      .catch(() => toast.error('An internal error has occurred.'));
  }

  function handleReset() {
    setInfo({ name: whiteboard.name, note: whiteboard.note, starred: whiteboard.starred.toString(), clientVisible: whiteboard.clientVisible.toString(), clientStarred: whiteboard.clientStarred.toString() });
  }

  function disableReset() {
    return (
      JSON.stringify(info) ===
      JSON.stringify({
        name: whiteboard.name,
        note: whiteboard.note,
        starred: whiteboard.starred.toString(),
        clientVisible: whiteboard.clientVisible.toString(),
        clientStarred: whiteboard.clientStarred.toString()
      })
    );
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
        {whiteboard.organizationId && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label>Clients Visible</Label>
              <Select
                value={info.clientVisible}
                onValueChange={(value) => setInfo({ ...info, clientVisible: value })}
              >
                <SelectTrigger className={cn('w-full cursor-pointer', info.clientVisible !== whiteboard.clientVisible.toString() && 'border-red-500')}>
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
            <div className="flex flex-col gap-2">
              <Label>Clients Starred</Label>
              <Select
                value={info.clientStarred}
                onValueChange={(value) => setInfo({ ...info, clientStarred: value })}
              >
                <SelectTrigger className={cn('w-full cursor-pointer', info.clientStarred !== whiteboard.clientStarred.toString() && 'border-red-500')}>
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
          </>
        )}
        <SheetFooter>
          <Button
            disabled={disableReset()}
            variant="outline"
            className="hidden cursor-pointer xl:flex"
            onClick={handleReset}
          >
            <RotateCcwIcon />
            Clear Changes
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleUpdate}
          >
            <SaveIcon />
            Update Whiteboard
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
