'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push(redirectPage);
  });
  return <main></main>;
}
