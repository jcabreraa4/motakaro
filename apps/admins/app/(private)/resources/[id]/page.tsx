import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { ResourcesPage } from '@/components/resources/resources-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { token } = await runConvex();
  const resource = await preloadQuery(api.resources.get, { id }, { token });

  return <ResourcesPage preloaded={resource} />;
}
