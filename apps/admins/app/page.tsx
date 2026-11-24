import type { Route } from 'next';
import { redirect } from 'next/navigation';

import { env } from '@/env';

const redirectPage = env.NEXT_PUBLIC_REDIRECT_PAGE;

export default function Page() {
  redirect(redirectPage as Route);
}
