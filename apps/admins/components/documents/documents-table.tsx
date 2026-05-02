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

  function openDocument() {
    router.push(`/documents/${document._id}`);
  }

  function openWindow() {
    window.open(`/documents/${document._id}`, '_blank');
  }

  return (
    <TableRow className="h-12 cursor-pointer p-20">
      <TableCell
        className="w-12.5 p-4"
        onClick={openDocument}
      >
        {document.starred ? <StarIcon className="text-yellow-500" /> : <FileTextIcon />}
      </TableCell>
      <TableCell
        className="font-medium"
        onClick={openDocument}
      >
        <div className="w-35 max-w-120 truncate md:w-fit">{document.name}</div>
      </TableCell>
      <TableCell
        className="hidden text-muted-foreground md:table-cell"
        onClick={openDocument}
      >
        {format(new Date(document._creationTime), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell
        className="hidden text-muted-foreground lg:table-cell"
        onClick={openDocument}
      >
        {format(new Date(document.updated), 'MMM dd, yyyy')}
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
              name={document.name}
              note={document.note}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <FilePenIcon />
                Update Document
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
              onClick={openWindow}
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
                Delete Document
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
    <section className="h-0 flex-1 overflow-y-scroll lg:pe-3">
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>&nbsp;</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden lg:table-cell">Updated</TableHead>
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
    </section>
  );
}
