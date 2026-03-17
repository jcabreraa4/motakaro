'use clinet';

import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';

export function Canvas() {
  return (
    <main className="relative w-full touch-none bg-sidebar">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
}
