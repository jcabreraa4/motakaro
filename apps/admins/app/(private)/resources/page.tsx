'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ListVideoIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { CircleLoader } from '@workspace/ui/custom/loaders';

import { CreateDialog } from '@/components/resources/create-dialog';
import { ResourcesTable } from '@/components/resources/resources-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [statusFilter, setStatusFilter] = useParams('published');
  const effectiveStatusFilter = statusFilter || 'all';

  const resources = useQuery(api.resources.list, isLoaded ? {} : 'skip');
  const filteredResources = resources?.filter((resource) => {
    const matchesSearch = searchFilter === '' || resource.name.toLowerCase().includes(searchFilter.toLowerCase()) || resource.note.toLowerCase().includes(searchFilter.toLowerCase()) || resource._id.toLowerCase().includes(searchFilter.toLowerCase()) || resource.link.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = effectiveStatusFilter === 'all' || resource.published === (effectiveStatusFilter === 'true');
    return matchesSearch && matchesStatus;
  });

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
              <SelectItem value="all">Unfiltered</SelectItem>
              <SelectItem value="true">Published</SelectItem>
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
        <CreateDialog
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!resources ? (
        <CircleLoader />
      ) : resources.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center select-none">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListVideoIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Resources Available</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">You haven&apos;t listed any resources yet. Get started by listing your first resource.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateDialog className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : filteredResources?.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center select-none">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListVideoIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Resources Found</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">No resources match your search criteria. Try adjusting your filters or search term.</EmptyDescription>
              <EmptyDescription className="text-md lg:hidden">No resources match your search criteria.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </section>
      ) : (
        <ResourcesTable resources={filteredResources || []} />
      )}
    </main>
  );
}
