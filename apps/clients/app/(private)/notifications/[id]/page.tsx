'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

import { CircleLoader } from '@workspace/ui/custom/loaders';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.push(`/notifications?search=${id}`);
  }, [id, router]);

  return <CircleLoader />;
}
