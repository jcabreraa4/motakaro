'use client';

import { useQuery } from 'convex/react';
import { useParams } from '@/hooks/use-params';
import { ListVideoIcon, SearchIcon } from 'lucide-react';
import { CreateDialog } from '@/components/resources/create-dialog';
import { ResourcesTable } from '@/components/resources/resources-table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { api } from '@workspace/backend/_generated/api';
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [statusFilter, setStatusFilter] = useParams('published');
  const effectiveStatusFilter = statusFilter || 'all';

  const resources = useQuery(api.resources.list, isLoaded ? {} : 'skip');
  const filteredResources = resources?.filter((resource) => searchFilter === '' || resource.name.toLowerCase().includes(searchFilter.toLowerCase())).filter((resource) => (effectiveStatusFilter === 'all' ? true : resource.published === (effectiveStatusFilter === 'true')));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
      <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
        <Select
          value={effectiveStatusFilter}
          onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger
            disabled={!resources || resources.length === 0}
            className="hidden min-w-50 cursor-pointer xl:flex"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="true">Already Published</SelectItem>
              <SelectItem value="false">Not Published</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <InputGroup className="flex-1">
          <InputGroupInput
            disabled={!resources || resources.length === 0}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <CreateDialog
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!resources ? (
        <CircleLoader />
      ) : resources.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListVideoIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Resources Available</EmptyTitle>
              <EmptyDescription className="text-md">You haven&apos;t listed any resources yet. Get started by listing your first resource.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateDialog className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        <ResourcesTable resources={filteredResources || []} />
      )}
    </main>
  );
}
