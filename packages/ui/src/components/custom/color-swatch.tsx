import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface ColorSwatchProps {
  color?: string;
  active: boolean;
  onClick: () => void;
}

export function ColorSwatch({ color, active, onClick }: ColorSwatchProps) {
  return (
    <Button
      onClick={onClick}
      style={color ? { backgroundColor: color } : undefined}
      className={cn('size-6 rounded-full border border-black/25 transition-transform hover:scale-110', !color && 'bg-black dark:bg-white', active && 'outline-2 outline-offset-2 outline-black dark:outline-white')}
    />
  );
}
