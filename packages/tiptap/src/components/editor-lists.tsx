import { ListIcon, ListOrderedIcon, ListTodoIcon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

export function EditorLists() {
  const { structure } = useTiptap();

  const lists = [
    {
      icon: ListIcon,
      label: 'Bullet List',
      isActive: structure.bulletList.isActive,
      onClick: structure.bulletList.toggle
    },
    {
      icon: ListOrderedIcon,
      label: 'Ordered List',
      isActive: structure.orderedList.isActive,
      onClick: structure.orderedList.toggle
    },
    {
      icon: ListTodoIcon,
      label: 'Task List',
      isActive: structure.taskList.isActive,
      onClick: structure.taskList.toggle
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <ListIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {lists.map(({ icon: Icon, label, isActive, onClick }) => (
          <Button
            key={label}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={onClick}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
