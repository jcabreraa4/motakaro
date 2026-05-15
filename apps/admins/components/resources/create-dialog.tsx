import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import type { ButtonVariant } from '@workspace/ui/types/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { CopyIcon, LinkIcon, PlusIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
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

interface CreateDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

export function CreateDialog({ variant = 'default', className }: CreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: '', note: '', link: '', embed: '', thumbnail: '', published: 'true' });

  const createResource = useMutation(api.resources.create);

  function handleCreate() {
    createResource({ name: info.name, note: info.note, link: info.link, embed: info.embed, thumbnail: info.thumbnail, published: info.published === 'true' }).finally(() => {
      toast.success('Resource listed successfully.');
      setOpen(false);
      setInfo({ name: '', note: '', link: '', embed: '', thumbnail: '', published: 'true' });
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          <PlusIcon />
          Create Resource
        </Button>
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Create Resource</SheetTitle>
          <SheetDescription className="hidden lg:block">Create a new resource on the website.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4 lg:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Untitled Resource"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </div>
          <div className="hidden flex-col gap-2 lg:flex">
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
            <InputGroup>
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
            <InputGroup>
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
            <InputGroup>
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
            onClick={handleCreate}
          >
            <PlusIcon />
            Create Resource
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
