import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { CopyIcon, LinkIcon, RotateCcwIcon, SaveIcon } from 'lucide-react';
import { Textarea } from '@workspace/ui/components/textarea';
import type { Resource } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { copyText } from '@/utils/copy-text';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

function CopyLinkButton({ link }: { link: string }) {
  return (
    <InputGroupButton
      size="icon-sm"
      className="cursor-pointer"
      onClick={() => copyText({ text: link, type: 'link' })}
    >
      <CopyIcon />
    </InputGroupButton>
  );
}

interface UpdateDialogProps {
  resource: Resource;
  children: React.ReactNode;
}

export function UpdateDialog({ resource, children }: UpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: resource.name, note: resource.note, link: resource.link, embed: resource.embed, thumbnail: resource.thumbnail, published: resource.published.toString() });

  const updateResource = useMutation(api.resources.update);

  function handleUpdate() {
    updateResource({ id: resource._id, name: info.name, note: info.note, link: info.link, embed: info.embed, thumbnail: info.thumbnail, published: info.published === 'true' }).finally(() => {
      toast.success('Resource updated successfully.');
      setOpen(false);
    });
  }

  function handleReset() {
    setInfo({ name: resource.name, note: resource.note, link: resource.link, embed: resource.embed, thumbnail: resource.thumbnail, published: resource.published.toString() });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Update Resource</SheetTitle>
          <SheetDescription className="hidden lg:block">Update selected resource&apos;s information.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4 lg:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled Resource"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              className={cn(info.name !== resource.name && 'border-red-500')}
            />
          </div>
          <div className="hidden flex-col gap-2 lg:flex">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={info.note}
              onChange={(e) => setInfo({ ...info, note: e.target.value })}
              className={cn('h-20', info.note !== resource.note && 'border-red-500')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Video</Label>
            <InputGroup className={cn(info.link !== resource.link && 'border-red-500')}>
              <InputGroupInput
                id="link"
                placeholder="https://www.video.com"
                value={info.link}
                onChange={(e) => setInfo({ ...info, link: e.target.value })}
              />
              <InputGroupAddon>
                <LinkIcon />
              </InputGroupAddon>
              {info.link && (
                <InputGroupAddon align="inline-end">
                  <CopyLinkButton link={info.link} />
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="embed">Embed</Label>
            <InputGroup className={cn(info.embed !== resource.embed && 'border-red-500')}>
              <InputGroupInput
                id="embed"
                placeholder="https://www.embed.com"
                value={info.embed}
                onChange={(e) => setInfo({ ...info, embed: e.target.value })}
              />
              <InputGroupAddon>
                <LinkIcon />
              </InputGroupAddon>
              {info.embed && (
                <InputGroupAddon align="inline-end">
                  <CopyLinkButton link={info.embed} />
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <InputGroup className={cn(info.thumbnail !== resource.thumbnail && 'border-red-500')}>
              <InputGroupInput
                id="thumbnail"
                placeholder="https://www.thumbnail.com"
                value={info.thumbnail}
                onChange={(e) => setInfo({ ...info, thumbnail: e.target.value })}
              />
              <InputGroupAddon>
                <LinkIcon />
              </InputGroupAddon>
              {info.thumbnail && (
                <InputGroupAddon align="inline-end">
                  <CopyLinkButton link={info.thumbnail} />
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Published</Label>
            <Select
              value={info.published}
              onValueChange={(value) => setInfo({ ...info, published: value })}
            >
              <SelectTrigger className={cn('w-full cursor-pointer', info.published !== resource.published.toString() && 'border-red-500')}>
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
            onClick={handleUpdate}
          >
            <SaveIcon />
            Update Resource
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
