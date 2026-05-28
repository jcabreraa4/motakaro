'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { FileTextIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { CircleLoader } from '@workspace/ui/custom/loaders';

import { CreateButton } from '@/components/documents/create-button';
import { DocumentsTable } from '@/components/documents/documents-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const documents = useQuery(api.documents.list, isLoaded ? {} : 'skip');
  const filteredDocuments = documents?.filter((document) => searchFilter === '' || document.name.toLowerCase().includes(searchFilter.toLowerCase()) || document._id.toLowerCase().includes(searchFilter.toLowerCase()));

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
          {searchFilter && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                className="cursor-pointer"
                onClick={() => setSearchFilter('')}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <CreateButton
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!documents ? (
        <CircleLoader />
      ) : documents.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center select-none">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Documents Available</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">You haven&apos;t created any documents yet. Get started by creating your first document.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateButton className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : filteredDocuments?.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center select-none">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Documents Found</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">No documents match your search criteria. Try adjusting your filters or search term.</EmptyDescription>
              <EmptyDescription className="text-md lg:hidden">No documents match your search criteria.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </section>
      ) : (
        <DocumentsTable documents={filteredDocuments || []} />
      )}
    </main>
  );
}
