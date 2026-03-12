import { usePathname as useSegments } from 'next/navigation';

export function usePathname() {
  const pathname = useSegments();
  const segments = pathname.split('/').filter(Boolean);
  return { segments };
}
