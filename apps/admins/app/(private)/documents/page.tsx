'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { FileTextIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { EmptySection } from '@workspace/ui/custom/empty-section';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { DocumentsCreate } from '@/components/documents/documents-create';
import { DocumentsTable } from '@/components/documents/documents-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { push } = useRouter();
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const documents = useQuery(api.documents.list, isLoaded ? {} : 'skip');
  const filteredDocuments = documents?.filter((document) => searchFilter === '' || document.name.toLowerCase().includes(searchFilter.toLowerCase()) || document._id.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 md:gap-5 md:p-5">
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
        <DocumentsCreate onSuccess={(id) => push(`/documents/${id}`)}>
          <Button
            variant="outline"
            className="min-w-50 cursor-pointer"
          >
            <PlusIcon />
            Create Document
          </Button>
        </DocumentsCreate>
      </section>
      {!documents ? (
        <GenericLoader />
      ) : documents.length === 0 ? (
        <EmptySection
          icon={FileTextIcon}
          title="No Documents Available"
          description="There are currently no documents available."
        >
          <DocumentsCreate onSuccess={(id) => push(`/documents/${id}`)}>
            <Button className="min-w-50 cursor-pointer">
              <PlusIcon />
              Create Document
            </Button>
          </DocumentsCreate>
        </EmptySection>
      ) : filteredDocuments?.length === 0 ? (
        <EmptySection
          icon={FileTextIcon}
          title="No Documents Found"
          description="No documents match your search criteria."
        />
      ) : (
        <DocumentsTable documents={filteredDocuments || []} />
      )}
    </main>
  );
}
