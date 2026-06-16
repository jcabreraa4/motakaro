import { useState } from 'react';

import { useMutation } from 'convex/react';
import { CopyIcon, LinkIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';

import { copyText } from '@/utils/copy-text';

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

interface ResourcesCreateProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function ResourcesCreate({ onSuccess, children }: ResourcesCreateProps) {
  const createResource = useMutation(api.resources.create);

  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: '', note: '', starred: 'false', link: '', embed: '', thumbnail: '', published: 'false' });

  function handleCreate() {
    createResource({ name: info.name, note: info.note, starred: info.starred === 'true', link: info.link, embed: info.embed, thumbnail: info.thumbnail, published: info.published === 'true' })
      .then(() => {
        setOpen(false);
        toast.success('Resource created successfully.');
        setInfo({ name: '', note: '', starred: 'false', link: '', embed: '', thumbnail: '', published: 'false' });
        onSuccess?.();
      })
      .catch(() => toast.error('An internal error has ocurred.'));
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Create Resource</SheetTitle>
          <SheetDescription className="md:hidden">Specify resource information.</SheetDescription>
          <SheetDescription className="hidden md:block">Specify new resource&apos;s information.</SheetDescription>
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
          <div className="hidden flex-col gap-2 xl:flex">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              className="h-20"
              value={info.note}
              onChange={(e) => setInfo({ ...info, note: e.target.value })}
            />
          </div>
          <div className="hidden flex-col gap-2 xl:flex">
            <Label>Starred</Label>
            <Select
              value={info.starred}
              onValueChange={(value) => setInfo({ ...info, starred: value })}
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
          <Separator className="hidden xl:flex" />
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
