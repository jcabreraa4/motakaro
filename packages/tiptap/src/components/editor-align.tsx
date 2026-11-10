import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

export function EditorAlign() {
  const { align } = useTiptap();

  const alignments = [
    {
      value: 'left',
      icon: AlignLeftIcon,
      label: 'Align Left',
      isActive: align.isActive('left')
    },
    {
      value: 'center',
      icon: AlignCenterIcon,
      label: 'Align Center',
      isActive: align.isActive('center')
    },
    {
      value: 'right',
      icon: AlignRightIcon,
      label: 'Align Right',
      isActive: align.isActive('right')
    },
    {
      value: 'justify',
      icon: AlignJustifyIcon,
      label: 'Align Justify',
      isActive: align.isActive('justify')
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <AlignLeftIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {alignments.map(({ value, icon: Icon, label, isActive }) => (
          <Button
            key={value}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => align.set(value)}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
