'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ImageIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { CircleLoader } from '@workspace/ui/custom/loaders';

import { MediaTable } from '@/components/multimedia/multimedia-table';
import { UploadDialog } from '@/components/multimedia/upload-dialog';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [typeFilter, setTypeFilter] = useParams('type');
  const effectiveTypeFilter = typeFilter || 'all';

  const multimedia = useQuery(api.multimedia.list, isLoaded ? {} : 'skip');
  const filteredMultimedia = multimedia?.filter((file) => {
    const matchesSearch = searchFilter === '' || file.name.toLowerCase().includes(searchFilter.toLowerCase()) || file.note.toLowerCase().includes(searchFilter.toLowerCase()) || file._id.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = effectiveTypeFilter === 'all' || file.type.includes(effectiveTypeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
      <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
        <Select
          value={effectiveTypeFilter}
          onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger
            disabled={!multimedia || multimedia.length === 0}
            className="hidden min-w-50 cursor-pointer xl:flex"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Unfiltered</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audios</SelectItem>
              <SelectItem value="pdf">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <InputGroup>
          <InputGroupInput
            disabled={!multimedia || multimedia.length === 0}
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
        <UploadDialog
          variant="outline"
          className="min-w-50"
        />
      </section>
      {!multimedia ? (
        <CircleLoader />
      ) : multimedia.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center select-none">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Multimedia Available</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">You haven&apos;t uploaded any files yet. Get started by uploading your first file.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <UploadDialog className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : filteredMultimedia?.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center select-none">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Multimedia Found</EmptyTitle>
              <EmptyDescription className="text-md hidden lg:block">No multimedia match your search criteria. Try adjusting your filters or search term.</EmptyDescription>
              <EmptyDescription className="text-md lg:hidden">No multimedia match your search criteria.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </section>
      ) : (
        <MediaTable multimedia={filteredMultimedia || []} />
      )}
    </main>
  );
}
