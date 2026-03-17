'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ImageIcon, SearchIcon } from 'lucide-react';
import { BoardsTable } from '@/components/blackboards/boards-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { CreateButton } from '@/components/blackboards/create-button';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { api } from '@workspace/backend/_generated/api';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');

  const blackboards = useQuery(api.blackboards.list, isLoaded ? {} : 'skip');
  const filteredBoards = blackboards?.filter((board) => board.name.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
      <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
        <InputGroup className="flex-1">
          <InputGroupInput
            disabled={!blackboards || blackboards.length === 0}
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
      {!blackboards ? (
        <CircleLoader />
      ) : blackboards.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Blackboards Available</EmptyTitle>
              <EmptyDescription className="text-md">You haven&apos;t created any blackboards yet. Get started by creating your first blackboard.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateButton className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
          <BoardsTable blackboards={filteredBoards || []} />
        </div>
      )}
    </main>
  );
}
