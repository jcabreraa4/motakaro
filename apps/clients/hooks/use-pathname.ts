import { usePathname as usePath } from 'next/navigation';

export function usePathname() {
  const pathname = usePath();
  const segments = pathname.split('/').filter(Boolean);
  return { pathname, segments };
}
