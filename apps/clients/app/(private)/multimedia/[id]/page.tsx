import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { MultimediaPage } from '@/components/multimedia/multimedia-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Obtain Id
  const { id } = await params;

  // Obtain File
  const { token } = await runConvex();
  const file = await preloadQuery(api.multimedia.clientGet, { id }, { token });

  // Return File
  return <MultimediaPage preloaded={file} />;
}
