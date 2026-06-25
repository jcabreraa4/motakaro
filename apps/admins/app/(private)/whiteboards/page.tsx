'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { PencilRulerIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { EmptySection } from '@workspace/ui/custom/empty-section';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { WhiteboardsCreate } from '@/components/whiteboards/whiteboards-create';
import { WhiteboardsTable } from '@/components/whiteboards/whiteboards-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { push } = useRouter();
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const whiteboards = useQuery(api.whiteboards.list, isLoaded ? {} : 'skip');
  const filteredBoards = whiteboards?.filter((whiteboard) => searchFilter === '' || whiteboard.name.toLowerCase().includes(searchFilter.toLowerCase()) || whiteboard._id.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 md:gap-5 md:p-5">
      <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
        <InputGroup className="flex-1">
          <InputGroupInput
            disabled={!whiteboards || whiteboards.length === 0}
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
        <WhiteboardsCreate onSuccess={(id) => push(`/whiteboards/${id}`)}>
          <Button
            variant="outline"
            className="min-w-50 cursor-pointer"
          >
            <PlusIcon />
            Create Whiteboard
          </Button>
        </WhiteboardsCreate>
      </section>
      {!whiteboards ? (
        <GenericLoader />
      ) : whiteboards.length === 0 ? (
        <EmptySection
          icon={PencilRulerIcon}
          title="No Whiteboards Available"
          description="There are currently no whiteboards available."
        >
          <WhiteboardsCreate onSuccess={(id) => push(`/whiteboards/${id}`)}>
            <Button className="min-w-50 cursor-pointer">
              <PlusIcon />
              Create Whiteboard
            </Button>
          </WhiteboardsCreate>
        </EmptySection>
      ) : filteredBoards?.length === 0 ? (
        <EmptySection
          icon={PencilRulerIcon}
          title="No Whiteboards Found"
          description="No whiteboards match your search criteria."
        />
      ) : (
        <WhiteboardsTable whiteboards={filteredBoards || []} />
      )}
    </main>
  );
}
