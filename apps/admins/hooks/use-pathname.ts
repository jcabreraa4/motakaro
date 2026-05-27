import { usePathname as usePath, useSearchParams } from 'next/navigation';

export function usePathname() {
  const pathname = usePath();
  const searchParams = useSearchParams();

  const segments = pathname.split('/').filter(Boolean);

  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  return { pathname, segments, fullPath };
}
