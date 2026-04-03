import { MediaPage } from '@/components/multimedia/media-page';
import { Id } from '@workspace/backend/_generated/dataModel';
import { api } from '@workspace/backend/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');
  const preloaded = await preloadQuery(api.multimedia.get, { id: id as Id<'multimedia'> }, { token });
  return <MediaPage preloadedMedia={preloaded} />;
}
