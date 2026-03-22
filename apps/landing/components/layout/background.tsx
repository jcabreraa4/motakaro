'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Particles } from '@workspace/ui/custom/particles';

export function Background() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setColor(resolvedTheme === 'dark' ? '#ffffff' : '#000000');
  }, [resolvedTheme]);

  return (
    <Particles
      refresh
      ease={80}
      color={color}
      quantity={150}
      className="fixed inset-0 z-[-1]"
    />
  );
}
