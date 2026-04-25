'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { PencilRulerIcon, SearchIcon } from 'lucide-react';
import { WhiteboardsTable } from '@/components/whiteboards/whiteboards-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { CreateButton } from '@/components/whiteboards/create-button';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { api } from '@workspace/backend/_generated/api';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const whiteboards = useQuery(api.whiteboards.list, isLoaded ? {} : 'skip');
  const filteredBoards = whiteboards?.filter((whiteboard) => searchFilter === '' || whiteboard.name.toLowerCase().includes(searchFilter.toLowerCase()) || whiteboard.note.toLowerCase().includes(searchFilter.toLowerCase()) || whiteboard._id.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
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
        </InputGroup>
        <CreateButton
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!whiteboards ? (
        <CircleLoader />
      ) : whiteboards.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PencilRulerIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Whiteboards Available</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">You haven&apos;t created any whiteboards yet. Get started by creating your first whiteboard.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateButton className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : filteredBoards?.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PencilRulerIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Whiteboards Found</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">No whiteboards match your search criteria. Try adjusting your filters or search term.</EmptyDescription>
              <EmptyDescription className="text-md lg:hidden">No whiteboards match your search criteria.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </section>
      ) : (
        <WhiteboardsTable whiteboards={filteredBoards || []} />
      )}
    </main>
  );
}
