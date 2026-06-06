'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

import { GenericLoader } from '@workspace/ui/custom/generic-loader';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.push(`/notifications?search=${id}`);
  }, [id, router]);

  return <GenericLoader />;
}
