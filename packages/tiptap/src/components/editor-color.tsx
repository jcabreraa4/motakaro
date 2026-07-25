import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { ColorSwatch } from '@workspace/ui/components/custom/color-swatch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

export function EditorColor() {
  const { tiptap } = useTiptap();

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080', '#FFC0CB', '#A52A2A'];

  const value = tiptap?.getAttributes('textStyle').color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <span
            className="border-b-2 px-1"
            style={{ borderColor: value }}
          >
            A
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid w-fit grid-cols-6 gap-1">
        <ColorSwatch
          active={!value}
          onClick={() => tiptap?.chain().focus().unsetColor().run()}
        />
        {colors.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            active={value === color}
            onClick={() => tiptap?.chain().focus().setColor(color).run()}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
