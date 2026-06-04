import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { MeetingsPage } from '@/components/meetings/meetings-page';
import { getConvex } from '@/server/get-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Obtain Id
  const { id } = await params;

  // Obtain Meeting
  const { token } = await getConvex();
  const meeting = await preloadQuery(api.meetings.get, { id }, { token });

  // Return Meeting
  return <MeetingsPage preloaded={meeting} />;
}
