'use client';

import { useQuery } from 'convex/react';
import { useParams } from '@/hooks/use-params';
import { HeadsetIcon, SearchIcon } from 'lucide-react';
import { CreateDialog } from '@/components/meetings/create-dialog';
import { MeetingsTable } from '@/components/meetings/meetings-table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { api } from '@workspace/backend/_generated/api';
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { isLoaded } = useAuth();

  const [searchFilter, setSearchFilter] = useParams('search');
  const [statusFilter, setStatusFilter] = useParams('status');
  const effectiveStatusFilter = statusFilter || 'all';

  const meetings = useQuery(api.meetings.list, isLoaded ? {} : 'skip');
  const filteredMeetings = meetings?.filter((meeting) => searchFilter === '' || meeting.name.toLowerCase().includes(searchFilter.toLowerCase())).filter((meeting) => (effectiveStatusFilter === 'all' ? true : meeting.status.includes(effectiveStatusFilter)));

  return (
    <main className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
      <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
        <Select
          value={effectiveStatusFilter}
          onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger
            disabled={!meetings || meetings.length === 0}
            className="hidden min-w-50 cursor-pointer xl:flex"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="started">Started</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <InputGroup className="flex-1">
          <InputGroupInput
            disabled={!meetings || meetings.length === 0}
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
      {!meetings ? (
        <CircleLoader />
      ) : meetings.length === 0 ? (
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HeadsetIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No Meetings Available</EmptyTitle>
              <EmptyDescription className="text-md">There are no meetings available yet. Get started by booking your first meeting.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateDialog className="min-w-50" />
            </EmptyContent>
          </Empty>
        </section>
      ) : (
        <MeetingsTable meetings={filteredMeetings || []} />
      )}
    </main>
  );
}
