import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { ButtonVariant } from '@workspace/ui/types/button';
import { Button } from '@workspace/ui/components/button';
import { CalendarPlusIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateDialogProps {
  variant?: ButtonVariant;
  className?: string;
}

export function CreateDialog({ variant = 'default', className }: CreateDialogProps) {
  const [open, setOpen] = useState(false);

  function handleCreate() {
    setOpen(false);
    toast.success('Meeting booked successfully.');
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
          <CalendarPlusIcon />
          Book Meeting
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Book Meeting</SheetTitle>
          <SheetDescription>Book a future online meeting.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={handleCreate}
          >
            <CalendarPlusIcon />
            Book Meeting
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
