'use client';

import { useQuery } from 'convex/react';
import { useParams } from '@/hooks/use-params';
import { FileTextIcon, SearchIcon } from 'lucide-react';
import { CreateButton } from '@/components/documents/create-button';
import { DocumentsTable } from '@/components/documents/documents-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { api } from '@workspace/backend/_generated/api';
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const documents = useQuery(api.documents.list, isLoaded ? {} : 'skip');
  const filteredDocuments = documents?.filter((document) => document.name.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
      <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
        <InputGroup className="flex-1">
          <InputGroupInput
            disabled={!documents || documents.length === 0}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <CreateButton
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!documents ? (
        <CircleLoader />
      ) : documents.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Documents Available</EmptyTitle>
              <EmptyDescription className="text-md">You haven&apos;t created any documents yet. Get started by creating your first document.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateButton className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        <section className="h-0 flex-1 overflow-y-scroll lg:pe-3">
          <DocumentsTable documents={filteredDocuments || []} />
        </section>
      )}
    </main>
  );
}
