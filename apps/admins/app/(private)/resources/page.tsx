'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ListVideoIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { EmptySection } from '@workspace/ui/custom/empty-section';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { ResourcesCreate } from '@/components/resources/resources-create';
import { ResourcesTable } from '@/components/resources/resources-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [statusFilter, setStatusFilter] = useParams('published');
  const effectiveStatusFilter = statusFilter || 'all';

  const resources = useQuery(api.resources.list, isLoaded ? {} : 'skip');
  const filteredResources = resources?.filter((resource) => {
    const matchesSearch = searchFilter === '' || resource.name.toLowerCase().includes(searchFilter.toLowerCase()) || resource._id.toLowerCase().includes(searchFilter.toLowerCase()) || resource.link.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = effectiveStatusFilter === 'all' || resource.published === (effectiveStatusFilter === 'true');
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 md:gap-5 md:p-5">
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
        <ResourcesCreate>
          <Button
            variant="outline"
            className="min-w-50 cursor-pointer"
          >
            <PlusIcon />
            Create Resource
          </Button>
        </ResourcesCreate>
      </section>
      {!resources ? (
        <GenericLoader />
      ) : resources.length === 0 ? (
        <EmptySection
          icon={ListVideoIcon}
          title="No Resources Available"
          description="There are currently no resources available."
        >
          <ResourcesCreate>
            <Button className="min-w-50 cursor-pointer">
              <PlusIcon />
              Create Resource
            </Button>
          </ResourcesCreate>
        </EmptySection>
      ) : filteredResources?.length === 0 ? (
        <EmptySection
          icon={ListVideoIcon}
          title="No Resources Found"
          description="No resources match your search criteria."
        />
      ) : (
        <ResourcesTable resources={filteredResources || []} />
      )}
    </main>
  );
}
