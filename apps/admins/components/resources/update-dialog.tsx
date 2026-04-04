import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { Textarea } from '@workspace/ui/components/textarea';
import { CopyIcon, LinkIcon, SaveIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Resource } from '@workspace/backend/schema';
import { copyText } from '@/utils/copy-text';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

function CopyLinkButton({ link }: { link: string }) {
  return (
    <Button
      size="icon"
      variant="secondary"
      className="cursor-pointer"
      onClick={() => copyText({ text: link, type: 'link' })}
    >
      <CopyIcon />
    </Button>
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

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Update Resource</SheetTitle>
          <SheetDescription>Change your resource&apos;s information.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Video</Label>
            <div className="flex gap-3">
              <InputGroup className="flex-1">
                <InputGroupInput
                  id="link"
                  placeholder="https://www.video.com"
                  value={info.link}
                  onChange={(e) => setInfo({ ...info, link: e.target.value })}
                />
                <InputGroupAddon>
                  <LinkIcon />
                </InputGroupAddon>
              </InputGroup>
              {info.link && <CopyLinkButton link={info.link} />}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="embed">Embed</Label>
            <div className="flex gap-3">
              <InputGroup className="flex-1">
                <InputGroupInput
                  id="embed"
                  placeholder="https://www.embed.com"
                  value={info.embed}
                  onChange={(e) => setInfo({ ...info, embed: e.target.value })}
                />
                <InputGroupAddon>
                  <LinkIcon />
                </InputGroupAddon>
              </InputGroup>
              {info.embed && <CopyLinkButton link={info.embed} />}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div className="flex gap-3">
              <InputGroup className="flex-1">
                <InputGroupInput
                  id="thumbnail"
                  placeholder="https://www.thumbnail.com"
                  value={info.thumbnail}
                  onChange={(e) => setInfo({ ...info, thumbnail: e.target.value })}
                />
                <InputGroupAddon>
                  <LinkIcon />
                </InputGroupAddon>
              </InputGroup>
              {info.thumbnail && <CopyLinkButton link={info.thumbnail} />}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Published</Label>
            <Select value={info.published}>
              <SelectTrigger className="w-full cursor-pointer">
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
            type="submit"
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
