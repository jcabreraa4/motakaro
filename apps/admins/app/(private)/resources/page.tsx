'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ListVideoIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Kbd, KbdGroup } from '@workspace/ui/components/kbd';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

import { AppSection } from '@/components/layout/app-section';
import { ResourcesCreate } from '@/components/resources/resources-create';
import { ResourcesTable } from '@/components/resources/resources-table';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [statusFilter, setStatusFilter] = useParams('published');
  const effectiveStatusFilter = statusFilter || 'all';

  const resources = useQuery(api.resources.list, isLoaded ? {} : 'skip');

  const filtered = resources?.filter((resource) => {
    const matchesSearch = searchFilter === '' || resource.name.toLowerCase().includes(searchFilter.toLowerCase()) || resource._id.toLowerCase().includes(searchFilter.toLowerCase()) || resource.link.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = effectiveStatusFilter === 'all' || resource.published === (effectiveStatusFilter === 'true');
    return matchesSearch && matchesStatus;
  });

  return (
    <AppSection className="flex flex-col gap-3 md:gap-5">
      <section className="flex flex-col gap-3 lg:flex-row lg:gap-5">
        <Select
          value={effectiveStatusFilter}
          onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger
            disabled={!resources || resources.length === 0}
            className="hidden min-w-50 xl:flex"
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
                className="hover:bg-transparent"
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
        <ResourcesCreate>
          <Button
            variant="outline"
            className="min-w-50"
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
            <Button className="min-w-50">
              <PlusIcon />
              Create Resource
            </Button>
          </ResourcesCreate>
        </EmptySection>
      ) : filtered?.length === 0 ? (
        <EmptySection
          icon={ListVideoIcon}
          title="No Resources Found"
          description="No resources match your search criteria."
        />
      ) : (
        <ResourcesTable resources={filtered || []} />
      )}
    </AppSection>
  );
}
