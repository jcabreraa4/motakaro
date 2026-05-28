'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { HeadsetIcon, SearchIcon, TrashIcon, XIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { Card, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@workspace/ui/components/input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { CircleLoader } from '@workspace/ui/custom/loaders';

import { CreateDialog } from '@/components/meetings/create-dialog';
import { MeetingsTable } from '@/components/meetings/meetings-table';
import { StarredsTable } from '@/components/meetings/starreds-table';
import { useParams } from '@/hooks/use-params';

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
  const filteredMeetings = meetings?.filter((meeting) => {
    const matchesSearch = searchFilter === '' || meeting.name.toLowerCase().includes(searchFilter.toLowerCase()) || meeting._id.toLowerCase().includes(searchFilter.toLowerCase()) || meeting.organizer.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = effectiveStatusFilter === 'all' || meeting.status.includes(effectiveStatusFilter);
    const matchesDate = !dateFilter || format(new Date(meeting.start), 'yyyy-MM-dd') === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

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
        {!meetings ? (
          <Card className="h-full min-h-45">
            <CardHeader>
              <CardTitle>Starred Meetings</CardTitle>
            </CardHeader>
            <div className="mx-1 h-full overflow-y-scroll">
              <div className="flex flex-col gap-3 px-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <Skeleton
                    key={index}
                    className="h-9 w-full"
                  />
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <StarredsTable
            meetings={starredMeetings || []}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            className="h-full min-h-45"
          />
        )}
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
                <SelectItem value="all">Unfiltered</SelectItem>
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
        </section>
        {!meetings ? (
          <CircleLoader />
        ) : meetings.length === 0 ? (
          <section className="flex min-h-0 flex-1 items-center justify-center select-none">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HeadsetIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">No Meetings Available</EmptyTitle>
                <EmptyDescription className="text-md hidden lg:block">There are no meetings available yet. Get started by booking your first meeting.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateDialog className="min-w-50" />
              </EmptyContent>
            </Empty>
          </section>
        ) : filteredMeetings?.length === 0 ? (
          <section className="flex min-h-0 flex-1 items-center justify-center select-none">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HeadsetIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle className="text-xl">No Meetings Found</EmptyTitle>
                <EmptyDescription className="text-md hidden lg:block">No meetings match your search criteria. Try adjusting your filters or search term.</EmptyDescription>
                <EmptyDescription className="text-md lg:hidden">No meetings match your search criteria.</EmptyDescription>
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
