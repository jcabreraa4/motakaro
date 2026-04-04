import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { Card, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Meeting } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';
import { StarIcon } from 'lucide-react';

interface StarredsTableProps {
  meetings: Meeting[];
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  className?: string;
}

export function StarredsTable({ meetings, searchFilter, setSearchFilter, className }: StarredsTableProps) {
  if (meetings.length === 0) {
    return (
      <Card className={className}>
        <Empty className="h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <StarIcon className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-xl">No Starred Meetings</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Starred Meetings</CardTitle>
      </CardHeader>
      <div className="mx-1 h-full overflow-y-scroll">
        <div className="flex flex-col gap-3 px-5">
          {meetings.map((meeting) => (
            <Button
              key={meeting._id}
              variant={searchFilter === meeting._id ? 'default' : 'secondary'}
              className={cn('w-full cursor-pointer truncate', searchFilter === meeting._id ? 'border-l-0' : 'border-l-3', meeting.status === 'scheduled' ? 'border-l-motakaro' : meeting.status === 'cancelled' ? 'border-l-red-300' : meeting.status === 'ongoing' ? 'border-l-green-300' : meeting.status === 'finished' ? 'border-l-primary' : 'border-l-yellow-300')}
              onClick={() => (searchFilter === meeting._id ? setSearchFilter('') : setSearchFilter(meeting._id))}
            >
              <span className="w-full truncate text-left">{meeting.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
