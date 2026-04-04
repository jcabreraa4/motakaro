import { type LucideIcon, CircleIcon, EraserIcon, MousePointer2Icon, PencilIcon, Redo2Icon, SquareIcon, TypeIcon, Undo2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { useCanvasStore, type Tool } from '@/store/canvas-store';
import { Button } from '@workspace/ui/components/button';
import { useAppStateStore } from '@/store/state-store';
import { cn } from '@workspace/ui/lib/utils';

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
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

const tools: { label: string; icon: LucideIcon; tool: Tool }[] = [
  {
    label: 'Select',
    icon: MousePointer2Icon,
    tool: 'select'
  },
  {
    label: 'Pencil',
    icon: PencilIcon,
    tool: 'pencil'
  },
  {
    label: 'Text',
    icon: TypeIcon,
    tool: 'text'
  },
  {
    label: 'Rectangle',
    icon: SquareIcon,
    tool: 'rectangle'
  },
  {
    label: 'Ellipse',
    icon: CircleIcon,
    tool: 'ellipse'
  },
  {
    label: 'Eraser',
    icon: EraserIcon,
    tool: 'eraser'
  }
];

export function CanvasToolbar() {
  const showChat = useAppStateStore((state) => state.showChat);
  const { activeTool, setActiveTool, canUndo, canRedo, undo, redo } = useCanvasStore();

  return (
    <div className={cn('absolute top-[50%] z-10 flex -translate-y-[50%] flex-col gap-4', showChat ? 'left-4' : 'right-4')}>
      <div className="flex flex-col items-center gap-1 rounded-md border bg-sidebar p-0.5 shadow-md">
        {tools.map(({ label, icon, tool }) => (
          <ToolbarButton
            key={tool}
            label={label}
            icon={icon}
            showChat={showChat}
            isActive={activeTool === tool}
            onClick={() => setActiveTool(tool)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 rounded-md border bg-sidebar p-0.5 shadow-md">
        <ToolbarButton
          label="Undo"
          icon={Undo2Icon}
          showChat={showChat}
          isDisabled={!canUndo}
          onClick={undo}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2Icon}
          showChat={showChat}
          isDisabled={!canRedo}
          onClick={redo}
        />
      </div>
    </div>
  );
}
