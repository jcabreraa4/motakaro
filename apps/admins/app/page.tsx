'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const signInPage = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!;

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push(signInPage);
  });
  return <main></main>;
}
