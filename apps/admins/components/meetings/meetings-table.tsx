import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { CheckCircleIcon, ExternalLinkIcon, SettingsIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Meeting } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export function MeetingsTable({ meetings }: { meetings: Meeting[] }) {
  const router = useRouter();

  function handleManage(id: string) {
    if (!id) return;
    router.push(`/meetings/${id}`);
  }

  function handleOpen(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  return (
    <section className="flex flex-col gap-5 overflow-y-scroll p-0.5 lg:pe-3">
      {meetings.map((meeting) => (
        <Card
          key={meeting._id}
          className="min-h-fit"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={cn('pointer-events-none rounded-lg p-2 text-black select-none lg:w-30', meeting.status === 'scheduled' ? 'bg-green-300' : meeting.status === 'rejected' ? 'bg-red-300' : meeting.status === 'started' ? 'animate-pulse bg-motakaro text-white' : meeting.status === 'finished' ? 'bg-yellow-300' : 'bg-black text-white dark:bg-white dark:text-black')}>
                <span className="hidden justify-center text-sm font-bold lg:flex">{meeting.status.toUpperCase()}</span>
                <span className="lg:hidden">
                  <CheckCircleIcon className="size-5" />
                </span>
              </div>
              <span className="truncate text-sm lg:text-lg">{meeting.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p>
              <span className="pointer-events-none font-semibold select-none">Starting: </span>
              {format(meeting.start, "EEEE, d 'of' MMMM yyyy, HH:mm")}
            </p>
            <p>
              <span className="pointer-events-none font-semibold select-none">Organizer: </span>
              {meeting.organizer}
            </p>
            {meeting.attendees.length > 1 && (
              <p>
                <span className="pointer-events-none font-semibold select-none">Other Attendees: </span>
                {meeting.attendees
                  .filter((attendee) => attendee !== meeting.organizer)
                  .map((attendee) => attendee)
                  .join(', ')}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleManage(meeting._id)}
            >
              <SettingsIcon />
              Manage Meeting
            </Button>
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleOpen(meeting.url)}
            >
              <ExternalLinkIcon />
              Open Meeting
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
