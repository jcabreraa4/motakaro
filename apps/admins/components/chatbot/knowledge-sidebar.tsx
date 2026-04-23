import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { EmbeddingsTable } from '@/components/chatbot/embeddings-table';
import { VectorizeDialog } from '@/components/chatbot/vectorize-dialog';
import { Separator } from '@workspace/ui/components/separator';
import { Textarea } from '@workspace/ui/components/textarea';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Button } from '@workspace/ui/components/button';
import { FileAxis3DIcon, SaveIcon } from 'lucide-react';
import { api } from '@workspace/backend/_generated/api';
import { Label } from '@workspace/ui/components/label';
import { useMutation, useQuery } from 'convex/react';
import { useAuth, useUser } from '@clerk/nextjs';
import { cn } from '@workspace/ui/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function KnowledgeSidebar({ className }: { className?: string }) {
  const { user } = useUser();
  const { isLoaded } = useAuth();

  const [context, setContext] = useState('');

  const embeddings = useQuery(api.embeddings.list, isLoaded ? {} : 'skip');
  const employee = useQuery(api.employees.get, isLoaded ? { clerkId: user!.id } : 'skip');

  const updateEmployee = useMutation(api.employees.update);

  useEffect(() => {
    if (employee?.note) setContext(employee.note);
  }, [employee]);

  function updateContext() {
    updateEmployee({ clerkId: user?.id, context: context }).finally(() => {
      toast.success('Context updated successfully.');
    });
  }

  return (
    <section className={cn('flex w-120 flex-col gap-5 border-l p-5', className)}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="context">Personal Context</Label>
          <Textarea
            id="context"
            className="h-20"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={updateContext}
        >
          <SaveIcon />
          Update Context
        </Button>
      </div>
      <Separator />
      <VectorizeDialog
        variant="outline"
        className="w-full"
      />
      {!embeddings ? (
        <CircleLoader className="w-full" />
      ) : embeddings.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileAxis3DIcon className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-xl">No Embeddings Available</EmptyTitle>
            <EmptyDescription className="text-md">You haven&apos;t processed any files yet. Get started by processing your first file.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <VectorizeDialog className="min-w-50" />
          </EmptyContent>
        </Empty>
      ) : (
        <EmbeddingsTable embeddings={embeddings || []} />
      )}
    </section>
  );
}
