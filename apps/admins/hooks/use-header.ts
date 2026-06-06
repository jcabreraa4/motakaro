import { useShallow } from 'zustand/react/shallow';

import { useHeaderStore } from '@/store/header-store';

export function useHeader() {
  return useHeaderStore(
    useShallow((state) => ({
      subroute: state.subroute,
      setSubroute: state.setSubroute
    }))
  );
}
