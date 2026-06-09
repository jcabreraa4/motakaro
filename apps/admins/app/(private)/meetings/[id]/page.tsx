import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { MeetingsPage } from '@/components/meetings/meetings-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Obtain Id
  const { id } = await params;

  // Obtain Meeting
  const { token } = await runConvex();
  const meeting = await preloadQuery(api.meetings.get, { id }, { token });

  // Return Meeting
  return <MeetingsPage preloaded={meeting} />;
}
