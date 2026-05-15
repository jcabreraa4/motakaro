import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { CopyIcon, LinkIcon, RotateCcwIcon, SaveIcon } from 'lucide-react';
import { Textarea } from '@workspace/ui/components/textarea';
import type { MediaFile } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { copyText } from '@/utils/copy-text';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateDialogProps {
  file: MediaFile;
  children: React.ReactNode;
}

export function UpdateDialog({ file, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: file.name, note: file.note, visible: file.clientsVisible.toString() });

  const updateFile = useMutation(api.multimedia.update);

  function handleUpdate() {
    updateFile({ id: file._id, name: info.name, note: info.note, clientsVisible: info.visible === 'true' }).finally(() => {
      toast.success('File updated successfully.');
      setOpen(false);
    });
  }

  function handleReset() {
    setInfo({ name: file.name, note: file.note, visible: file.clientsVisible.toString() });
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
          <InputGroup>
            <InputGroupInput
              readOnly
              value={file.url!}
              className="cursor-pointer"
              onClick={() => copyText({ text: file.url!, type: 'link' })}
            />
            <InputGroupAddon
              className="cursor-pointer"
              onClick={() => copyText({ text: file.url!, type: 'link' })}
            >
              <LinkIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                className="cursor-pointer"
                onClick={() => copyText({ text: file.url!, type: 'link' })}
              >
                <CopyIcon />
              </InputGroupButton>
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
          {file.companyId && (
            <div className="flex flex-col gap-2">
              <Label>Visible</Label>
              <Select
                value={info.visible}
                onValueChange={(value) => setInfo({ ...info, visible: value })}
              >
                <SelectTrigger className={cn('w-full cursor-pointer', info.visible !== file.clientsVisible.toString() && 'border-red-500')}>
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
          )}
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
