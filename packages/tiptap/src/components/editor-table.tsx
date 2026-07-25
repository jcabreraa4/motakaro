import { TableIcon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

export function EditorTable() {
  const { insertTable } = useTiptap();

  const sizes = [
    {
      rows: 1,
      cols: 1
    },
    {
      rows: 2,
      cols: 2
    },
    {
      rows: 3,
      cols: 3
    },
    {
      rows: 4,
      cols: 4
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <TableIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sizes.map((size, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => insertTable(size)}
          >
            {size.rows} x {size.cols}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
