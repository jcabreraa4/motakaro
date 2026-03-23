import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { ButtonVariant } from '@workspace/ui/types/button';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import { CopyIcon, PlusIcon } from 'lucide-react';
import { copyText } from '@/utils/copy-text';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

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

export function CreateDialog({ variant = 'default', className }: CreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ name: '', link: '', embed: '', thumbnail: '' });

  const createResource = useMutation(api.resources.create);

  function handleCreate() {
    createResource({ name: info.name, link: info.link, embed: info.embed, thumbnail: info.thumbnail }).finally(() => {
      toast.success('Resource listed successfully.');
      setOpen(false);
      setInfo({ name: '', link: '', embed: '', thumbnail: '' });
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          <PlusIcon />
          List Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List Resource</DialogTitle>
          <DialogDescription>List a video resource on the website.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="link">Video</Label>
          <div className="flex gap-3">
            <Input
              id="link"
              value={info.link}
              onChange={(e) => setInfo({ ...info, link: e.target.value })}
            />
            {info.link && <CopyLinkButton link={info.link} />}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="embed">Embed</Label>
          <div className="flex gap-3">
            <Input
              id="embed"
              value={info.embed}
              onChange={(e) => setInfo({ ...info, embed: e.target.value })}
            />
            {info.embed && <CopyLinkButton link={info.embed} />}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <div className="flex gap-3">
            <Input
              id="thumbnail"
              value={info.thumbnail}
              onChange={(e) => setInfo({ ...info, thumbnail: e.target.value })}
            />
            {info.thumbnail && <CopyLinkButton link={info.thumbnail} />}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreate}
            className="w-full flex-1 cursor-pointer"
          >
            <PlusIcon />
            List Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
