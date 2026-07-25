import { HighlighterIcon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { ColorSwatch } from '@workspace/ui/components/custom/color-swatch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

export function EditorHighlight() {
  const { tiptap } = useTiptap();

  const colors = ['#FFD54F', '#AED581', '#81C784', '#4FC3F7', '#64B5F6', '#FF8A65', '#FFAB91', '#F48FB1', '#CE93D8', '#E0E0E0', '#BCAAA4'];

  const value = tiptap?.getAttributes('highlight').color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <HighlighterIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid w-fit grid-cols-6 gap-1">
        <ColorSwatch
          active={!value}
          onClick={() => tiptap?.chain().focus().unsetHighlight().run()}
        />
        {colors.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            active={value === color}
            onClick={() => tiptap?.chain().focus().setHighlight({ color }).run()}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
