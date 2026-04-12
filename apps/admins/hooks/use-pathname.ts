import { useSearchParams, usePathname as useSegments } from 'next/navigation';

export function usePathname() {
  const pathname = useSegments();
  const searchParams = useSearchParams();

  const segments = pathname.split('/').filter(Boolean);

  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  return { segments, fullPath };
}
