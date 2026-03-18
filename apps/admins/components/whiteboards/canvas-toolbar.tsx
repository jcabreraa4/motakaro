import { type LucideIcon, CircleIcon, MousePointer2Icon, PencilIcon, Redo2Icon, SquareIcon, StickyNoteIcon, TypeIcon, Undo2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { Button } from '@workspace/ui/components/button';
import { useAppStateStore } from '@/store/state-store';
import { cn } from '@workspace/ui/lib/utils';

type ToolbarButton = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

interface ToolbarButtonProps extends ToolbarButton {
  showChat: boolean;
}

function ToolbarButton({ label, icon: Icon, onClick, isActive, isDisabled, showChat }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={isActive ? 'default' : 'ghost'}
          disabled={isDisabled}
          className="cursor-pointer"
          onClick={onClick}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side={showChat ? 'right' : 'left'}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface CanvasToolbarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface ToolbarSection {
  buttons: ToolbarButton[];
}

export function CanvasToolbar({ undo, redo, canUndo, canRedo }: CanvasToolbarProps) {
  const showChat = useAppStateStore((state) => state.showChat);

  const toolbarSections: ToolbarSection[] = [
    {
      buttons: [
        {
          label: 'Select',
          icon: MousePointer2Icon,
          onClick: () => {},
          isActive: false
        },
        {
          label: 'Text',
          icon: TypeIcon,
          onClick: () => {},
          isActive: false
        },
        {
          label: 'Note',
          icon: StickyNoteIcon,
          onClick: () => {},
          isActive: false
        },
        {
          label: 'Rectangle',
          icon: SquareIcon,
          onClick: () => {},
          isActive: false
        },
        {
          label: 'Ellipse',
          icon: CircleIcon,
          onClick: () => {},
          isActive: false
        },
        {
          label: 'Pencil',
          icon: PencilIcon,
          onClick: () => {},
          isActive: false
        }
      ]
    },
    {
      buttons: [
        {
          label: 'Undo',
          icon: Undo2Icon,
          onClick: () => {},
          isDisabled: true
        },
        {
          label: 'Redo',
          icon: Redo2Icon,
          onClick: () => {},
          isDisabled: true
        }
      ]
    }
  ];

  return (
    <div className={cn('absolute top-[50%] flex -translate-y-[50%] flex-col gap-4', showChat ? 'left-4' : 'right-4')}>
      {toolbarSections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-1 rounded-md border bg-sidebar p-0.5 shadow-md"
        >
          {section.buttons.map((button) => (
            <ToolbarButton
              key={button.label}
              showChat={showChat}
              {...button}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
