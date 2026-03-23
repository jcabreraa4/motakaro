'use client';

import { useState } from 'react';
import { type LucideIcon, CopyIcon, ExpandIcon, LinkIcon, PenIcon, SaveIcon, StarIcon, TrashIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Textarea } from '@workspace/ui/components/textarea';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Resource } from '@workspace/backend/schema';
import { copyText } from '@/utils/copy-text';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
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

interface SectionButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  isActive?: boolean;
}

function SectionButton({ onClick, icon: Icon, isActive }: SectionButtonProps) {
  const isMobile = useIsMobile();

  return (
    <Button
      onClick={onClick}
      size={isMobile ? 'icon' : 'default'}
      variant={isActive ? 'default' : 'outline'}
      className="cursor-pointer"
    >
      <Icon />
    </Button>
  );
}

function DeleteDialog({ id }: { id: Id<'resources'> }) {
  const [open, setOpen] = useState(false);

  const deleteResource = useMutation(api.resources.remove);

  function handleDelete() {
    deleteResource({ id }).finally(() => {
      toast.success('Resource deleted successfully.');
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <SectionButton icon={TrashIcon} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resource</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="flex-1 cursor-pointer"
            onClick={handleDelete}
          >
            <TrashIcon />
            Delete Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateDialog({ resource }: { resource: Resource }) {
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
      <SheetTrigger asChild>
        <SectionButton icon={PenIcon} />
      </SheetTrigger>
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

export function ResourceToolbar({ resource }: { resource: Resource }) {
  const router = useRouter();
  const updateFile = useMutation(api.resources.update);

  const sectionButtons = [
    {
      icon: StarIcon,
      onClick: () => updateFile({ id: resource._id, starred: !resource.starred }).finally(() => toast.success(resource.starred ? 'Resource removed from starred successfully.' : 'Resource added to starred successfully.')),
      isActive: resource.starred
    },
    {
      icon: CopyIcon,
      onClick: () => {
        if (!resource.link) {
          toast.error('The resource has no link available.');
          return;
        }
        copyText({ text: resource.link, type: 'link' });
      }
    }
  ];

  function handleClick() {
    if (!resource._id) return;
    router.push(`/resources/${resource._id}`);
  }

  return (
    <div className="flex gap-3">
      {sectionButtons.map((sectionButton, index) => (
        <SectionButton
          key={index}
          {...sectionButton}
        />
      ))}
      <UpdateDialog resource={resource} />
      <DeleteDialog id={resource._id} />
      <SectionButton
        icon={ExpandIcon}
        onClick={handleClick}
      />
    </div>
  );
}
