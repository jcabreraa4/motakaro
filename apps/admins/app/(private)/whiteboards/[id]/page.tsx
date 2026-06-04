import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { WhiteboardsPage } from '@/components/whiteboards/whiteboards-page';
import { getConvex } from '@/server/get-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Obtain Id
  const { id } = await params;

  // Obtain Whiteboard
  const { token } = await getConvex();
  const whiteboard = await preloadQuery(api.whiteboards.get, { id }, { token });

  // Return Whiteboard
  return <WhiteboardsPage preloaded={whiteboard} />;
}
