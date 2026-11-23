// Custom Shadcn Override
import { useSyncExternalStore } from 'react';

// Mobile Breakpoint
const QUERY = '(max-width: 767px)';

// Listen Viewport
function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

// Return State
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
