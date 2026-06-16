import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { WhiteboardsPage } from '@/components/whiteboards/whiteboards-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { token } = await runConvex();
  const whiteboard = await preloadQuery(api.whiteboards.get, { id }, { token });

  return <WhiteboardsPage preloaded={whiteboard} />;
}
