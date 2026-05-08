import { type LucideIcon, CircleIcon, EraserIcon, MousePointer2Icon, PencilIcon, Redo2Icon, SquareIcon, TypeIcon, Undo2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { useCanvasStore, type Tool } from '@/store/canvas-store';
import { Button } from '@workspace/ui/components/button';
import { useMainStore } from '@/store/main-store';
import { cn } from '@workspace/ui/lib/utils';

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  showChatbot: boolean;
}

function ToolbarButton({ label, icon: Icon, onClick, isActive, isDisabled, showChatbot }: ToolbarButtonProps) {
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
      <TooltipContent side={showChatbot ? 'right' : 'left'}>
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

export function WhiteboardsToolbar() {
  const showChatbot = useMainStore((state) => state.showChatbot);
  const { activeTool, setActiveTool, canUndo, canRedo, undo, redo } = useCanvasStore();

  return (
    <div className={cn('absolute top-[50%] z-10 flex -translate-y-[50%] flex-col gap-4', showChatbot ? 'left-4' : 'right-4')}>
      <div className="flex flex-col items-center gap-1 rounded-md border bg-sidebar p-0.5 shadow-md">
        {tools.map(({ label, icon, tool }) => (
          <ToolbarButton
            key={tool}
            label={label}
            icon={icon}
            showChatbot={showChatbot}
            isActive={activeTool === tool}
            onClick={() => setActiveTool(tool)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 rounded-md border bg-sidebar p-0.5 shadow-md">
        <ToolbarButton
          label="Undo"
          icon={Undo2Icon}
          showChatbot={showChatbot}
          isDisabled={!canUndo}
          onClick={undo}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2Icon}
          showChatbot={showChatbot}
          isDisabled={!canRedo}
          onClick={redo}
        />
      </div>
    </div>
  );
}
