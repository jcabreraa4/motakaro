import BoardPage from '@/components/blackboards/board-page';
import { api } from '@workspace/backend/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');
  const preloadedBlackboard = await preloadQuery(api.blackboards.get, { id }, { token });
  return <BoardPage preloadedBlackboard={preloadedBlackboard} />;
}
