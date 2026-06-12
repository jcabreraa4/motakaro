import { useHeaderStore } from '@/store/header-store';

export function useHeader() {
  const breadcrumbs = useHeaderStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useHeaderStore((state) => state.setBreadcrumbs);

  return { breadcrumbs, setBreadcrumbs };
}
