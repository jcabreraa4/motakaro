import type { Route } from 'next';
import { redirect } from 'next/navigation';

const redirectPage = process.env.NEXT_PUBLIC_REDIRECT_PAGE!;

export default function Page() {
  redirect(redirectPage as Route);
}
