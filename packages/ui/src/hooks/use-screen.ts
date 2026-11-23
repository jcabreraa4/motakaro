import { useSyncExternalStore } from 'react';

// Screen Breakpoints
const SCREENS = [
  ['2xl', '(min-width: 96rem)'],
  ['xl', '(min-width: 80rem)'],
  ['lg', '(min-width: 64rem)'],
  ['md', '(min-width: 48rem)'],
  ['sm', '(min-width: 40rem)']
] as const;

type Screen = (typeof SCREENS)[number][0] | 'base';

// Listen Viewport
function subscribe(cb: () => void) {
  const mqls = SCREENS.map(([, query]) => window.matchMedia(query));
  mqls.forEach((mql) => mql.addEventListener('change', cb));
  return () => mqls.forEach((mql) => mql.removeEventListener('change', cb));
}

// Return Screen
export function useScreen(): Screen {
  return useSyncExternalStore(
    subscribe,
    () => SCREENS.find(([, query]) => window.matchMedia(query).matches)?.[0] ?? 'base',
    () => 'xl'
  );
}
