import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

export function EditorAlign() {
  const { tiptap } = useTiptap();

  const alignments = [
    {
      value: 'left',
      icon: AlignLeftIcon,
      label: 'Align Left',
      isActive: tiptap?.isActive({ textAlign: 'left' })
    },
    {
      value: 'center',
      icon: AlignCenterIcon,
      label: 'Align Center',
      isActive: tiptap?.isActive({ textAlign: 'center' })
    },
    {
      value: 'right',
      icon: AlignRightIcon,
      label: 'Align Right',
      isActive: tiptap?.isActive({ textAlign: 'right' })
    },
    {
      value: 'justify',
      icon: AlignJustifyIcon,
      label: 'Align Justify',
      isActive: tiptap?.isActive({ textAlign: 'justify' })
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <AlignLeftIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {alignments.map(({ value, icon: Icon, label, isActive }) => (
          <Button
            key={value}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => tiptap?.chain().focus().setTextAlign(value).run()}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
