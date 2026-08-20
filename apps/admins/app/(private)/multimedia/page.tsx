'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ImageIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Kbd, KbdGroup } from '@workspace/ui/components/kbd';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

import { AppSection } from '@/components/layout/app-section';
import { MultimediaTable } from '@/components/multimedia/multimedia-table';
import { MultimediaUpload } from '@/components/multimedia/multimedia-upload';
import { useParams } from '@/hooks/use-params';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [typeFilter, setTypeFilter] = useParams('type');
  const effectiveTypeFilter = typeFilter || 'all';

  const multimedia = useQuery(api.multimedia.list, isLoaded ? {} : 'skip');

  const filtered = multimedia?.filter((file) => {
    const matchesSearch = searchFilter === '' || file.name.toLowerCase().includes(searchFilter.toLowerCase()) || file._id.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType = effectiveTypeFilter === 'all' || file.type.includes(effectiveTypeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <AppSection className="flex flex-col gap-3 md:gap-5">
      <section className="flex flex-col gap-3 lg:flex-row lg:gap-5">
        <Select
          value={effectiveTypeFilter}
          onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger
            disabled={!multimedia || multimedia.length === 0}
            className="hidden min-w-50 xl:flex"
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
        <MultimediaUpload>
          <Button
            variant="outline"
            className="min-w-50"
          >
            <PlusIcon />
            Upload File
          </Button>
        </MultimediaUpload>
      </section>
      {!multimedia ? (
        <GenericLoader />
      ) : multimedia.length === 0 ? (
        <EmptySection
          icon={ImageIcon}
          title="No Multimedia Available"
          description="There are currently no files available."
        >
          <MultimediaUpload>
            <Button className="min-w-50">
              <PlusIcon />
              Upload File
            </Button>
          </MultimediaUpload>
        </EmptySection>
      ) : filtered?.length === 0 ? (
        <EmptySection
          icon={ImageIcon}
          title="No Multimedia Found"
          description="No files match your search criteria."
        />
      ) : (
        <MultimediaTable multimedia={filtered || []} />
      )}
    </AppSection>
  );
}
