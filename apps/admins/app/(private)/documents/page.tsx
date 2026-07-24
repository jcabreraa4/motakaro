'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { FileTextIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Kbd, KbdGroup } from '@workspace/ui/components/kbd';

import { DocumentsCreate } from '@/components/documents/documents-create';
import { DocumentsTable } from '@/components/documents/documents-table';
import { AppSection } from '@/components/layout/app-section';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { push } = useRouter();
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const documents = useQuery(api.documents.list, isLoaded ? {} : 'skip');

  const filtered = documents?.filter((document) => searchFilter === '' || document.name.toLowerCase().includes(searchFilter.toLowerCase()) || document._id.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <AppSection className="flex flex-col gap-3 md:gap-5">
      <section className="flex flex-col gap-3 lg:flex-row lg:gap-5">
        <InputGroup className="flex-1">
          <InputGroupInput
            disabled={!documents || documents.length === 0}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchFilter('');
              }
            }}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          {searchFilter && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                className="cursor-pointer hover:bg-transparent"
                onClick={() => setSearchFilter('')}
              >
                <KbdGroup>
                  <Kbd>
                    <XIcon />
                    ESC
                  </Kbd>
                </KbdGroup>
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
      ) : filtered?.length === 0 ? (
        <EmptySection
          icon={FileTextIcon}
          title="No Documents Found"
          description="No documents match your search criteria."
        />
      ) : (
        <DocumentsTable documents={filtered || []} />
      )}
    </AppSection>
  );
}
