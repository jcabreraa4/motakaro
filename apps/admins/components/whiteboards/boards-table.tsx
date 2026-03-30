import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { ExternalLinkIcon, FilePenIcon, PencilRulerIcon, MoreHorizontalIcon, StarIcon, StarOffIcon, TrashIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { UpdateDialog } from '@/components/whiteboards/update-dialog';
import { RemoveDialog } from '@/components/whiteboards/remove-dialog';
import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

function WhiteboardRow({ whiteboard }: { whiteboard: Whiteboard }) {
  const router = useRouter();

  const updateWhiteboard = useMutation(api.whiteboards.update);

  function openWhiteboard() {
    router.push(`/whiteboards/${whiteboard._id}`);
  }

  function openWindow() {
    window.open(`/whiteboards/${whiteboard._id}`, '_blank');
  }

  return (
    <TableRow className="h-12 cursor-pointer p-20">
      <TableCell
        className="w-12.5 p-4"
        onClick={openWhiteboard}
      >
        {whiteboard.starred ? <StarIcon className="text-yellow-500" /> : <PencilRulerIcon />}
      </TableCell>
      <TableCell
        className="font-medium"
        onClick={openWhiteboard}
      >
        <div className="w-35 max-w-120 truncate md:w-fit">{whiteboard.name}</div>
      </TableCell>
      <TableCell
        className="hidden text-muted-foreground md:table-cell"
        onClick={openWhiteboard}
      >
        {format(new Date(whiteboard._creationTime), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
            >
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-fit"
          >
            <UpdateDialog
              id={whiteboard._id}
              name={whiteboard.name}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <FilePenIcon />
                Rename Whiteboard
              </DropdownMenuItem>
            </UpdateDialog>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                updateWhiteboard({ id: whiteboard._id, starred: !whiteboard.starred }).finally(() => {
                  toast.success(whiteboard.starred ? 'Whiteboard removed from starred successfully.' : 'Whiteboard added to starred successfully.');
                });
              }}
            >
              {whiteboard.starred ? <StarOffIcon /> : <StarIcon />}
              {whiteboard.starred ? 'Quit from Favorites' : 'Add to Favorites'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={openWindow}
            >
              <ExternalLinkIcon />
              Open in a new Tab
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <RemoveDialog id={whiteboard._id}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon />
                Remove Whiteboard
              </DropdownMenuItem>
            </RemoveDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function BoardsTable({ whiteboards }: { whiteboards: Whiteboard[] }) {
  const starredWhiteboards = whiteboards.filter((whiteboard) => whiteboard.starred);
  const nonStarredWhiteboards = whiteboards.filter((whiteboard) => !whiteboard.starred);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>&nbsp;</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {starredWhiteboards.map((whiteboard) => (
            <WhiteboardRow
              key={whiteboard._id}
              whiteboard={whiteboard}
            />
          ))}
          {nonStarredWhiteboards.map((whiteboard) => (
            <WhiteboardRow
              key={whiteboard._id}
              whiteboard={whiteboard}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
