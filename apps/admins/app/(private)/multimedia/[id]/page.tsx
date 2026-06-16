import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { MultimediaPage } from '@/components/multimedia/multimedia-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { token } = await runConvex();
  const file = await preloadQuery(api.multimedia.get, { id }, { token });

  return <MultimediaPage preloaded={file} />;
}
