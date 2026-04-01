import { CalendarX2Icon, CheckCircleIcon, CircleSlash, ClockIcon, ExternalLinkIcon, RadioIcon, SettingsIcon, StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useAppStateStore } from '@/store/state-store';
import { Meeting } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function MeetingsTable({ meetings }: { meetings: Meeting[] }) {
  const router = useRouter();

  const showChat = useAppStateStore((state) => state.showChat);

  const updateMeeting = useMutation(api.meetings.update);

  function handleManage(id: string) {
    if (!id) return;
    router.push(`/meetings/${id}`);
  }

  function handleOpen(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  return (
    <section className="flex w-full flex-col gap-5 overflow-y-scroll p-0.5 lg:pe-3">
      {meetings.map((meeting) => (
        <Card
          key={meeting._id}
          className="min-h-fit"
        >
          <CardHeader>
            <CardTitle className={cn('flex items-center gap-3 truncate', showChat && 'lg:flex-col lg:items-start lg:gap-5')}>
              <div className={cn('pointer-events-none flex max-w-40 items-center justify-center rounded-lg p-2 text-black select-none lg:min-w-40', meeting.status === 'scheduled' ? 'bg-motakaro text-white' : meeting.status === 'cancelled' ? 'bg-red-300' : meeting.status === 'ongoing' ? 'animate-pulse bg-green-300' : meeting.status === 'finished' ? 'bg-primary text-white dark:text-black' : 'bg-yellow-300')}>
                <div className="flex gap-2">
                  {meeting.status === 'scheduled' ? <ClockIcon className="size-5" /> : meeting.status === 'cancelled' ? <CalendarX2Icon className="size-5" /> : meeting.status === 'ongoing' ? <RadioIcon className="size-5" /> : meeting.status === 'finished' ? <CheckCircleIcon className="size-5" /> : <CircleSlash className="size-5" />}
                  <span className="hidden justify-center text-sm font-bold lg:flex">{meeting.status.toUpperCase()}</span>
                </div>
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
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant={meeting.starred ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => updateMeeting({ id: meeting._id, starred: !meeting.starred }).finally(() => toast.success(meeting.starred ? 'Meeting removed from starred successfully.' : 'Meeting added to starred successfully.'))}
            >
              <StarIcon />
            </Button>
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleOpen(meeting.url)}
            >
              <ExternalLinkIcon />
              {!showChat && <span>Open Meeting</span>}
            </Button>
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleManage(meeting._id)}
            >
              <SettingsIcon />
              Manage Meeting
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
