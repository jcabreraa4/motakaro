import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { ExternalLinkIcon, FilePenIcon, FileTextIcon, MoreHorizontalIcon, StarIcon, StarOffIcon, TrashIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { UpdateDialog } from '@/components/documents/update-dialog';
import { RemoveDialog } from '@/components/documents/remove-dialog';
import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

function DocumentRow({ document }: { document: Document }) {
  const router = useRouter();

  const updateDocument = useMutation(api.documents.update);

  function openDocument(id: string) {
    router.push(`/documents/${id}`);
  }

  function openWindow(id: string) {
    window.open(`/documents/${id}`, '_blank');
  }

  return (
    <TableRow className="h-12 cursor-pointer p-20">
      <TableCell
        className="w-12.5 p-4"
        onClick={() => openDocument(document._id)}
      >
        {document.starred ? <StarIcon className="text-yellow-500" /> : <FileTextIcon />}
      </TableCell>
      <TableCell
        className="font-medium"
        onClick={() => openDocument(document._id)}
      >
        <div className="w-35 max-w-120 truncate md:w-fit">{document.name}</div>
      </TableCell>
      <TableCell
        className="hidden text-muted-foreground md:table-cell"
        onClick={() => openDocument(document._id)}
      >
        {format(new Date(document._creationTime), 'MMM dd, yyyy')}
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
              id={document._id}
              title={document.name}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <FilePenIcon />
                Rename Document
              </DropdownMenuItem>
            </UpdateDialog>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                updateDocument({ id: document._id, starred: !document.starred }).finally(() => {
                  toast.success(document.starred ? 'Document removed from starred successfully.' : 'Document added to starred successfully.');
                });
              }}
            >
              {document.starred ? <StarOffIcon /> : <StarIcon />}
              {document.starred ? 'Quit from Favorites' : 'Add to Favorites'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => openWindow(document._id)}
            >
              <ExternalLinkIcon />
              Open in a new Tab
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <RemoveDialog id={document._id}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon />
                Remove Document
              </DropdownMenuItem>
            </RemoveDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function DocumentsTable({ documents }: { documents: Document[] }) {
  const starredDocuments = documents.filter((document) => document.starred);
  const nonStarredDocuments = documents.filter((document) => !document.starred);

  return (
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
        {starredDocuments.map((document) => (
          <DocumentRow
            key={document._id}
            document={document}
          />
        ))}
        {nonStarredDocuments.map((document) => (
          <DocumentRow
            key={document._id}
            document={document}
          />
        ))}
      </TableBody>
    </Table>
  );
}
