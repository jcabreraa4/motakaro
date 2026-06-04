import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { ResourcePage } from '@/components/resources/resources-page';
import { getConvex } from '@/server/get-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Obtain Id
  const { id } = await params;

  // Obtain Resource
  const { token } = await getConvex();
  const resource = await preloadQuery(api.resources.get, { id }, { token });

  // Return Resource
  return <ResourcePage preloaded={resource} />;
}
