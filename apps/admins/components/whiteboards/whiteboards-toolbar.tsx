import { CircleIcon, EraserIcon, HandIcon, type LucideIcon, MousePointer2Icon, PencilIcon, Redo2Icon, SquareIcon, TypeIcon, Undo2Icon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

import { useLayout } from '@/hooks/use-layout';
import { useCanvasStore } from '@/store/canvas-store';

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

function ToolbarButton({ label, icon: Icon, onClick, isActive, isDisabled }: ToolbarButtonProps) {
  const { chatbot } = useLayout();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={isActive ? 'default' : 'ghost'}
          className="cursor-pointer"
          disabled={isDisabled}
          onClick={onClick}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side={chatbot ? 'right' : 'left'}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarSection({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center gap-1 rounded-md border bg-sidebar p-0.5 shadow-md">{children}</div>;
}

export function WhiteboardsToolbar({ whiteboard }: { whiteboard: Whiteboard }) {
  const { chatbot } = useLayout();
  const { activeTool, setActiveTool, canUndo, canRedo, undo, redo, zoomIn, zoomOut } = useCanvasStore();

  return (
    <div className={cn('absolute top-[50%] z-10 flex -translate-y-[50%] flex-col gap-4', chatbot ? 'left-4' : 'right-4')}>
      <ToolbarSection>
        <ToolbarButton
          label="Select"
          icon={MousePointer2Icon}
          isActive={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        />
        <ToolbarButton
          label="Hand"
          icon={HandIcon}
          isActive={activeTool === 'hand'}
          onClick={() => setActiveTool('hand')}
        />
        <ToolbarButton
          label="Pencil"
          icon={PencilIcon}
          isActive={activeTool === 'pencil'}
          onClick={() => setActiveTool('pencil')}
        />
        <ToolbarButton
          label="Text"
          icon={TypeIcon}
          isActive={activeTool === 'text'}
          onClick={() => setActiveTool('text')}
        />
        <ToolbarButton
          label="Rectangle"
          icon={SquareIcon}
          isActive={activeTool === 'rectangle'}
          onClick={() => setActiveTool('rectangle')}
        />
        <ToolbarButton
          label="Ellipse"
          icon={CircleIcon}
          isActive={activeTool === 'ellipse'}
          onClick={() => setActiveTool('ellipse')}
        />
        <ToolbarButton
          label="Eraser"
          icon={EraserIcon}
          isActive={activeTool === 'eraser'}
          onClick={() => setActiveTool('eraser')}
        />
      </ToolbarSection>
      <ToolbarSection>
        <ToolbarButton
          label="Undo"
          icon={Undo2Icon}
          isDisabled={!canUndo}
          onClick={undo}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2Icon}
          isDisabled={!canRedo}
          onClick={redo}
        />
      </ToolbarSection>
      <ToolbarSection>
        <ToolbarButton
          label="Zoom in"
          icon={ZoomInIcon}
          onClick={zoomIn}
        />
        <ToolbarButton
          label="Zoom out"
          icon={ZoomOutIcon}
          onClick={zoomOut}
        />
      </ToolbarSection>
    </div>
  );
}
