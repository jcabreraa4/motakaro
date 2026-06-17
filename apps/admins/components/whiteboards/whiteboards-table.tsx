import { useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { ExternalLinkIcon, MoreHorizontalIcon, PencilRulerIcon, SquarePenIcon, StarIcon, StarOffIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { WhiteboardsRemove } from '@/components/whiteboards/whiteboards-remove';
import { WhiteboardsUpdate } from '@/components/whiteboards/whiteboards-update';

function WhiteboardsRow({ whiteboard }: { whiteboard: Whiteboard }) {
  const router = useRouter();
  const updateWhiteboard = useMutation(api.whiteboards.update);

  function openInternally() {
    router.push(`/whiteboards/${whiteboard._id}`);
  }

  function openExternally() {
    window.open(`/whiteboards/${whiteboard._id}`, '_blank');
  }

  function handleUpdate() {
    updateWhiteboard({ id: whiteboard._id, starred: !whiteboard.starred })
      .then(() => toast.success(whiteboard.starred ? 'Whiteboard unstarred successfully.' : 'Whiteboard starred successfully.'))
      .catch(() => toast.error('An internal error has occurred.'));
  }

  return (
    <TableRow className="h-12 cursor-pointer p-20">
      <TableCell
        onClick={openInternally}
        className="w-12.5 p-4"
      >
        {whiteboard.starred ? <StarIcon className="text-yellow-500" /> : <PencilRulerIcon />}
      </TableCell>
      <TableCell
        onClick={openInternally}
        className="font-medium"
      >
        <div className="w-35 max-w-120 truncate md:w-fit">{whiteboard.name || 'Untitled Whiteboard'}</div>
      </TableCell>
      <TableCell
        onClick={openInternally}
        className="hidden text-muted-foreground lg:table-cell"
      >
        {format(new Date(whiteboard._creationTime), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell
        onClick={openInternally}
        className="hidden text-muted-foreground md:table-cell"
      >
        {format(new Date(whiteboard.updated), 'MMM dd, yyyy')}
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
            <WhiteboardsUpdate whiteboard={whiteboard}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <SquarePenIcon />
                Update Whiteboard
              </DropdownMenuItem>
            </WhiteboardsUpdate>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              {whiteboard.starred ? <StarOffIcon /> : <StarIcon />}
              {whiteboard.starred ? 'Quit from Favorites' : 'Add to Favorites'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openExternally}
              className="cursor-pointer"
            >
              <ExternalLinkIcon />
              Open in a new Tab
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <WhiteboardsRemove id={whiteboard._id}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon />
                Delete Whiteboard
              </DropdownMenuItem>
            </WhiteboardsRemove>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function WhiteboardsTable({ whiteboards }: { whiteboards: Whiteboard[] }) {
  const starredWhiteboards = whiteboards.filter((whiteboard) => whiteboard.starred);
  const nonStarredWhiteboards = whiteboards.filter((whiteboard) => !whiteboard.starred);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>&nbsp;</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {starredWhiteboards.map((whiteboard) => (
            <WhiteboardsRow
              key={whiteboard._id}
              whiteboard={whiteboard}
            />
          ))}
          {nonStarredWhiteboards.map((whiteboard) => (
            <WhiteboardsRow
              key={whiteboard._id}
              whiteboard={whiteboard}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
