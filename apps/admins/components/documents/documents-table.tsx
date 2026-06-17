import { useRouter } from 'next/navigation';

import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { ExternalLinkIcon, FilePenIcon, FileTextIcon, MoreHorizontalIcon, StarIcon, StarOffIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { DocumentsRemove } from '@/components/documents/documents-remove';
import { DocumentsUpdate } from '@/components/documents/documents-update';

function DocumentsRow({ document }: { document: Document }) {
  const router = useRouter();
  const updateDocument = useMutation(api.documents.update);

  function openInternally() {
    router.push(`/documents/${document._id}`);
  }

  function openExternally() {
    window.open(`/documents/${document._id}`, '_blank');
  }

  function handleUpdate() {
    updateDocument({ id: document._id, starred: !document.starred })
      .then(() => toast.success(document.starred ? 'Document unstarred successfully.' : 'Document starred successfully.'))
      .catch(() => toast.error('An internal error has occurred.'));
  }

  return (
    <TableRow className="h-12 cursor-pointer p-20">
      <TableCell
        onClick={openInternally}
        className="w-12.5 p-4"
      >
        {document.starred ? <StarIcon className="text-yellow-500" /> : <FileTextIcon />}
      </TableCell>
      <TableCell
        onClick={openInternally}
        className="font-medium"
      >
        <div className="w-35 max-w-120 truncate md:w-fit">{document.name || 'Untitled Document'}</div>
      </TableCell>
      <TableCell
        onClick={openInternally}
        className="hidden text-muted-foreground lg:table-cell"
      >
        {format(new Date(document._creationTime), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell
        onClick={openInternally}
        className="hidden text-muted-foreground md:table-cell"
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
            <DocumentsUpdate document={document}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <FilePenIcon />
                Update Document
              </DropdownMenuItem>
            </DocumentsUpdate>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              {document.starred ? <StarOffIcon /> : <StarIcon />}
              {document.starred ? 'Quit from Favorites' : 'Add to Favorites'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openExternally}
              className="cursor-pointer"
            >
              <ExternalLinkIcon />
              Open in a new Tab
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DocumentsRemove id={document._id}>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon />
                Delete Document
              </DropdownMenuItem>
            </DocumentsRemove>
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
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {starredDocuments.map((document) => (
            <DocumentsRow
              key={document._id}
              document={document}
            />
          ))}
          {nonStarredDocuments.map((document) => (
            <DocumentsRow
              key={document._id}
              document={document}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
