import { MultimediaPage } from '@/components/multimedia/multimedia-page';
import { Id } from '@workspace/backend/_generated/dataModel';
import { api } from '@workspace/backend/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Page({ params }: { params: Promise<{ id: Id<'multimedia'> }> }) {
  // Obtain Id
  const { id } = await params;

  // Authenticate Convex
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');

  // Obtain Preloaded
  const preloaded = await preloadQuery(api.multimedia.clientsGet, { id }, { token });

  // Return Page
  return <MultimediaPage preloaded={preloaded} />;
}
