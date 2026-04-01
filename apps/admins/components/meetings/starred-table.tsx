import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Card, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty';
import { Meeting } from '@workspace/backend/schema';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';

export function StarredTable({ meetings }: { meetings: Meeting[] }) {
  const router = useRouter();

  const updateMeeting = useMutation(api.meetings.update);

  function handleManage(id: string) {
    if (!id) return;
    router.push(`/meetings/${id}`);
  }

  if (meetings.length === 0) {
    return (
      <Card className="h-full min-h-45">
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
    <Card className="h-full min-h-45">
      <CardHeader>
        <CardTitle>Starred Meetings</CardTitle>
      </CardHeader>
      <div className="mx-1 h-full overflow-y-scroll">
        <div className="flex flex-col gap-3 px-5">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="flex gap-2"
            >
              <Button
                variant="secondary"
                className="flex-1 cursor-pointer truncate"
                onClick={() => handleManage(meeting._id)}
              >
                <span className="w-full truncate text-left">{meeting.name}</span>
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => updateMeeting({ id: meeting._id, starred: false }).finally(() => toast.success('Meeting removed from starred successfully.'))}
              >
                <StarIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
