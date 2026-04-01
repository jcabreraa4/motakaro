'use client';

import { useQuery } from 'convex/react';
import { useParams } from '@/hooks/use-params';
import { HeadsetIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { MeetingsTable } from '@/components/meetings/meetings-table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group';
import { CreateDialog } from '@/components/meetings/create-dialog';
import { StarredTable } from '@/components/meetings/starred-table';
import { Calendar } from '@workspace/ui/components/calendar';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { format } from 'date-fns';

export default function Page() {
  const { isLoaded } = useAuth();

  const [dateFilter, setDateFilter] = useParams('date');
  const [searchFilter, setSearchFilter] = useParams('search');
  const [statusFilter, setStatusFilter] = useParams('status');
  const effectiveStatusFilter = statusFilter || 'all';

  const meetings = useQuery(api.meetings.list, isLoaded ? {} : 'skip');

  const selectedDate = dateFilter ? new Date(dateFilter + 'T00:00:00') : undefined;

  function handleDateSelect(day: Date | undefined) {
    setDateFilter(day ? format(day, 'yyyy-MM-dd') : '');
  }

  const starredMeetings = meetings?.filter((meeting) => meeting.starred);

  const filteredMeetings = meetings
    ?.filter((meeting) => searchFilter === '' || meeting.name.toLowerCase().includes(searchFilter.toLowerCase()))
    .filter((meeting) => (effectiveStatusFilter === 'all' ? true : meeting.status.includes(effectiveStatusFilter)))
    .filter((meeting) => !dateFilter || format(new Date(meeting.start), 'yyyy-MM-dd') === dateFilter);

  return (
    <main className="flex w-full overflow-hidden">
      <section className="hidden max-w-100 min-w-100 flex-col gap-5 overflow-hidden overflow-y-auto py-5 pr-0.5 pl-5 xl:flex">
        <CreateDialog variant="outline" />
        <div className="flex flex-col gap-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full rounded-lg border"
            captionLayout="dropdown"
          />
          <Button
            disabled={!selectedDate}
            variant={selectedDate ? 'destructive' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setDateFilter('')}
          >
            <TrashIcon />
            Unselect Date
          </Button>
        </div>
        <StarredTable meetings={starredMeetings || []} />
      </section>
      <div className="flex w-full flex-col gap-3 overflow-hidden p-3 lg:gap-5 lg:p-5">
        <section className="flex flex-col gap-3 lg:flex-row xl:gap-5">
          <Select
            value={effectiveStatusFilter}
            onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger
              disabled={!meetings || meetings.length === 0}
              className="w-full min-w-50 cursor-pointer lg:w-fit"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Meetings</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
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
        ) : filteredMeetings?.length === 0 ? (
          <section className="flex min-h-0 flex-1 items-center justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HeadsetIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">No Meetings Found</EmptyTitle>
                <EmptyDescription className="text-md">No meetings match your search criteria. Try adjusting your filters or search term.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </section>
        ) : (
          <MeetingsTable meetings={filteredMeetings || []} />
        )}
      </div>
    </main>
  );
}
