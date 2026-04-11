import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { Label } from '@workspace/ui/components/label';
import { Embedding } from '@workspace/backend/schema';
import { PenIcon, TrashIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

export function EmbeddingsTable({ embeddings }: { embeddings: Embedding[] }) {
  const deleteEmbedding = useMutation(api.embeddings.remove);
  const emptyEmbeddings = useMutation(api.embeddings.empty);

  return (
    <Table>
      <TableHeader>
        <TableRow className="h-12 hover:bg-inherit">
          <TableHead>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                >
                  <TrashIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Embeddings</DialogTitle>
                  <DialogDescription>Reset the memory of your AI assistant.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() =>
                        emptyEmbeddings().finally(() => {
                          toast.success('Embeddings deleted successfully.');
                        })
                      }
                    >
                      <TrashIcon />
                      Delete Embeddings
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TableHead>
          <TableHead className="px-4">Number</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {embeddings.map((embedding, index) => (
          <TableRow key={embedding._id}>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer hover:bg-inherit dark:hover:bg-inherit"
                  >
                    <PenIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Embedding {index + 1}</DialogTitle>
                  </DialogHeader>
                  <Label className="lg:hidden">{embedding.content}</Label>
                  <span className="hidden lg:flex">{embedding.content}</span>
                  <DialogFooter className="flex-row">
                    <DialogClose asChild>
                      <Button
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          deleteEmbedding({ id: embedding._id }).finally(() => {
                            toast.success('Embedding deleted successfully.');
                          })
                        }
                      >
                        <TrashIcon />
                        Delete Embedding
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell className="px-4 font-medium">Emb {index + 1}</TableCell>
            <TableCell className="truncate">{embedding.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
