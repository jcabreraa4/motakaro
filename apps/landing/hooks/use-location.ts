import { usePathname } from 'next/navigation';

export function useLocation() {
  const pathname = usePathname();

  const routes = pathname.split('/').filter(Boolean);
  const section = routes[0];

  return { pathname, routes, section };
}
